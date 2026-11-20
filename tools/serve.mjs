#!/usr/bin/env node
/**
 * serve.mjs - preview the site locally, exactly as GitHub Pages serves it
 * -----------------------------------------------------------------------
 *     node tools/serve.mjs            -> http://localhost:8080/
 *     node tools/serve.mjs 3000       -> another port
 *
 * No dependencies. Serves the repo root, maps "/" to index.html and a
 * missing file to 404.html, like Pages does. Ctrl+C stops it.
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createGzip } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// GitHub Pages gzips text files, so this does too. Without it a local
// Lighthouse run would score the page worse than visitors experience it.
const GZIP = /\.(html|css|js|mjs|json|xml|txt|svg)$/i;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2]) || 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf', '.woff2': 'font/woff2',
};

createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  let file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
  let status = 200;
  if (!existsSync(file)) { status = 404; file = path.join(ROOT, '404.html'); }
  if (!existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
  const headers = { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' };
  const gzip = GZIP.test(file) && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  if (gzip) { headers['Content-Encoding'] = 'gzip'; headers['Vary'] = 'Accept-Encoding'; }
  res.writeHead(status, headers);
  if (req.method === 'HEAD') return res.end();
  const stream = createReadStream(file);
  (gzip ? stream.pipe(createGzip()) : stream).pipe(res);
}).listen(PORT, () => console.log(`Serving ${ROOT}\n  http://localhost:${PORT}/\nCtrl+C to stop.`));
