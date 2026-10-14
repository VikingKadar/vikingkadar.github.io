#!/usr/bin/env node
/**
 * optimize-images.mjs — image pipeline for vikingkadar.github.io
 * ----------------------------------------------------------------
 * WHAT IT DOES
 *   Takes the big original photos and produces the small, web-ready
 *   files that the HTML pages actually reference (WebP for on-page
 *   images, JPEG for social-media "og:image" preview cards).
 *
 * HOW TO USE IT
 *   1. Drop your new full-size originals into the `_originals/` folder
 *      at the root of the repo, keeping the exact filenames listed in
 *      the JOBS table below.
 *   2. From the repo root run:
 *
 *          node tools/optimize-images.mjs
 *
 *   3. Look at the printed table. Commit the new files in `images/`.
 *      (`_originals/` is gitignored on purpose — the heavy originals
 *      stay on your disk and are never published.)
 *
 * WHERE FILES COME FROM AND GO
 *   Sources: `_originals/` if that folder exists, otherwise `images/`.
 *   Outputs: always `images/`.
 *
 * ADDING A NEW IMAGE
 *   Add one row to the JOBS array below. That is the only place you
 *   need to edit. Each row says: which original, what to call the
 *   result, and how big it may be.
 *
 * SAFETY RULES BAKED IN
 *   - Never upscales. If an original is smaller than the target width,
 *     it is simply left at its own size (sharp's `withoutEnlargement`).
 *   - Never deletes or overwrites anything in `_originals/`.
 */

import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { mkdir, stat, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Settings you may want to tweak
// ---------------------------------------------------------------------------

const WEBP_QUALITY = 78; // 0-100. 78 is a good sharpness/size balance.
const JPEG_QUALITY = 82; // Used only for the social-preview og-*.jpg files.
const OG_WIDTH = 1200;   // Standard Open Graph preview card size.
const OG_HEIGHT = 630;

// Repo root = one level up from this `tools/` folder.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGINALS_DIR = path.join(ROOT, '_originals');
const IMAGES_DIR = path.join(ROOT, 'images');

// ---------------------------------------------------------------------------
// The job list — the single source of truth for what gets produced.
// ---------------------------------------------------------------------------
//   src    : filename of the original (inside _originals/ or images/)
//   out    : filename to write into images/
//   width  : maximum width in pixels (height follows automatically)
//   format : 'webp' for page images, 'og' for a 1200x630 social crop
//   position: for 'og' only — which part of the image to keep when
//             cropping. 'top' is right for tall portrait posters so we
//             keep the head/title instead of the middle.
//   fromImages: read this one source from `images/` instead of
//             `_originals/`. Use it when the source is already an
//             optimized file that must not be re-compressed, such as the
//             Aroma Roast ads that arrived ready-made.
// ---------------------------------------------------------------------------

const JOBS = [
  // --- Homepage hero background (served at two sizes for small screens) ---
  { src: 'första sidan.png', out: 'hero.webp',         width: 1920, format: 'webp' },
  { src: 'första sidan.png', out: 'hero-960.webp',     width: 960,  format: 'webp' },

  // --- Portrait of the site owner ---
  { src: 'jag.png',          out: 'portrait.webp',     width: 900,  format: 'webp' },

  // --- "Förorten" data story hero ---
  { src: 'rostning.png',     out: 'rostning.webp',     width: 1200, format: 'webp' },
  { src: 'rostning.png',     out: 'rostning-800.webp', width: 800,  format: 'webp' },

  // --- Campaign posters (portrait 2:3) ---
  { src: 'fotboll.jpeg',       out: 'fotboll.webp',      width: 1200, format: 'webp' },
  { src: 'fotboll.jpeg',       out: 'fotboll-800.webp',  width: 800,  format: 'webp' },
  { src: 'gossip.jpeg',        out: 'gossip.webp',       width: 1200, format: 'webp' },
  { src: 'hearthbreak.jpeg',   out: 'hearthbreak.webp',  width: 1200, format: 'webp' },

  // --- Social share cards: exactly 1200x630, cropped to fill ---
  { src: 'första sidan.png', out: 'og-home.jpg',     format: 'og' },
  { src: 'fotboll.jpeg',     out: 'og-opera.jpg',    format: 'og', position: 'top' },
  { src: 'första sidan.png', out: 'og-projects.jpg', format: 'og' },
  { src: 'första sidan.png', out: 'og-toolbox.jpg',  format: 'og' },
  { src: 'rostning.png',     out: 'og-fororten.jpg', format: 'og' },

  // --- Aroma Roast ---
  // The six ad images arrive already compressed at 1024x1280 and are NOT
  // re-encoded here. Only the social card is generated, read straight from
  // the finished WebP in images/aroma/.
  { src: 'aroma/choco.webp', out: 'og-aromaroast.jpg', format: 'og', fromImages: true },
];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

/** Human-readable file size, e.g. "1.6 MB". */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Pad/trim a string so the printed table lines up. */
function pad(text, length) {
  const s = String(text);
  return s.length >= length ? s : s + ' '.repeat(length - s.length);
}

function padLeft(text, length) {
  const s = String(text);
  return s.length >= length ? s : ' '.repeat(length - s.length) + s;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Decide where to read originals from.
  const sourceDir = existsSync(ORIGINALS_DIR) ? ORIGINALS_DIR : IMAGES_DIR;
  const usingOriginals = sourceDir === ORIGINALS_DIR;

  console.log('');
  console.log('Image optimizer for vikingkadar.github.io');
  console.log('-----------------------------------------');
  console.log(`Reading originals from : ${path.relative(ROOT, sourceDir) || '.'}/` +
    (usingOriginals ? '' : '   (no _originals/ folder found, falling back to images/)'));
  console.log(`Writing results to     : ${path.relative(ROOT, IMAGES_DIR)}/`);
  console.log(`WebP quality ${WEBP_QUALITY}  |  JPEG quality ${JPEG_QUALITY}  |  never upscales`);
  console.log('');

  await mkdir(IMAGES_DIR, { recursive: true });

  const rows = [];
  const problems = [];
  const notUpscaled = [];

  for (const job of JOBS) {
    // A job marked `fromImages` always reads from images/, even when an
    // _originals/ folder exists, because its source is already optimized.
    const srcPath = path.join(job.fromImages ? IMAGES_DIR : sourceDir, job.src);
    const outPath = path.join(IMAGES_DIR, job.out);

    // Missing source? Report it and carry on with the rest.
    if (!existsSync(srcPath)) {
      problems.push(`MISSING SOURCE: ${job.src}  (needed for ${job.out})`);
      continue;
    }

    const srcBytes = (await stat(srcPath)).size;
    // `.rotate()` with no argument honours the EXIF orientation tag, so phone
    // photos do not come out sideways.
    const meta = await sharp(srcPath).rotate().metadata();

    if (job.format === 'og') {
      // Social card: crop to fill exactly 1200x630.
      let buffer = await sharp(srcPath)
        .rotate()
        .resize(OG_WIDTH, OG_HEIGHT, {
          fit: 'cover',
          position: job.position ?? 'centre',
          withoutEnlargement: true, // keep the no-upscale promise
        })
        .flatten({ background: '#ffffff' }) // JPEG has no transparency
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toBuffer();

      // A cover-crop of a source smaller than the card cannot reach 1200x630
      // without upscaling, and a social card at the wrong size renders badly.
      // So instead of stretching the picture we letterbox it onto a white
      // 1200x630 canvas and say so in the report.
      const cropped = await sharp(buffer).metadata();
      if (cropped.width !== OG_WIDTH || cropped.height !== OG_HEIGHT) {
        notUpscaled.push(
          `${job.out}: source ${job.src} is only ${meta.width}x${meta.height}, so the ` +
          `cover crop came out ${cropped.width}x${cropped.height} — letterboxed onto a ` +
          `white ${OG_WIDTH}x${OG_HEIGHT} canvas rather than upscaled`
        );
        buffer = await sharp(buffer)
          .resize(OG_WIDTH, OG_HEIGHT, { fit: 'contain', background: '#ffffff' })
          .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
          .toBuffer();
      }

      await writeFile(outPath, buffer);
    } else {
      // Page image: shrink to at most `width` px wide, keep aspect ratio.
      await sharp(srcPath)
        .rotate()
        .resize({ width: job.width, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outPath);

      // Tell the user when an original was already smaller than the target.
      if (meta.width && meta.width < job.width) {
        notUpscaled.push(
          `${job.out}: source ${job.src} is only ${meta.width}px wide ` +
          `(target ${job.width}px) — left at original width, no upscaling`
        );
      }
    }

    const outMeta = await sharp(outPath).metadata();
    const outBytes = (await stat(outPath)).size;

    rows.push({
      out: job.out,
      src: job.src,
      srcBytes,
      outBytes,
      dims: `${outMeta.width}x${outMeta.height}`,
      saved: srcBytes - outBytes,
    });
  }

  // --- Print the before/after table -----------------------------------------

  const wOut = Math.max(10, ...rows.map((r) => r.out.length));
  const wSrc = Math.max(6, ...rows.map((r) => r.src.length));

  console.log(
    `${pad('OUTPUT', wOut)}  ${pad('SOURCE', wSrc)}  ${padLeft('BEFORE', 9)}  ${padLeft('AFTER', 9)}  ${padLeft('SAVED', 9)}  ${padLeft('CUT', 6)}  DIMENSIONS`
  );
  console.log('-'.repeat(wOut + wSrc + 60));

  let totalBefore = 0;
  let totalAfter = 0;

  for (const r of rows) {
    totalBefore += r.srcBytes;
    totalAfter += r.outBytes;
    const pct = r.srcBytes ? `${Math.round((r.saved / r.srcBytes) * 100)}%` : '-';
    console.log(
      `${pad(r.out, wOut)}  ${pad(r.src, wSrc)}  ${padLeft(formatBytes(r.srcBytes), 9)}  ` +
      `${padLeft(formatBytes(r.outBytes), 9)}  ${padLeft(formatBytes(r.saved), 9)}  ` +
      `${padLeft(pct, 6)}  ${r.dims}`
    );
  }

  console.log('-'.repeat(wOut + wSrc + 60));
  const totalSaved = totalBefore - totalAfter;
  const totalPct = totalBefore ? Math.round((totalSaved / totalBefore) * 100) : 0;
  console.log(
    `${pad('TOTAL', wOut)}  ${pad(`${rows.length} files`, wSrc)}  ` +
    `${padLeft(formatBytes(totalBefore), 9)}  ${padLeft(formatBytes(totalAfter), 9)}  ` +
    `${padLeft(formatBytes(totalSaved), 9)}  ${padLeft(`${totalPct}%`, 6)}`
  );
  console.log('');
  console.log(`Total saving: ${formatBytes(totalSaved)} (${totalPct}% smaller than the sum of the sources read).`);

  // --- Unique originals: the real "weight on disk" comparison ----------------
  // Several outputs share one source, so the table's BEFORE column counts some
  // originals more than once. This is the honest total.
  const uniqueSources = new Map();
  for (const r of rows) uniqueSources.set(r.src, r.srcBytes);
  const uniqueBefore = [...uniqueSources.values()].reduce((a, b) => a + b, 0);
  console.log(
    `Unique originals: ${uniqueSources.size} files, ${formatBytes(uniqueBefore)} total ` +
    `-> ${rows.length} optimized files, ${formatBytes(totalAfter)} total.`
  );

  // --- Notes ----------------------------------------------------------------

  if (notUpscaled.length) {
    console.log('');
    console.log('Sources smaller than their target size (no upscaling was done):');
    for (const n of notUpscaled) console.log(`  - ${n}`);
  }

  if (problems.length) {
    console.log('');
    console.log('Problems:');
    for (const p of problems) console.log(`  ! ${p}`);
    console.log('');
    console.log(`Files currently in ${path.relative(ROOT, sourceDir) || '.'}/:`);
    for (const f of (await readdir(sourceDir)).sort()) console.log(`  ${f}`);
    process.exitCode = 1;
  } else {
    console.log('');
    console.log(`Done. ${rows.length} files written to ${path.relative(ROOT, IMAGES_DIR)}/.`);
  }
  console.log('');
}

main().catch((err) => {
  console.error('\nImage optimization failed:');
  console.error(err);
  process.exit(1);
});
