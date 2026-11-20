#!/usr/bin/env node
/**
 * count-events.mjs - which dataLayer events does this site actually push?
 * ------------------------------------------------------------------------
 *     node tools/count-events.mjs
 *
 * Reads every page and script of the portfolio and collects each custom
 * event name that code can push: dataLayer.push({ event: '...' }),
 * data-track="..." on links, and the data: { track: '...' } / event: '...'
 * values the render helpers turn into data-track. GTM's own gtm.* events
 * are not counted.
 *
 * Then it compares the result with the event table in assets/content.js
 * (CONTENT.events), which is what the site shows and counts. Exit code 1
 * if the two disagree, so the number on the site can never drift.
 *
 * Not counted: gtm-course/ and gtm-real-site/ (course exercise sandboxes
 * with their own practice events), scaping/ and tools/.
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['.git', 'node_modules', 'tools', 'gtm-course', 'gtm-real-site', 'scaping', '_originals', '.vscode']);

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(path.join(dir, e.name), out); }
    else if (/\.(html|js)$/i.test(e.name) && e.name !== 'content.js') out.push(path.join(dir, e.name));
  }
  return out;
}

const NAME = '([a-z][a-z0-9_]*)';
const PATTERNS = [
  new RegExp(`event\\s*:\\s*(?:[^,}'"\\n]*?\\|\\|\\s*)?['"]${NAME}['"]`, 'g'),   // { event: 'x' } and { event: a || 'x' }
  new RegExp(`track\\s*:\\s*(?:[^,}'"\\n]*?\\|\\|\\s*)?['"]${NAME}['"]`, 'g'),   // data: { track: 'x' }
  new RegExp(`data-track\\s*=\\s*["']${NAME}["']`, 'g'),                         // data-track="x"
  new RegExp(`dataset\\.track\\s*=\\s*['"]${NAME}['"]`, 'g'),                    // a.dataset.track = 'x'
];

const found = new Map();   // event -> Set(files)
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  // HTML comments are notes, not code.
  const src = readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  for (const re of PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src))) {
      const name = m[1];
      if (name === 'gtm') continue;
      if (!found.has(name)) found.set(name, new Set());
      found.get(name).add(rel);
    }
  }
}

const win = {};
vm.runInNewContext(readFileSync(path.join(ROOT, 'assets/content.js'), 'utf8'), { window: win });
const table = (win.CONTENT.events || []).map(e => e.e);

const code = [...found.keys()].sort();
const missingInTable = code.filter(e => !table.includes(e));
const missingInCode = table.filter(e => !found.has(e));

console.log(`Custom events pushed by the code: ${code.length}\n`);
code.forEach(e => console.log('  ' + e.padEnd(18) + [...found.get(e)].sort().join(', ')));
console.log(`\nRows in the event table (CONTENT.events): ${table.length}`);
if (missingInTable.length) console.log('  In the code but not in the table: ' + missingInTable.join(', '));
if (missingInCode.length) console.log('  In the table but not in the code: ' + missingInCode.join(', '));
if (!missingInTable.length && !missingInCode.length) console.log('  Table and code agree.');
process.exit(missingInTable.length || missingInCode.length ? 1 : 0);
