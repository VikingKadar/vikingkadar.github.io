#!/usr/bin/env node
/**
 * make-v2-images.mjs - derived images for the v2 design
 * ------------------------------------------------------
 * Produces two kinds of files from what is already in images/:
 *
 *   1. images/wall/*.webp  - 540 px wide copies of the posters and ads.
 *      The homepage wall and the phone feed show many pictures at once,
 *      so they get the small copies and the case pages keep the big ones.
 *
 *   2. images/og-*.jpg     - 1200x630 social preview cards for the pages
 *      that did not have one. Dark card, red accent, big title, and a
 *      photo on the right when one exists.
 *
 * Never touches the originals. Safe to run again at any time:
 *
 *     node tools/make-v2-images.mjs
 */
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG = path.join(ROOT, 'images');
const WALL = path.join(IMG, 'wall');

/* ---------- 1. the small copies ---------- */
const SMALL = [
  'portrait.webp', 'fotboll.webp', 'gossip.webp', 'hearthbreak.webp',
  'aroma/choco.webp', 'aroma/claw.webp', 'aroma/suitcase.webp', 'aroma/tv.webp',
  'aroma/caramel.webp', 'aroma/everyday.webp', 'rostning.webp',
];

async function small() {
  await mkdir(WALL, { recursive: true });
  for (const rel of SMALL) {
    const src = path.join(IMG, rel);
    if (!existsSync(src)) { console.log('skip (missing)', rel); continue; }
    const out = path.join(WALL, path.basename(rel));
    const info = await sharp(src).resize({ width: 540, withoutEnlargement: true }).webp({ quality: 74 }).toFile(out);
    console.log('wall/' + path.basename(rel).padEnd(18), info.width + 'x' + info.height, Math.round(info.size / 1024) + ' KB');
  }
}

/* ---------- 2. social cards ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Anton is not installed locally; Impact is the closest system face and is
// only used for these preview cards, never on the site itself.
const DISP = "Impact, 'Arial Narrow', 'Arial Black', sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', Arial, sans-serif";

// Impact in these sizes runs at roughly 0.5 em per character, so a line is
// kept inside the text column by shrinking the size, never by clipping.
function fitSize(lines, maxWidth, start) {
  const longest = Math.max(...lines.map(l => l.length));
  return Math.min(start, Math.floor(maxWidth / (longest * 0.52)));
}

function cardSvg({ kicker, title, sub, big, hasPhoto }) {
  const textW = hasPhoto ? 640 : 1060;
  const lines = Array.isArray(title) ? title : [title];
  const titleSize = fitSize(lines, textW, big ? 104 : 136);
  const top = big ? 360 : 250;                   // baseline of the first title line
  const titleSvg = lines.map((l, i) =>
    `<text x="72" y="${top + i * Math.round(titleSize * 0.94)}" font-family="${DISP}" font-size="${titleSize}" fill="#F2EFE9">${esc(l.toUpperCase())}</text>`).join('');
  const subY = top + (lines.length - 1) * Math.round(titleSize * 0.94) + 76;
  const subSize = Math.min(38, Math.floor(textW / (sub ? sub.length * 0.46 : 1)));
  const kick = kicker ? kicker.toUpperCase() : '';
  const kickSize = Math.min(24, Math.floor(textW / (kick.length * 0.72 || 1)));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0B0B0B"/>
  <rect x="0" y="0" width="14" height="630" fill="#FF3B2F"/>
  ${kick ? `<text x="72" y="104" font-family="${SANS}" font-size="${kickSize}" font-weight="600" letter-spacing="3" fill="#8A8780">${esc(kick)}</text>` : ''}
  ${big ? `<text x="66" y="262" font-family="${DISP}" font-size="150" fill="#FF3B2F">${esc(big)}</text>` : ''}
  ${titleSvg}
  ${sub ? `<text x="72" y="${subY}" font-family="${SERIF}" font-style="italic" font-size="${subSize}" fill="#F2EFE9" opacity=".92">${esc(sub)}</text>` : ''}
  <text x="72" y="568" font-family="${SANS}" font-size="22" fill="#8A8780">vikingkadar.github.io</text>
  ${hasPhoto ? '' : `<text x="1128" y="568" font-family="${SANS}" font-size="22" fill="#8A8780" text-anchor="end">Viking Kadar · Growth Marketing, Berghs</text>`}
</svg>`;
}

const CARDS = [
  { out: 'og-home-v2.jpg', kicker: 'Open for internship · Mar–Apr 2027', title: ['Ideas that', 'move numbers'], sub: 'Content, tools and the numbers.', photo: 'portrait.webp', pos: 'top' },
  { out: 'og-berghs.jpg', kicker: 'Berghs School of Communication · 2026–2027', title: ['Berghs,', 'course by course'], sub: 'Method, tracking and real client briefs.', photo: 'aroma/choco.webp' },
  { out: 'og-sweden-ai.jpg', kicker: 'My own TikTok · @sweden_ai', big: '41.8M', title: ['views in four months'], sub: 'Idea, production and editing, all me.' },
  { out: 'og-posterlab.jpg', kicker: 'My own AI company', title: ['PosterLab'], sub: 'Upload a photo, get a painting. V2 rebuilt around zero friction.' },
  { out: 'og-manor.jpg', kicker: 'My own belt brand · Founder', big: '500', title: ['belts sold out'], sub: 'Guerrilla marketing, four months.' },
  { out: 'og-amida.jpg', kicker: 'An AI product I am building', title: ['Amida'], sub: 'A growth loop with no stock and nothing to sell.' },
  { out: 'og-seo.jpg', kicker: 'Berghs · SEO & Content Marketing', title: ['SEO & Content', 'Marketing'], sub: 'Case: Byggalliansen.' },
  { out: 'og-growth-toolbox.jpg', kicker: 'Berghs · Growth Toolbox', title: ['Growth', 'Toolbox'], sub: 'GTM, GA4, 19 custom events, scraping and a data story.', photo: 'rostning.webp' },
];

async function cards() {
  for (const c of CARDS) {
    const photo = c.photo && existsSync(path.join(IMG, c.photo)) ? path.join(IMG, c.photo) : null;
    const base = sharp(Buffer.from(cardSvg({ ...c, hasPhoto: !!photo }))).png();
    let img = base;
    if (photo) {
      const ph = await sharp(photo).resize({ width: 440, height: 630, fit: 'cover', position: c.pos || 'centre' }).toBuffer();
      img = sharp(await base.toBuffer()).composite([{ input: ph, left: 760, top: 0 }]);
    }
    const out = path.join(IMG, c.out);
    const info = await img.jpeg({ quality: 84, mozjpeg: true }).toFile(out);
    console.log(c.out.padEnd(24), info.width + 'x' + info.height, Math.round(info.size / 1024) + ' KB');
  }
}

await small();
await cards();
