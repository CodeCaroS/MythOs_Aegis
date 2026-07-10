import fs from 'node:fs';
import path from 'node:path';

const roots = process.argv.slice(2);
const scanRoots = roots.length > 0 ? roots : ['.agents/skills'];
const requiredKeys = ['name', 'description', 'version', 'author', 'license', 'tags'];
const failures = [];

function walk(dir) {
  const entries = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      entries.push(...walk(fullPath));
    } else if (entry.isFile() && entry.name === 'SKILL.md') {
      entries.push(fullPath);
    }
  }
  return entries;
}

function readFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  return match ? match[1] : null;
}

function keysFromFrontMatter(frontMatter) {
  const keys = [];
  for (const line of frontMatter.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z0-9_-]+):/);
    if (match) {
      keys.push(match[1]);
    }
  }
  return keys;
}

function findNameValue(frontMatter) {
  const match = frontMatter.match(/^\s*name:\s*(.+?)\s*$/m);
  return match ? match[1].trim() : null;
}

const skillFiles = [];
for (const root of scanRoots) {
  if (fs.existsSync(root)) {
    const stat = fs.statSync(root);
    if (stat.isDirectory()) {
      skillFiles.push(...walk(root));
    } else if (stat.isFile() && path.basename(root) === 'SKILL.md') {
      skillFiles.push(root);
    }
  }
}

for (const file of skillFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const frontMatter = readFrontMatter(content);

  if (!frontMatter) {
    failures.push(`${file}: missing YAML frontmatter`);
    continue;
  }

  const keys = keysFromFrontMatter(frontMatter);
  for (const requiredKey of requiredKeys) {
    if (!keys.includes(requiredKey)) {
      failures.push(`${file}: missing required frontmatter key '${requiredKey}'`);
    }
  }

  const expectedName = path.basename(path.dirname(file));
  const nameValue = findNameValue(frontMatter);
  if (nameValue && nameValue !== expectedName) {
    failures.push(`${file}: name should match folder name '${expectedName}'`);
  }
}

if (failures.length > 0) {
  for (const failure of [...new Set(failures)].sort()) {
    console.log(failure);
  }
  process.exit(1);
}

console.log(`skill-guard: checked ${skillFiles.length} SKILL.md files, no issues found.`);
