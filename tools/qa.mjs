#!/usr/bin/env node
/**
 * qa.mjs - open every page in headless Chrome/Edge and report what a human
 * would otherwise have to click through: console errors, horizontal
 * overflow, counters stuck on zero, and a screenshot per viewport.
 * -------------------------------------------------------------------------
 *     node tools/serve.mjs                 (in another terminal)
 *     node tools/qa.mjs                    all public pages, 375 and 1440
 *     node tools/qa.mjs index.html         one page
 *     node tools/qa.mjs --reduced          same, with prefers-reduced-motion
 *     node tools/qa.mjs --shots out/dir    where screenshots go (default tools/qa-shots)
 *
 * Needs Chrome or Edge on the machine. Talks to it over the DevTools
 * protocol with Node's built-in WebSocket, so there is nothing to install.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const REDUCED = args.includes('--reduced');
const shotsIdx = args.indexOf('--shots');
const SHOTS = shotsIdx > -1 ? path.resolve(args[shotsIdx + 1]) : path.join(ROOT, 'tools', 'qa-shots');
const pagesArg = args.filter((a, i) => !a.startsWith('--') && !(shotsIdx > -1 && i === shotsIdx + 1));
const BASE = process.env.QA_BASE || 'http://localhost:8080/';
const PAGES = pagesArg.length ? pagesArg : [
  'index.html', 'projects.html', 'berghs.html', 'case-sweden-ai.html', 'case-posterlab.html',
  'case-william-manor.html', 'case-amida.html', 'course-opera.html', 'course-performance-marketing.html',
  'course-growth-toolbox.html', 'course-seo.html', 'toolbox.html', 'fororten.html', '404.html',
];
const VIEWPORTS = [{ w: 375, h: 812, name: 'mobile' }, { w: 1440, h: 900, name: 'desktop' }];

const BROWSERS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const exe = BROWSERS.find(p => p && existsSync(p));
if (!exe) { console.error('No Chrome or Edge found.'); process.exit(2); }

// A port and profile of its own per run, so several runs can go at once.
const PORT = Number(process.env.QA_PORT) || 9300 + Math.floor(Math.random() * 600);
const PROFILE = mkdtempSync(path.join(tmpdir(), 'vk-qa-'));
const browser = spawn(exe, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--mute-audio',
  `--remote-debugging-port=${PORT}`, '--user-data-dir=' + PROFILE, 'about:blank',
], { stdio: 'ignore' });
process.on('exit', () => { try { browser.kill(); } catch {} try { rmSync(PROFILE, { recursive: true, force: true }); } catch {} });

async function newTarget() {
  const r = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' });
  const t = await r.json();
  if (!t.webSocketDebuggerUrl) throw new Error('Could not open a tab: ' + JSON.stringify(t));
  return t;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function json(url) { const r = await fetch(url); return r.json(); }
let version;
for (let i = 0; i < 50; i++) { try { version = await json(`http://127.0.0.1:${PORT}/json/version`); break; } catch { await sleep(200); } }
if (!version) { console.error('Browser did not start.'); process.exit(2); }

/* ---------- a tiny CDP client ---------- */
function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0; const pending = new Map(); const listeners = new Map();
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
    else if (m.method && listeners.has(m.method)) listeners.get(m.method).forEach(fn => fn(m.params));
  });
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const on = (method, fn) => { if (!listeners.has(method)) listeners.set(method, []); listeners.get(method).push(fn); };
  return new Promise((res, rej) => { ws.addEventListener('open', () => res({ send, on, close: () => ws.close() })); ws.addEventListener('error', rej); });
}

mkdirSync(SHOTS, { recursive: true });
const report = [];
let failures = 0;

for (const page of PAGES) {
  for (const vp of VIEWPORTS) {
    const target = await newTarget();
    const cdp = await connect(target.webSocketDebuggerUrl);
    const errors = [];
    cdp.on('Runtime.exceptionThrown', p => errors.push('exception: ' + (p.exceptionDetails.exception?.description || p.exceptionDetails.text).split('\n')[0]));
    cdp.on('Runtime.consoleAPICalled', p => { if (p.type === 'error') errors.push('console.error: ' + p.args.map(a => a.value || a.description).join(' ')); });
    cdp.on('Log.entryAdded', p => { if (p.entry.level === 'error' && !/favicon|ERR_BLOCKED_BY_CLIENT|googletagmanager|fonts.g/i.test(p.entry.text + (p.entry.url || ''))) errors.push('log: ' + p.entry.text + ' ' + (p.entry.url || '')); });
    await cdp.send('Runtime.enable'); await cdp.send('Log.enable'); await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: vp.w, height: vp.h, deviceScaleFactor: 1, mobile: vp.w < 800 });
    if (REDUCED) await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    const url = BASE + page;
    const loaded = new Promise(r => cdp.on('Page.loadEventFired', r));
    await cdp.send('Page.navigate', { url });
    await Promise.race([loaded, sleep(15000)]);
    await sleep(900);
    // scroll through the page so lazy content, reveals and counters run
    await cdp.send('Runtime.evaluate', { expression: `(async()=>{document.documentElement.style.scrollBehavior='auto';const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=${vp.h}/2){scrollTo(0,y);await new Promise(r=>setTimeout(r,140));}scrollTo(0,0);await new Promise(r=>setTimeout(r,200));})()`, awaitPromise: true });
    await sleep(REDUCED ? 300 : 2300);
    const probe = await cdp.send('Runtime.evaluate', { returnByValue: true, expression: `(() => {
      const de = document.documentElement;
      const wide = [...document.querySelectorAll('body *')].filter(el => { const r = el.getBoundingClientRect(); return r.right > innerWidth + 1 && getComputedStyle(el).position !== 'fixed' && r.width > 0 && !el.closest('[data-overflow-ok]'); }).slice(0, 6).map(el => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '') + ' right=' + Math.round(el.getBoundingClientRect().right));
      const zeros = [...document.querySelectorAll('[data-count]')].filter(el => /^0(\\.0+)?\\s*\\D*$/.test(el.textContent.trim())).length;
      const placeholders = (document.body.innerText.match(/coming soon|goes here|added when|\\bTBD\\b|Diffrent|lorem ipsum|placeholder/gi) || []);
      const h1 = document.querySelectorAll('h1').length;
      const title = document.title; const desc = document.querySelector('meta[name=description]')?.content || '';
      const gtm = (document.documentElement.outerHTML.match(/GTM-T7ZGSTLG/g) || []).length;
      const imgsNoDim = [...document.images].filter(i => (!i.getAttribute('width') || !i.getAttribute('height')) && !i.closest('.vid') && i.offsetWidth > 0).length;
      const emptyText = [...document.querySelectorAll('a,button')].filter(el => !el.textContent.trim() && !el.getAttribute('aria-label') && !el.querySelector('img[alt]') && el.offsetWidth > 0).length;
      return { scrollW: de.scrollWidth, innerW: innerWidth, wide, zeros, placeholders, h1, title, titleLen: title.length, descLen: desc.length, gtm, imgsNoDim, emptyText, height: de.scrollHeight, dl: (window.dataLayer || []).filter(x => x && x.event).map(x => x.event).filter((v, i, a) => a.indexOf(v) === i) };
    })()` });
    const r = probe.result.value;
    const shot = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 70, captureBeyondViewport: true, clip: { x: 0, y: 0, width: vp.w, height: Math.min(r.height, 12000), scale: 1 } });
    const stem = `${page.replace(/\.html$/, '').replace(/\W+/g, '_')}-${vp.name}${REDUCED ? '-reduced' : ''}`;
    const shotFile = path.join(SHOTS, stem + '.jpg');
    writeFileSync(shotFile, Buffer.from(shot.data, 'base64'));
    // --slices: also save screen-sized slices, which are far easier to inspect than one very tall image.
    if (args.includes('--slices')) {
      const sliceH = Math.round(vp.h * 1.4);
      for (let y = 0, i = 1; y < Math.min(r.height, 12000); y += sliceH, i++) {
        const sl = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 72, captureBeyondViewport: true, clip: { x: 0, y, width: vp.w, height: Math.min(sliceH, r.height - y), scale: 1 } });
        writeFileSync(path.join(SHOTS, `${stem}-${String(i).padStart(2, '0')}.jpg`), Buffer.from(sl.data, 'base64'));
      }
    }
    const problems = [];
    if (errors.length) problems.push(...errors.slice(0, 5));
    if (r.scrollW > r.innerW + 1) problems.push(`horizontal overflow: scrollWidth ${r.scrollW} > ${r.innerW} ${r.wide.join(' | ')}`);
    if (r.zeros) problems.push(`${r.zeros} counter(s) still reading 0`);
    if (r.placeholders.length) problems.push('placeholder text: ' + r.placeholders.join(', '));
    if (r.h1 !== 1) problems.push(`${r.h1} <h1> elements`);
    if (r.titleLen > 60) problems.push(`title ${r.titleLen} chars`);
    if (r.descLen > 150 || r.descLen === 0) problems.push(`description ${r.descLen} chars`);
    if (r.gtm < 2) problems.push(`GTM id found ${r.gtm}x`);
    if (r.imgsNoDim) problems.push(`${r.imgsNoDim} visible <img> without width/height`);
    if (r.emptyText) problems.push(`${r.emptyText} link/button without text`);
    const line = `${problems.length ? 'FAIL' : 'ok  '} ${page} @${vp.w}${REDUCED ? ' (reduced)' : ''}  h=${r.height}  events=[${r.dl.join(',')}]`;
    console.log(line); problems.forEach(p => console.log('     - ' + p));
    if (problems.length) failures++;
    report.push({ page, viewport: vp.name, problems, shot: shotFile, meta: r });
    cdp.close();
    await fetch(`http://127.0.0.1:${PORT}/json/close/${target.id}`).catch(() => {});
  }
}
writeFileSync(path.join(SHOTS, 'report.json'), JSON.stringify(report, null, 2));
console.log(`\n${failures ? failures + ' page/viewport combination(s) with problems' : 'All clean'}. Screenshots in ${SHOTS}`);
browser.kill();
process.exit(failures ? 1 : 0);
