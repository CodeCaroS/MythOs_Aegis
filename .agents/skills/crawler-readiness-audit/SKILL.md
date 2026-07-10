---
name: crawler-readiness-audit
description: Audit whether a website is understandable to search engines, AI crawlers, link previews, and JavaScript-limited clients. Use when checking SSR, prerendering, metadata, internal links, canonical URLs, robots directives, structured data, or whether important content depends on client-side JavaScript.
---

# Crawler Readiness Audit

Use this skill to judge whether a site is indexable and readable before JavaScript executes. A normal browser view is not enough.

## What to check

- Initial HTML: meaningful title, description, headings, body text, canonical URL, robots directives, structured data, and real internal links.
- Crawler view: request pages with a crawler user agent such as Googlebot or Bingbot and compare with normal browser output.
- Rendered view: compare the browser-rendered page with the raw response and note anything critical that only appears after hydration.
- Route coverage: inspect homepage plus representative public routes such as product, category, article, pricing, docs, contact, nested, dynamic, and 404 pages.
- Indexability: check `robots.txt`, `meta robots`, `X-Robots-Tag`, canonical tags, redirects, status codes, and sitemap URLs.
- Discovery: verify important navigation uses real anchor tags with `href`, not click handlers.
- Structured data: validate JSON-LD in the initial HTML and make sure it matches visible content.

## How to audit

1. Identify the actual rendering model from server responses and config. Do not assume framework name implies SSR.
2. Fetch key URLs without JavaScript and inspect the raw HTML.
3. Fetch the same URLs with a crawler user agent.
4. Open the page in a real browser with JavaScript enabled and compare content, metadata, and links.
5. Classify each route:
   - Pass: meaningful page-specific HTML is present immediately.
   - Partial: some content exists, but important content or links depend on JavaScript.
   - Fail: the HTML shell is effectively empty or generic.
6. Prioritize fixes:
   - Critical: empty shell, loading-only page, or main content only available after JS.
   - High: blocked indexing, broken canonical, missing discoverability, wrong status codes.
   - Medium: generic or duplicate metadata, missing OG/Twitter tags, invalid structured data.

## Output format

Return findings in this shape:

```markdown
# Crawler Readiness Audit
## Verdict
Pass | Partial | Fail
## Executive Summary
Briefly explain whether crawlers can understand the site without JavaScript.
## Rendering Architecture
- Framework:
- Rendering strategy:
- Hosting:
- Router:
- Data-fetching model:
## Tested URLs
| URL | Status | Raw HTML Content | Metadata | Internal Links | Verdict |
|---|---:|---|---|---|---|
## Critical Findings
### CR-001: Finding title
**Severity:** Critical
**Affected routes:**
**Evidence:**
**Crawler impact:**
**Root cause:**
**Recommended fix:**
## Raw HTML vs Rendered Comparison
| Element | Raw HTML | Rendered Page | Difference |
|---|---|---|---|
## Recommended Rendering Strategy
Explain whether the site should use SSR, SSG, ISR, prerendering, or hybrid rendering.
## Implementation Plan
1. Immediate fixes
2. Rendering changes
3. Metadata changes
4. Crawler verification
5. Regression testing
## Final Verification Checklist
- [ ] Raw HTML contains primary page content
- [ ] Every important route has a unique title
- [ ] Every important route has a unique description
- [ ] Canonical URLs are correct
- [ ] Important links use real anchors
- [ ] Public pages are not accidentally blocked
- [ ] Sitemap contains canonical indexable URLs
- [ ] Structured data exists in initial HTML
```

## Guidance

- Do not suggest cloaking or serving meaningfully different content to crawlers and users.
- Meta tags alone do not fix an empty HTML shell.
- If public content is hidden behind hydration, recommend moving it to SSR, SSG, ISR, or prerendering.
- If a route must stay client-rendered, clearly mark the indexing risk and the content that remains invisible in raw HTML.
