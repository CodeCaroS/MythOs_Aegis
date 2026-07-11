import fs from 'node:fs';
import path from 'node:path';

const roots = process.argv.slice(2);
const scanRoots = roots.length > 0 ? roots : ['.agents/skills'];
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

function skillNameFromPath(skillPath) {
  return path.basename(path.dirname(skillPath));
}

function displayName(name) {
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function readSkillInventory() {
  if (!fs.existsSync('agents.json')) {
    failures.push('agents.json: missing inventory');
    return [];
  }

  const inventory = JSON.parse(fs.readFileSync('agents.json', 'utf8'));
  if (!Array.isArray(inventory)) {
    failures.push('agents.json: expected an array inventory');
    return [];
  }

  return inventory;
}

function readReadmeSkills() {
  if (!fs.existsSync('README.md')) {
    failures.push('README.md: missing inventory');
    return [];
  }

  const lines = fs.readFileSync('README.md', 'utf8').split(/\r?\n/);
  const skills = [];
  let inSkills = false;

  for (const line of lines) {
    if (/^##\s+Skills\s*$/.test(line)) {
      inSkills = true;
      continue;
    }
    if (inSkills && /^##\s+/.test(line)) {
      break;
    }
    if (!inSkills) {
      continue;
    }
    const match = line.match(/^\s*-\s+`\.agents\/skills\/([^/]+)\/`\s+for\s+/);
    if (match) {
      skills.push(match[1]);
    }
  }

  return skills;
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

const dirNames = skillFiles.map(skillNameFromPath).sort();
const inventory = readSkillInventory();
const inventoryNames = inventory.map(item => path.basename(path.dirname(item.Path))).sort();
const readmeNames = readReadmeSkills().sort();

for (const file of skillFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const frontMatter = readFrontMatter(content);

  if (!frontMatter) {
    failures.push(`${file}: missing YAML frontmatter`);
    continue;
  }

  const requiredKeys = ['name', 'description', 'version', 'author', 'license', 'tags'];
  const keys = keysFromFrontMatter(frontMatter);
  for (const requiredKey of requiredKeys) {
    if (!keys.includes(requiredKey)) {
      failures.push(`${file}: missing required frontmatter key '${requiredKey}'`);
    }
  }

  const expectedName = skillNameFromPath(file);
  const nameValue = findNameValue(frontMatter);
  if (nameValue && nameValue !== expectedName) {
    failures.push(`${file}: name should match folder name '${expectedName}'`);
  }
}

const dirSet = new Set(dirNames);
const inventorySet = new Set(inventoryNames);
const readmeSet = new Set(readmeNames);

for (const name of dirNames) {
  if (!inventorySet.has(name)) {
    failures.push(`agents.json: missing skill '${displayName(name)}'`);
  }
  if (!readmeSet.has(name)) {
    failures.push(`README.md: missing skill '${displayName(name)}'`);
  }
}

for (const name of inventoryNames) {
  if (!dirSet.has(name)) {
    failures.push(`agents.json: references missing skill directory '${name}'`);
  }
  if (!readmeSet.has(name)) {
    failures.push(`README.md: missing skill '${displayName(name)}'`);
  }
}

for (const name of readmeNames) {
  if (!dirSet.has(name)) {
    failures.push(`README.md: references missing skill directory '${name}'`);
  }
}

if (failures.length > 0) {
  for (const failure of [...new Set(failures)].sort()) {
    console.log(failure);
  }
  process.exit(1);
}

console.log(`skill-guard: checked ${skillFiles.length} SKILL.md files, inventory is consistent.`);
