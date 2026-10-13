#!/usr/bin/env node
/**
 * check-links.mjs - local link checker for vikingkadar.github.io
 *
 * Walks every .html file in the repo, pulls out every href and src, and checks
 * that each local target actually exists on disk. For links with a #fragment
 * into a local html file it also checks that an element with that id is there.
 *
 * Run from the repo root:
 *     node tools/check-links.mjs
 *
 * Exit code 0 = everything resolved, 1 = something is broken.
 * No dependencies, plain Node.
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { dirname, join, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['node_modules', '_originals', '.git']);

/* ---------- 1. find every .html file ---------- */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(join(dir, entry.name), out);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      out.push(join(dir, entry.name));
    }
  }
  return out;
}

/* ---------- 2. pull every href / src out of one file ---------- */
const ATTR_RE = /\b(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>`]+))/gi;

/* script / style bodies and code samples are not markup: a line like
   img.src = url; or a highlighted <span> inside <pre> is not a link.
   The opening tag is kept, so <script src="..."> is still checked. */
const NOT_MARKUP = /(<(?:script|style|pre|code)\b[^>]*>)[\s\S]*?<\/(?:script|style|pre|code)>/gi;

function extractLinks(html) {
  const markup = html.replace(NOT_MARKUP, '$1');
  const found = [];
  let m;
  while ((m = ATTR_RE.exec(markup)) !== null) {
    const value = (m[1] ?? m[2] ?? m[3] ?? '').trim();
    if (value) found.push(value);
  }
  return found;
}

/* ---------- 3. decide what we care about ---------- */
const IGNORED_SCHEME = /^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i;

function isIgnorable(value) {
  if (IGNORED_SCHEME.test(value)) return true;
  if (value.startsWith('#')) return true;   // same-page anchor only
  return false;
}

/* ---------- 4. resolve + check ---------- */
const idCache = new Map();

function hasId(filePath, id) {
  let ids = idCache.get(filePath);
  if (!ids) {
    const body = readFileSync(filePath, 'utf8');
    ids = body;
    idCache.set(filePath, ids);
  }
  return ids.includes(`id="${id}"`) || ids.includes(`id='${id}'`);
}

function decode(p) {
  try { return decodeURIComponent(p); } catch { return p; }
}

const files = walk(ROOT).sort();
const problems = [];
let checked = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const here = relative(ROOT, file).split(sep).join('/');

  for (const raw of extractLinks(html)) {
    if (isIgnorable(raw)) continue;

    // strip query string, split off the fragment
    const noQuery = raw.split('?')[0];
    const hashAt = noQuery.indexOf('#');
    const pathPart = hashAt === -1 ? noQuery : noQuery.slice(0, hashAt);
    const fragment = hashAt === -1 ? '' : noQuery.slice(hashAt + 1);

    // root-relative paths resolve from the repo root, the rest from this file
    let target;
    if (pathPart === '') {
      target = file;                               // "#frag" after a query, same page
    } else if (pathPart.startsWith('/')) {
      target = join(ROOT, decode(pathPart.slice(1)));
    } else {
      target = resolve(dirname(file), decode(pathPart));
    }

    checked++;

    // a directory link ("foo/") means that folder's index.html
    let onDisk = existsSync(target);
    if (onDisk && statSync(target).isDirectory()) {
      const idx = join(target, 'index.html');
      if (existsSync(idx)) target = idx;
      else { onDisk = false; }
    }

    if (!onDisk) {
      problems.push(`${here}  ->  ${raw}   (missing: ${relative(ROOT, target).split(sep).join('/')})`);
      continue;
    }

    if (fragment && /\.html?$/i.test(target) && !hasId(target, fragment)) {
      problems.push(`${here}  ->  ${raw}   (no id="${fragment}" in ${relative(ROOT, target).split(sep).join('/')})`);
    }
  }
}

if (problems.length) {
  console.error(`BROKEN LINKS: ${problems.length} problem(s) in ${files.length} html file(s), ${checked} local link(s) checked\n`);
  for (const p of problems) console.error('  ' + p);
  console.error('');
  process.exit(1);
}

console.log(`OK: ${checked} local link(s) in ${files.length} html file(s), nothing broken.`);
process.exit(0);
