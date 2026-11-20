#!/usr/bin/env node
/**
 * build-sitemap.mjs - writes sitemap.xml from the pages that are actually public
 * -------------------------------------------------------------------------------
 *     node tools/build-sitemap.mjs
 *
 * Reads the on/off switches in assets/content.js (SHOW_AMIDA, SEO_READY), so a
 * page that is switched off never ends up in the sitemap. Run it after you flip
 * a flag, then commit sitemap.xml together with content.js.
 * lastmod = the last git commit date of each file (today if uncommitted).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://vikingkadar.github.io/';

const win = {};
vm.runInNewContext(readFileSync(path.join(ROOT, 'assets/content.js'), 'utf8'), { window: win });
const flags = (win.CONTENT && win.CONTENT.flags) || {};

const PAGES = [
  { file: 'index.html', loc: '', priority: '1.0' },
  { file: 'projects.html', priority: '0.9' },
  { file: 'berghs.html', priority: '0.9' },
  { file: 'case-sweden-ai.html', priority: '0.8' },
  { file: 'case-posterlab.html', priority: '0.8' },
  { file: 'case-william-manor.html', priority: '0.8' },
  { file: 'case-amida.html', priority: '0.7', flag: 'SHOW_AMIDA' },
  { file: 'course-opera.html', priority: '0.8' },
  { file: 'course-growth-toolbox.html', priority: '0.8' },
  { file: 'course-performance-marketing.html', priority: '0.8' },
  { file: 'course-cro-analytics.html', priority: '0.8' },
  { file: 'course-seo.html', priority: '0.7', flag: 'SEO_READY' },
  { file: 'toolbox.html', priority: '0.6' },
  { file: 'fororten.html', priority: '0.6' },
];

const today = new Date().toISOString().slice(0, 10);
function lastmod(file) {
  try {
    const out = execSync(`git log -1 --format=%cs -- "${file}"`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    const dirty = execSync(`git status --porcelain -- "${file}"`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    return (!out || dirty) ? today : out;
  } catch { return today; }
}

const rows = [];
const skipped = [];
for (const p of PAGES) {
  if (p.flag && !flags[p.flag]) { skipped.push(`${p.file} (${p.flag} is off)`); continue; }
  if (!existsSync(path.join(ROOT, p.file))) { skipped.push(`${p.file} (file missing)`); continue; }
  const loc = BASE + (p.loc != null ? p.loc : p.file);
  rows.push(`  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod(p.file)}</lastmod>\n    <priority>${p.priority}</priority>\n  </url>`);
}
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join('\n')}\n</urlset>\n`;
writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${rows.length} url(s)` + (skipped.length ? `, skipped: ${skipped.join(', ')}` : ''));
