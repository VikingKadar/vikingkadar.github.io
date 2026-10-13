/* ==========================================================================
   SHARED BEHAVIOUR - vikingkadar.github.io
   Loaded at the end of <body>, BEFORE each page's own inline script, so the
   page can call VK.* helpers straight away. Everything that needs the whole
   document (tracking, counters, lightbox) starts itself on DOMContentLoaded,
   which fires after the page script has rendered its cards.

   Nothing in here invents content. Media comes from each page's MEDIA object
   and anything whose file is missing removes itself quietly.
   ========================================================================== */
window.VK = (function () {
  'use strict';

  const dl = () => (window.dataLayer = window.dataLayer || []);
  const push = o => { dl().push(o); };
  const el = (tag, props = {}) => Object.assign(document.createElement(tag), props);
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Media helpers: self-healing ---------- */

  // An <img> that removes itself (and runs onDead) if the file 404s.
  // item: { src, alt, w, h, eager }
  function smartImg(item, onDead) {
    if (!item || !item.src) { onDead && onDead(); return null; }
    const img = el('img', { src: item.src, alt: item.alt || '' });
    if (item.w) img.width = item.w;
    if (item.h) img.height = item.h;
    if (item.eager) { img.fetchPriority = 'high'; } else { img.loading = 'lazy'; }
    img.decoding = 'async';
    img.addEventListener('error', () => { img.remove(); onDead && onDead(); });
    return img;
  }

  // YouTube facade: a thumbnail plus a play button. The real iframe is only
  // created on click, which keeps ~700 KB of YouTube JS off the first load.
  function youtubeFacade(item) {
    const id = item.youtube;
    const box = el('div', { className: 'vid' });
    const btn = el('button', { type: 'button' });
    btn.setAttribute('aria-label', 'Play video: ' + (item.title || 'video'));
    const thumb = el('img', {
      src: 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg',
      alt: '', loading: 'lazy', decoding: 'async'
    });
    thumb.addEventListener('error', () => thumb.remove());
    btn.appendChild(thumb);
    btn.appendChild(el('span', { className: 'play' }));
    if (item.title) btn.appendChild(el('span', { className: 'lbl', textContent: item.title }));
    btn.addEventListener('click', () => {
      push({ event: 'video_play', channel: item.channel || id });
      const frame = el('iframe', {
        src: 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0',
        title: item.title || 'Video', allowFullscreen: true,
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      });
      box.replaceChildren(frame);
    });
    box.appendChild(btn);
    return box;
  }

  // Video slot: YouTube id, or a local mp4, or nothing at all.
  function smartVideo(item, onDead) {
    if (item && item.youtube) return youtubeFacade(item);
    if (!item || !item.src) { onDead && onDead(); return null; }
    const box = el('div', { className: 'vid' });
    const v = el('video', { controls: true, preload: 'metadata', playsInline: true });
    if (item.poster) v.poster = item.poster;
    const s = el('source', { src: item.src, type: 'video/mp4' });
    s.addEventListener('error', () => { box.remove(); onDead && onDead(); });
    v.appendChild(s);
    v.addEventListener('play', () => push({ event: 'video_play', channel: item.channel || item.src }), { once: true });
    box.appendChild(v);
    return box;
  }

  // Fill every [data-img] / [data-imgs] / [data-video] slot from MEDIA.
  // A slot whose media is missing simply stays empty, and CSS hides empties.
  function mountMedia(MEDIA, opts = {}) {
    document.querySelectorAll('[data-img]').forEach(slot => {
      const i = smartImg(MEDIA[slot.dataset.img], opts.onDead && (() => opts.onDead(slot)));
      if (i) slot.appendChild(i);
    });
    document.querySelectorAll('[data-imgs]').forEach(slot => {
      (MEDIA[slot.dataset.imgs] || []).forEach(it => { const i = smartImg(it); if (i) slot.appendChild(i); });
    });
    document.querySelectorAll('[data-video]').forEach(slot => {
      const hideSel = slot.dataset.hide;                 // selector to hide when there is no video
      const die = () => { const t = hideSel ? slot.closest(hideSel) : null; if (t) t.classList.add('hidden'); };
      const v = smartVideo(MEDIA[slot.dataset.video], die);
      if (v) slot.appendChild(v); else die();
    });
  }

  // Hide a wrapper (and optional extras) when it ended up with no media.
  function tidy(selector, extras = []) {
    const run = () => {
      const box = document.querySelector(selector);
      if (!box) return;
      if (!box.querySelector('img, video, iframe, .vid')) {
        box.classList.add('hidden');
        extras.forEach(s => document.querySelectorAll(s).forEach(n => n.classList.add('hidden')));
      }
    };
    setTimeout(run, 1200);
    window.addEventListener('load', run);
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    const nav = document.getElementById('nav');
    if (nav) {
      const hero = document.querySelector('.hero');
      const trigger = () => (hero ? hero.offsetHeight - 80 : 40);
      const onScroll = () => nav.classList.toggle('solid', window.scrollY > trigger());
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    const overlay = document.getElementById('overlay');
    const btn = document.getElementById('menu-btn');
    if (!overlay || !btn) return;
    const set = open => {
      overlay.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    btn.addEventListener('click', () => set(!overlay.classList.contains('open')));
    const close = document.getElementById('menu-close');
    if (close) close.addEventListener('click', () => set(false));
    overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }

  /* ---------- Tracking ----------
     Click tracking is declarative: any element with data-track pushes
     { event: <data-track>, channel: <data-channel> }. Section views and
     scroll depth fire at most once each per page view. */
  function initTracking() {
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-track]');
      if (!t) return;
      const o = { event: t.dataset.track };
      if (t.dataset.channel) o.channel = t.dataset.channel;
      push(o);
    });

    const seen = new Set();
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting || seen.has(e.target.id)) return;
      seen.add(e.target.id);
      push({ event: 'section_view', section_id: e.target.id });
    }), { threshold: .3 });
    document.querySelectorAll('section[id]').forEach(s => io.observe(s));

    const marks = [25, 50, 75, 100], hit = new Set();
    window.addEventListener('scroll', () => {
      const doc = document.documentElement;
      const d = Math.round((window.scrollY + window.innerHeight) / doc.scrollHeight * 100);
      marks.forEach(m => {
        if (d >= m && !hit.has(m)) { hit.add(m); push({ event: 'scroll_depth', percent: m }); }
      });
    }, { passive: true });
  }

  /* ---------- Counters and the traffic-source bar ---------- */
  function initCounters() {
    const fmtInt = n => Math.round(n).toLocaleString('en-US');
    const render = (elm, val) => {
      const dec = +(elm.dataset.dec || 0), suf = elm.dataset.suf || '';
      elm.textContent = (dec ? val.toFixed(dec) : fmtInt(val)) + suf;
    };
    const nodes = document.querySelectorAll('[data-count]');
    if (nodes.length) {
      const obs = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        const elm = e.target, target = parseFloat(elm.dataset.count);
        if (reduce()) { render(elm, target); return; }
        const t0 = performance.now();
        const tick = now => {
          const k = Math.min(1, (now - t0) / 1800), ease = 1 - Math.pow(1 - k, 3);
          render(elm, target * ease);
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }), { threshold: .6 });
      nodes.forEach(n => obs.observe(n));
    }
    const src = document.getElementById('source');
    if (src) new IntersectionObserver((es, o) => es.forEach(e => {
      if (e.isIntersecting) { src.classList.add('on'); o.disconnect(); }
    }), { threshold: .6 }).observe(src);
  }

  /* ---------- Lightbox for the poster strip ---------- */
  function initLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    const img = document.getElementById('lb-img');
    document.addEventListener('click', e => {
      const b = e.target.closest('.zoom');
      if (!b) return;
      img.src = b.dataset.full;
      const inner = b.querySelector('img');
      img.alt = inner ? inner.alt : '';
      lb.showModal();
      push({ event: 'poster_open', poster_title: b.dataset.title });
    });
    const close = document.getElementById('lb-close');
    if (close) close.addEventListener('click', () => lb.close());
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  }

  /* ---------- The sneaker running the metro line ---------- */
  function initSneaker() {
    const track = document.getElementById('sneak-track');
    if (!track || reduce()) return;
    const run = () => { track.classList.remove('run'); void track.offsetWidth; track.classList.add('run'); };
    new IntersectionObserver((es, o) => es.forEach(e => {
      if (e.isIntersecting) { run(); o.disconnect(); }
    }), { threshold: .6 }).observe(track);
    track.addEventListener('click', () => { run(); push({ event: 'sneaker_run' }); });
  }

  /* ---------- The rotating word in the hero ---------- */
  function rotor(id, words, ms = 2400) {
    const node = document.getElementById(id);
    if (!node || !words.length || reduce()) return;
    let i = 0;
    setInterval(() => {
      node.classList.add('fade');
      setTimeout(() => {
        i = (i + 1) % words.length;
        node.textContent = words[i];
        node.classList.remove('fade');
      }, 250);
    }, ms);
  }

  /* ---------- A clickable card ----------
     item: { href, title, desc, kpi, tag, img:{src,alt,w,h}, more, event, channel } */
  function card(item) {
    const a = el('a', { className: 'card', href: item.href });
    if (item.event) { a.dataset.track = item.event; a.dataset.channel = item.channel || ''; }
    // No image, or an image that 404s: the card keeps its text and loses the frame.
    if (item.img && item.img.src) {
      const fig = el('figure', { className: 'shot' });
      const img = smartImg(item.img, () => fig.remove());
      if (img) { fig.appendChild(img); a.appendChild(fig); }
    }
    const body = el('div', { className: 'body' });
    if (item.tag) body.appendChild(el('div', { className: 'tag', textContent: item.tag }));
    if (item.chips) {
      const row = el('div', { style: 'margin-bottom:10px' });
      item.chips.forEach(c => row.appendChild(el('span', { className: 'chip' + (c.on ? ' on' : ''), textContent: c.label })));
      body.appendChild(row);
    }
    body.appendChild(el('h3', { textContent: item.title }));
    if (item.kpi) body.appendChild(el('div', { className: 'kpi', textContent: item.kpi }));
    if (item.desc) body.appendChild(el('p', { textContent: item.desc }));
    body.appendChild(el('div', { className: 'more', textContent: item.more || 'Read the case →' }));
    a.appendChild(body);
    return a;
  }

  function cards(targetId, items) {
    const box = document.getElementById(targetId);
    if (!box) return;
    items.forEach(it => box.appendChild(card(it)));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNav(); initTracking(); initCounters(); initLightbox(); initSneaker();
  });

  return { push, el, smartImg, smartVideo, youtubeFacade, mountMedia, tidy, card, cards, rotor, reduce };
})();
