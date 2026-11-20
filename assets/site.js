/* ==========================================================================
   SITE BEHAVIOUR v2 - vikingkadar.github.io
   Loaded at the end of <body>, after assets/content.js and BEFORE each
   page's own render script, so pages can call VK.* helpers straight away.

   Nothing in here invents content: everything comes from window.CONTENT.
   Media whose file is missing removes itself quietly.

   Motion rules: everything is transform/opacity driven by
   IntersectionObserver, and everything stands still when the visitor has
   asked for reduced motion.
   ========================================================================== */
window.VK = (function () {
  'use strict';

  const C = window.CONTENT || {};
  const S = C.site || {};
  const F = C.flags || {};

  /* ---------- tiny utilities ---------- */
  const dl = () => (window.dataLayer = window.dataLayer || []);
  const push = o => { dl().push(o); };
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = () => matchMedia('(pointer: fine)').matches;
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => Array.prototype.slice.call(r.querySelectorAll(s));
  const el = (tag, props = {}, kids) => {
    const n = document.createElement(tag);
    Object.keys(props).forEach(k => {
      if (k === 'class') n.className = props[k];
      else if (k === 'data') Object.keys(props[k]).forEach(d => { n.dataset[d] = props[k][d]; });
      else if (k === 'attrs') Object.keys(props[k]).forEach(a => n.setAttribute(a, props[k][a]));
      else if (k === 'style' && typeof props[k] === 'string') n.style.cssText = props[k];
      else n[k] = props[k];
    });
    if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach(c => { if (c != null && c !== false) n.append(c); });
    return n;
  };
  const basename = p => String(p).split('/').pop();
  const mailto = () => 'mailto:' + (S.email || '') + (S.emailSubject ? '?subject=' + encodeURIComponent(S.emailSubject) : '');
  const pageType = () => { const m = dl().filter(x => x && x.event === 'page_meta').pop(); return m ? m.page_type : ''; };
  const fmtNum = (n, dec) => dec ? n.toFixed(dec) : Math.round(n).toLocaleString('en-US');
  const isOn = flag => !flag || !!F[flag];
  const arrow = () => el('span', { class: 'ar', attrs: { 'aria-hidden': 'true' } }, '→');

  /* ---------- media ---------- */
  // An <img> that removes itself if the file is missing.
  function img(item, o = {}) {
    if (!item || !item.src) { o.onDead && o.onDead(); return null; }
    const i = el('img', { src: item.src, alt: item.alt || '' });
    if (item.w) i.width = item.w;
    if (item.h) i.height = item.h;
    if (o.eager) i.setAttribute('fetchpriority', 'high'); else i.loading = 'lazy';
    i.decoding = 'async';
    if (o.sizes) i.sizes = o.sizes;
    i.addEventListener('error', () => { i.remove(); o.onDead && o.onDead(); }, { once: true });
    return i;
  }

  // A silent loop: muted, playsinline, preload="none". Nothing plays by
  // itself: it starts on hover (mouse) or tap, and pauses when it leaves the screen.
  const loopIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) e.target.pause();
  }), { threshold: 0 }) : null;

  function loop(item, o = {}) {
    if (!item || !item.src) { o.onDead && o.onDead(); return null; }
    const box = el('div', { class: 'loop' });
    const v = el('video', { muted: true, loop: true, playsInline: true, preload: 'none' });
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('loop', '');
    const poster = item.poster && item.poster.src ? item.poster.src : item.poster;
    if (poster) v.poster = poster;
    if (item.w) v.width = item.w;
    if (item.h) v.height = item.h;
    if (item.alt) v.setAttribute('aria-label', item.alt);
    const s = el('source', { src: item.src, type: item.type || 'video/mp4' });
    s.addEventListener('error', () => { box.remove(); o.onDead && o.onDead(); }, { once: true });
    v.appendChild(s);
    let seen = false;
    const start = () => {
      if (reduce()) return;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
      if (!seen) { seen = true; push({ event: 'video_hover', channel: item.channel || basename(item.src) }); }
    };
    box.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') start(); });
    box.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') v.pause(); });
    // A tap toggles. Inside a link the tap still follows the link, as it should.
    box.addEventListener('click', e => { if (box.closest('a')) return; e.preventDefault(); v.paused ? start() : v.pause(); });
    box.appendChild(v);
    if (loopIO) loopIO.observe(v);
    return box;
  }

  // YouTube facade: thumbnail plus a play button. The iframe is only created
  // on click, from youtube-nocookie.com, so nothing from YouTube loads first.
  function facade(item) {
    const id = item.youtube;
    const box = el('div', { class: 'vid' + (item.vertical ? ' v' : '') });
    const btn = el('button', { type: 'button', data: { cursor: 'Play' } });
    btn.setAttribute('aria-label', 'Play video: ' + (item.title || 'video'));
    // A local poster wins when one is given; otherwise YouTube's own thumbnail.
    // If neither answers, the title sits on a dark card instead of a black hole.
    const noThumb = () => {
      box.classList.add('nothumb');
      if (item.title) btn.insertBefore(el('span', { class: 'ph', attrs: { 'aria-hidden': 'true' } }, item.title), btn.firstChild);
    };
    if (item.noThumb) {
      // noThumb: true in content.js = ask YouTube for nothing (used while a video is not public).
      noThumb();
    } else {
      const thumb = item.poster && item.poster.src
        ? el('img', { src: item.poster.src, alt: '', loading: 'lazy', decoding: 'async', width: item.poster.w || 480, height: item.poster.h || 360 })
        : el('img', { src: 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg', alt: '', loading: 'lazy', decoding: 'async', width: 480, height: 360 });
      thumb.addEventListener('error', () => { thumb.remove(); noThumb(); }, { once: true });
      btn.appendChild(thumb);
    }
    btn.appendChild(el('span', { class: 'play', attrs: { 'aria-hidden': 'true' } }));
    if (item.title && !item.noLabel) btn.appendChild(el('span', { class: 'lbl' }, item.title));
    btn.addEventListener('click', () => {
      push({ event: 'video_play', channel: item.channel || id, video_id: id, video_title: item.title || '' });
      box.replaceChildren(el('iframe', {
        src: 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1',
        title: item.title || 'Video', allowFullscreen: true,
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      }));
    });
    box.appendChild(btn);
    return box;
  }

  // Whatever the item is: a YouTube id, a loop, or a still.
  function media(item, o = {}) {
    if (!item) { o.onDead && o.onDead(); return null; }
    if (item.youtube) return facade(item);
    if (item.src && /\.(mp4|webm|mov)$/i.test(item.src)) return loop(item, o);
    return img(item, o);
  }

  // Fill [data-img] / [data-media] slots from an object, hiding empties.
  function mount(obj, root = document) {
    qa('[data-img],[data-media]', root).forEach(slot => {
      const key = slot.dataset.img || slot.dataset.media;
      const hideSel = slot.dataset.hide;
      const die = () => { const t = hideSel ? slot.closest(hideSel) : slot; if (t) t.classList.add('hidden'); };
      const node = media(obj[key], { onDead: die, eager: slot.dataset.eager === '1' });
      if (node) slot.appendChild(node); else die();
    });
  }

  /* ---------- text helpers ---------- */
  // Set text; an empty value removes the element (or its data-hide wrapper).
  function text(sel, value) {
    const n = typeof sel === 'string' ? q(sel) : sel;
    if (!n) return;
    if (value == null || value === '') { const t = n.dataset.hide ? n.closest(n.dataset.hide) : n; t && t.classList.add('hidden'); return; }
    n.textContent = value;
  }
  function paras(sel, list) {
    const n = typeof sel === 'string' ? q(sel) : sel;
    if (!n) return;
    const items = (list || []).filter(Boolean);
    if (!items.length) { const t = n.dataset.hide ? n.closest(n.dataset.hide) : n; t && t.classList.add('hidden'); return; }
    items.forEach(t => n.appendChild(el('p', {}, t)));
  }
  function hideIfEmpty(sel) {
    qa(sel).forEach(n => { if (!n.children.length && !n.textContent.trim()) n.classList.add('hidden'); });
  }
  function tags(list) {
    const ul = el('ul', { class: 'tags' });
    (list || []).forEach(t => ul.appendChild(el('li', {}, t)));
    return ul;
  }

  /* ---------- navigation ---------- */
  function initNav() {
    const nav = q('#nav');
    if (nav) {
      const onScroll = () => nav.classList.toggle('solid', window.scrollY > 24);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      const here = location.pathname.split('/').pop() || 'index.html';
      qa('ul a', nav).forEach(a => {
        const target = (a.getAttribute('href') || '').split('#')[0] || 'index.html';
        if (target === here && !a.getAttribute('href').includes('#')) a.setAttribute('aria-current', 'page');
      });
    }
    const overlay = q('#overlay'), btn = q('#menu-btn');
    if (!overlay || !btn) return;
    const set = open => {
      overlay.classList.toggle('open', open);
      overlay.setAttribute('aria-hidden', String(!open));
      btn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) { const first = q('a,button', overlay); first && first.focus(); } else btn.focus();
    };
    btn.addEventListener('click', () => set(!overlay.classList.contains('open')));
    const close = q('#menu-close');
    if (close) close.addEventListener('click', () => set(false));
    qa('a', overlay).forEach(a => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) set(false); });
  }

  /* ---------- tracking ----------
     Declarative: any element with data-track pushes { event, channel }.
     section_view and scroll_depth fire at most once each per page view. */
  function initTracking() {
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-track]');
      if (!t) return;
      const o = { event: t.dataset.track };
      if (t.dataset.channel) o.channel = t.dataset.channel;
      if (t.dataset.title) o.poster_title = t.dataset.title;
      push(o);
    });
    const seen = new Set();
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting || seen.has(e.target.id)) return;
        seen.add(e.target.id);
        push({ event: 'section_view', section_id: e.target.id });
      }), { threshold: .3 });
      qa('section[id],header[id]').forEach(s => io.observe(s));
    }
    const marks = [25, 50, 75, 100], hit = new Set();
    const depth = () => {
      const doc = document.documentElement;
      const d = Math.round((window.scrollY + window.innerHeight) / doc.scrollHeight * 100);
      marks.forEach(m => { if (d >= m && !hit.has(m)) { hit.add(m); push({ event: 'scroll_depth', percent: m }); } });
    };
    window.addEventListener('scroll', depth, { passive: true });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    const nodes = qa('.rv');
    if (!nodes.length) return;
    if (reduce() || !('IntersectionObserver' in window)) { nodes.forEach(n => n.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    nodes.forEach(n => io.observe(n));
  }
  // Add staggered reveal classes to the children of a container.
  function stagger(container, max = 5) {
    const n = typeof container === 'string' ? q(container) : container;
    if (!n) return;
    qa(':scope > *', n).forEach((c, i) => { c.classList.add('rv'); if (i % (max + 1)) c.classList.add('d' + Math.min(i % (max + 1), max)); });
  }

  /* ---------- counters ----------
     The real number is already in the HTML. When the element scrolls into
     view it counts up to it; with reduced motion it simply stays. */
  let counterSeen = false;
  function initCounters() {
    const nodes = qa('[data-count]');
    if (!nodes.length) return;
    const render = (n, val) => {
      const dec = +(n.dataset.dec || 0);
      n.textContent = (n.dataset.pre || '') + fmtNum(val, dec) + (n.dataset.suf || '');
    };
    const run = n => {
      const target = parseFloat(n.dataset.count);
      if (!isFinite(target)) return;
      if (!counterSeen) { counterSeen = true; push({ event: 'counter_seen', page_type: pageType() }); }
      if (reduce()) { render(n, target); return; }
      const t0 = performance.now(), dur = 1700;
      const tick = now => {
        const k = Math.min(1, (now - t0) / dur), ease = 1 - Math.pow(1 - k, 3);
        render(n, target * ease);
        if (k < 1) requestAnimationFrame(tick); else render(n, target);
      };
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      run(e.target);
    }), { threshold: .5 });
    nodes.forEach(n => io.observe(n));
  }
  // A counting number element. { value, dec, pre, suf, text }
  function counter(item, cls) {
    const span = el('span', { class: cls || '' }, item.text != null ? item.text : (item.pre || '') + fmtNum(item.value, item.dec) + (item.suf || ''));
    if (item.value != null && isFinite(item.value)) {
      span.dataset.count = item.value;
      if (item.dec) span.dataset.dec = item.dec;
      if (item.pre) span.dataset.pre = item.pre;
      if (item.suf) span.dataset.suf = item.suf;
    }
    return span;
  }

  /* ---------- bars ---------- */
  function initBars() {
    const bars = qa('.bar[data-w]');
    if (!bars.length) return;
    bars.forEach(b => b.style.setProperty('--w', b.dataset.w + '%'));
    if (reduce() || !('IntersectionObserver' in window)) { bars.forEach(b => b.classList.add('on')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), { threshold: .6 });
    bars.forEach(b => io.observe(b));
  }
  function bar(item) {
    const wrap = el('div', { class: 'barrow' });
    const row = el('div', { class: 'row' }, [el('span', {}, item.label), el('b', {}, item.text || (item.value + (item.unit ? ' ' + item.unit : '')))]);
    const b = el('div', { class: 'bar', data: { w: String(item.pct != null ? item.pct : item.value) } }, el('i'));
    wrap.append(row, b);
    return wrap;
  }

  /* ---------- tilt (fine pointers only) ---------- */
  function initTilt() {
    if (!fine() || reduce()) return;
    qa('.tilt').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.classList.add('on');
        card.style.transform = 'perspective(900px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 6).toFixed(2) + 'deg)';
      });
      card.addEventListener('pointerleave', () => { card.classList.remove('on'); card.style.transform = ''; });
    });
  }

  /* ---------- custom cursor: a dot that becomes a ring with a word ---------- */
  function initCursor() {
    const cur = q('#cur');
    if (!cur || !F.CURSOR || !fine() || reduce()) return;
    document.documentElement.classList.add('cursor');
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0;
    const draw = () => {
      cx += (x - cx) * .35; cy += (y - cy) * .35;
      cur.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px) translate(-50%,-50%)';
      raf = Math.abs(x - cx) + Math.abs(y - cy) > .2 ? requestAnimationFrame(draw) : 0;
    };
    document.addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; cur.classList.remove('hide'); if (!raf) raf = requestAnimationFrame(draw); }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.add('hide'));
    document.addEventListener('pointerover', e => {
      const labelled = e.target.closest('[data-cursor]');
      if (labelled) { cur.textContent = labelled.dataset.cursor; cur.className = 'cur ring'; return; }
      cur.textContent = '';
      cur.className = e.target.closest('a,button,summary,label,[role=button]') ? 'cur hover' : 'cur';
    });
  }

  /* ---------- lightbox for posters and ads ---------- */
  function initLightbox() {
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-zoom]');
      if (!b) return;
      let lb = q('#lightbox');
      if (!lb) {
        lb = el('dialog', { class: 'lb', id: 'lightbox' }, [el('button', { type: 'button', id: 'lb-close' }, 'Close'), el('img', { id: 'lb-img', src: '', alt: '' })]);
        document.body.appendChild(lb);
        q('#lb-close', lb).addEventListener('click', () => lb.close());
        lb.addEventListener('click', ev => { if (ev.target === lb) lb.close(); });
      }
      const im = q('#lb-img', lb);
      im.src = b.dataset.zoom;
      const inner = b.querySelector('img');
      im.alt = inner ? inner.alt : (b.dataset.title || '');
      if (typeof lb.showModal === 'function') lb.showModal();
      const o = { event: b.dataset.event || 'poster_open' };
      if (b.dataset.title) o.poster_title = b.dataset.title;
      if (b.dataset.channel) o.channel = b.dataset.channel;
      push(o);
    });
  }

  /* ---------- the rotating word in the hero ---------- */
  function rotor(node, words, ms = 2000) {
    node = typeof node === 'string' ? q(node) : node;
    if (!node || !words || !words.length) return;
    node.textContent = words[0];
    if (reduce() || words.length < 2) return;
    let i = 0;
    setInterval(() => {
      node.classList.add('out');
      setTimeout(() => { i = (i + 1) % words.length; node.textContent = words[i]; node.classList.remove('out'); }, 260);
    }, ms);
  }

  /* ---------- ticker ---------- */
  function ticker(host, items) {
    host = typeof host === 'string' ? q(host) : host;
    if (!host || !items || !items.length) { host && host.classList.add('hidden'); return; }
    const row = el('div', { class: 'row', attrs: { 'aria-hidden': 'true' } });
    const list = reduce() ? items : items.concat(items);   // doubled for a seamless loop
    list.forEach(t => row.appendChild(el('span', {}, t)));
    host.appendChild(row);
    host.appendChild(el('ul', { class: 'vh' }, items.map(t => el('li', {}, t))));
  }

  /* ---------- the sneaker running the metro line ---------- */
  function initSneaker() {
    const track = q('#sneak-track');
    if (!track) return;
    if (reduce()) return;
    const run = () => { track.classList.remove('run'); void track.offsetWidth; track.classList.add('run'); };
    if ('IntersectionObserver' in window) new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { run(); o.disconnect(); } }), { threshold: .6 }).observe(track);
    track.addEventListener('click', () => { run(); push({ event: 'sneaker_run' }); });
  }

  /* ---------- before / after slider ---------- */
  function beforeAfter(host, before, after, labels = {}) {
    host = typeof host === 'string' ? q(host) : host;
    if (!host) return;
    const hideSel = host.dataset.hide;
    const die = () => { const t = hideSel ? host.closest(hideSel) : host; t && t.classList.add('hidden'); };
    if (!before || !before.src || !after || !after.src) return die();
    const box = el('div', { class: 'ba', style: '--x:50%' });
    const b = img(before, { onDead: die }); const a = img(after, { onDead: die });
    if (!b || !a) return die();
    a.classList.add('after');
    const range = el('input', { type: 'range', min: 0, max: 100, value: 50 });
    range.setAttribute('aria-label', labels.hint || 'Compare before and after');
    let flipped = false;
    range.addEventListener('input', () => {
      box.style.setProperty('--x', range.value + '%');
      if (!flipped) { flipped = true; push({ event: 'posterlab_flip' }); }
    });
    box.append(b, a, el('div', { class: 'handle' }), el('div', { class: 'knob', attrs: { 'aria-hidden': 'true' } }, '◂▸'));
    if (labels.before) box.appendChild(el('span', { class: 'lab b' }, labels.before));
    if (labels.after) box.appendChild(el('span', { class: 'lab a' }, labels.after));
    box.appendChild(range);
    host.appendChild(box);
    if (labels.hint) host.appendChild(el('p', { class: 'ba-hint' }, labels.hint));
  }

  /* ---------- "Can you stop the scroll?" ---------- */
  function feed(cfg) {
    const phone = q('#phone'), card = q('#feed-card'), btn = q('#feed-stop');
    if (!phone || !card || !btn) return;
    const P = C.performance || {}, O = C.opera || {};
    const ads = (P.ads || []).map(a => ({
      id: 'ad_' + a.id, kicker: 'Meta ad · Aroma Roast', name: a.en || a.sv || a.id, thinking: a.thinking,
      href: 'course-performance-marketing.html', event: 'course_open', channel: 'performance_marketing',
      img: { src: 'images/wall/' + basename(a.img), alt: 'Aroma Roast ad: ' + (a.en || ''), w: 540, h: 675 },
    }));
    const posters = (O.posters || []).map((p, i) => ({
      id: 'poster_' + basename(p.src).replace(/\.\w+$/, ''), kicker: 'Poster · The Royal Opera', name: p.title, thinking: p.text,
      href: 'course-opera.html', event: 'course_open', channel: 'opera',
      img: { src: 'images/wall/' + basename(p.src), alt: p.alt || '', w: 540, h: 802 },
    }));
    const items = [];
    const n = Math.max(ads.length, posters.length);
    for (let i = 0; i < n; i++) { if (ads[i]) items.push(ads[i]); if (posters[i]) items.push(posters[i]); }
    if (!items.length) { const sec = phone.closest('section'); sec && sec.classList.add('hidden'); return; }

    const screen = q('.screen', phone), track = q('.track', phone);
    const build = list => list.map(it => {
      const fig = el('figure');
      const im = img(it.img); if (im) fig.appendChild(im);
      fig.appendChild(el('figcaption', {}, [el('b', {}, it.kicker), el('span', {}, it.name)]));
      return fig;
    });
    const still = reduce();
    track.append(...build(items));
    if (!still) track.append(...build(items));   // a second copy makes the wrap-around invisible

    let ph = 560, y = 0, running = !still, idx = 0, last = 0, raf = 0;
    const total = () => ph * items.length;
    const size = () => { ph = screen.clientHeight || 560; phone.style.setProperty('--ph', ph + 'px'); };
    size(); window.addEventListener('resize', size, { passive: true });
    const setY = () => { track.style.transform = 'translateY(' + (-y).toFixed(1) + 'px)'; };
    const step = now => {
      if (!running) { raf = 0; return; }
      const dt = Math.min(48, now - (last || now)); last = now;
      y += ph * .9 * dt / 1000;
      if (y >= total()) y -= total();
      setY();
      raf = requestAnimationFrame(step);
    };
    const show = i => {
      const it = items[i % items.length];
      card.classList.remove('idle');
      q('.fc-k', card).textContent = it.kicker;
      q('h3', card).textContent = it.name;
      q('p', card).textContent = it.thinking || '';
      const a = q('a', card); a.href = it.href; a.dataset.track = it.event; a.dataset.channel = it.channel;
    };
    const stop = (source) => {
      if (!running) return;
      running = false; cancelAnimationFrame(raf); raf = 0;
      idx = Math.round(y / ph);
      y = idx * ph;
      track.classList.add('snap'); setY();
      setTimeout(() => track.classList.remove('snap'), 450);
      phone.classList.add('stopped');
      show(idx);
      btn.textContent = cfg.again || 'Roll again';
      push({ event: 'feed_stop', channel: items[idx % items.length].id, source: source });
    };
    const go = () => {
      if (running) return;
      running = true; last = 0; phone.classList.remove('stopped'); card.classList.add('idle');
      btn.textContent = cfg.button || 'Stop';
      if (y >= total()) y -= total();
      raf = requestAnimationFrame(step);
    };
    // Start only when the phone is on screen, pause when it is not.
    if (!still && 'IntersectionObserver' in window) {
      new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { if (running && !raf) { last = 0; raf = requestAnimationFrame(step); } }
        else if (raf) { cancelAnimationFrame(raf); raf = 0; }
      }), { threshold: .2 }).observe(phone);
    } else if (!still) { raf = requestAnimationFrame(step); }

    if (still) {
      // Reduced motion: nothing moves. The button steps through the feed.
      y = 0; setY(); phone.classList.add('stopped'); show(0);
      btn.textContent = 'Next';
      btn.addEventListener('click', () => { idx = (idx + 1) % items.length; y = idx * ph; setY(); show(idx); push({ event: 'feed_stop', channel: items[idx].id, source: 'next' }); });
      return;
    }
    btn.addEventListener('click', () => running ? stop('button') : go());
    phone.addEventListener('click', () => running ? stop('phone') : go());
    phone.setAttribute('role', 'button'); phone.setAttribute('tabindex', '0');
    phone.setAttribute('aria-label', cfg.title || 'Stop the scroll');
    phone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); running ? stop('phone') : go(); } });
  }

  /* ---------- the e-mail address, from one place ----------
     CONTENT.site.email is the only copy. Every mailto: link on the page and
     every visible address is rewritten from it, and the e-mail buttons in
     the menu get their label from CONTENT.site.ctaLabel. */
  const EMAIL_RE = /[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}/i;
  function initMail() {
    if (!S.email) return;
    qa('a[href^="mailto:"]').forEach(a => {
      a.href = mailto();
      if (EMAIL_RE.test(a.textContent) && !a.children.length) a.textContent = a.textContent.replace(EMAIL_RE, S.email);
    });
    if (S.ctaLabel) qa('.nav-cta, .overlay a.btn[href^="mailto:"]').forEach(a => { a.textContent = S.ctaLabel; });
    const ld = q('script[type="application/ld+json"]');
    if (ld) { try { const j = JSON.parse(ld.textContent); if (j.email) { j.email = 'mailto:' + S.email; ld.textContent = JSON.stringify(j); } } catch (e) {} }
  }

  /* ---------- shared blocks ----------
     CV buttons: one HEAD request per page. When the file answers, a
     "Download CV" button appears in every slot (hero, menu, contact).
     When it does not, nothing appears and nothing else is requested. */
  let cvCheck = null;
  function cvExists() {
    if (!S.cv || location.protocol === 'file:') return Promise.resolve(false);
    if (!cvCheck) cvCheck = fetch(S.cv, { method: 'HEAD', cache: 'no-store' }).then(r => r.ok).catch(() => false);
    return cvCheck;
  }
  function cvButton(channel, className) {
    const a = el('a', { class: className == null ? 'btn' : className, href: S.cv, data: { track: 'cv_download', channel: channel } }, [S.cvLabel || 'Download CV']);
    a.setAttribute('download', '');
    return a;
  }
  // targets: [{ sel, channel, className }]
  function cv(targets) {
    if (!targets || !targets.length) return;
    cvExists().then(ok => {
      if (!ok) return;
      targets.forEach(t => {
        const host = typeof t.sel === 'string' ? q(t.sel) : t.sel;
        if (host && !host.querySelector('[data-track="cv_download"]')) host.appendChild(cvButton(t.channel || 'contact', t.className));
      });
    });
  }
  // Every page: the menu and the contact block. The hero slot exists on the homepage only.
  function initCV() {
    cv([
      { sel: '#hero-cv', channel: 'hero', className: 'btn' },
      { sel: '#overlay', channel: 'menu', className: 'btn' },
      ...qa('.cv-slot').map(n => ({ sel: n, channel: 'contact', className: '' })),
    ]);
  }

  // A quote from a client or a teacher. It renders only when the text, the
  // name and the role are all filled in, otherwise the host is hidden.
  function quote(host, item) {
    host = typeof host === 'string' ? q(host) : host;
    if (!host) return;
    const t = item && String(item.text || '').trim(), n = item && String(item.name || '').trim(), r = item && String(item.role || '').trim();
    if (!t || !n || !r) { host.classList.add('hidden'); return; }
    host.classList.add('quote');
    host.appendChild(el('blockquote', {}, [t, el('cite', {}, n + ', ' + r)]));
  }

  // The contact block at the end of every page.
  function contact(host, o = {}) {
    host = typeof host === 'string' ? q(host) : host;
    if (!host) return;
    // The last word and the arrow stay together, so the arrow never sits alone on a line.
    const words = (S.contactHeadline || 'Let\'s build something').trim().split(' ');
    const last = words.pop();
    const big = el('a', { class: 'big', href: mailto(), data: { track: 'contact_click', channel: o.channel || 'email_footer' } },
      [words.length ? words.join(' ') : null, words.length ? el('br') : null, el('span', { class: 'nw' }, [last + ' ', arrow()])]);
    const p = el('p', {}, S.contactLine || '');
    const ul = el('ul');
    const link = (href, label, ch) => { if (!href) return; const a = el('a', { href: href, data: { track: 'contact_click', channel: ch } }, label); if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; } ul.appendChild(el('li', {}, a)); };
    link(S.linkedin, 'LinkedIn', 'linkedin');
    link(S.tiktok, 'TikTok ' + (S.tiktokHandle || ''), 'tiktok');
    link(S.github, 'GitHub', 'github');
    // The CV link is added here by initCV() once the file has answered.
    ul.appendChild(el('li', { class: 'cv-slot' }));
    const mail = el('a', { class: 'mail', href: mailto(), data: { track: 'contact_click', channel: 'email' } }, S.email || '');
    host.append(big, p, ul, mail);
  }

  // The "In short" box: three numbered lines.
  function inShort(host, items) {
    host = typeof host === 'string' ? q(host) : host;
    if (!host) return;
    const list = (items || []).filter(Boolean);
    if (!list.length) { host.classList.add('hidden'); return; }
    host.appendChild(el('h2', {}, 'In short'));
    const ol = el('ol');
    list.forEach((t, i) => ol.appendChild(el('li', { data: { n: String(i + 1).padStart(2, '0') } }, t)));
    host.appendChild(ol);
  }

  // Case header. cfg: { label, title, kicker, num, numValue, numDec, numSuf, numPre, numLabel, role, period, course, status, tags, media, mediaWide, back:{href,label,channel} }
  //   label  = the small line above the title ("Berghs · Course · Group project")
  //   status = an extra chip in the meta row, e.g. "Hypothesis · results pending"
  function caseHead(host, cfg) {
    host = typeof host === 'string' ? q(host) : host;
    if (!host) return;
    const copy = el('div', { class: 'copy' });
    if (cfg.back) copy.appendChild(el('a', { class: 'back', href: cfg.back.href, data: { track: cfg.back.event || 'story_back', channel: cfg.back.channel || '' } }, ['← ', cfg.back.label]));
    if (cfg.label) copy.appendChild(el('p', { class: 'kicker case-label' }, cfg.label));
    if (cfg.num) {
      const big = el('div', { class: 'bignum' });
      big.appendChild(counter({ value: cfg.numValue, dec: cfg.numDec, pre: cfg.numPre, suf: cfg.numSuf, text: cfg.num }));
      if (cfg.numLabel) big.appendChild(el('small', {}, cfg.numLabel));
      copy.appendChild(big);
    }
    copy.appendChild(el('h1', { class: 'disp' }, cfg.title));
    if (cfg.kicker) copy.appendChild(el('p', { class: 'kicker2' }, cfg.kicker));
    const meta = el('div', { class: 'meta' });
    if (cfg.period) meta.appendChild(el('span', { class: 'chip on' }, cfg.period));
    if (cfg.course) meta.appendChild(el('span', { class: 'chip' }, cfg.course));
    if (cfg.status) meta.appendChild(el('span', { class: 'chip pending' }, cfg.status));
    (cfg.tags || []).forEach(t => meta.appendChild(el('span', { class: 'tag' }, t)));
    if (meta.children.length) copy.appendChild(meta);
    if (cfg.role) copy.appendChild(el('p', { class: 'role' }, cfg.role));
    host.appendChild(copy);
    const m = el('div', { class: 'media' + (cfg.mediaWide ? ' wide' : '') });
    const node = media(cfg.media, { eager: true, onDead: () => m.remove() });
    if (node) { m.appendChild(node); host.appendChild(m); } else host.classList.add('nomedia');
  }

  // A stat wall. items: [{ value, dec, pre, suf, text, label }]
  function stats(host, items, cls) {
    host = typeof host === 'string' ? q(host) : host;
    if (!host) return;
    const list = (items || []).filter(Boolean);
    if (!list.length) { host.classList.add('hidden'); return; }
    host.classList.add('stats'); if (cls) host.classList.add(cls);
    list.forEach(s => host.appendChild(el('div', {}, [el('div', { class: 'v' }, counter(s)), el('div', { class: 'l' }, s.label)])));
  }

  // Previous / next links under a case.
  function pagenav(host, prev, next) {
    host = typeof host === 'string' ? q(host) : host;
    if (!host) return;
    const mk = (it, cls, dir) => el('a', { class: cls, href: it.href, data: { track: it.event || 'case_open', channel: it.channel || '' } }, [el('div', { class: 'dir' }, dir), el('div', { class: 't' }, it.label)]);
    if (prev) host.appendChild(mk(prev, 'prev', prev.dir || 'Previous'));
    if (next) host.appendChild(mk(next, 'next', next.dir || 'Next'));
  }

  // A picture tile used by the hubs and the bento.
  // item: { id, href, title, line, num, numLabel, tags, img, video, size, event, channel, flag, bigText }
  function tile(item, o = {}) {
    if (!isOn(item.flag)) return null;
    const a = el('a', { class: 'tile tilt' + (item.size === 'lg' ? ' lg' : ''), href: item.href, data: { track: o.event || item.event || 'case_open', channel: item.channel || item.id || '', cursor: 'View' } });
    const pic = el('div', { class: 'pic' });
    const num = el('div', { class: 'num' }, [item.num, item.numLabel ? el('small', {}, item.numLabel) : null]);
    const typo = () => {
      // No picture: the number itself becomes the picture, so it is not repeated below.
      a.classList.add('typo');
      pic.replaceChildren(el('div', { class: 'big', attrs: { 'aria-hidden': 'true' } }, item.bigText || item.num || item.title));
      if (item.num) num.replaceChildren(el('small', {}, item.numLabel || ''));
    };
    const m = media(item.video || item.img, { onDead: typo, eager: o.eager });
    if (m) pic.appendChild(m); else typo();
    a.appendChild(pic);
    const body = el('div', { class: 'body' });
    if (item.num) body.appendChild(num);
    body.appendChild(el('h3', {}, item.title));
    if (item.line) body.appendChild(el('p', {}, item.line));
    if (item.tags && item.tags.length) body.appendChild(tags(item.tags));
    a.appendChild(body);
    a.appendChild(el('span', { class: 'go', attrs: { 'aria-hidden': 'true' } }, o.go || 'View case →'));
    return a;
  }
  function tiles(host, items, o = {}) {
    host = typeof host === 'string' ? q(host) : host;
    if (!host) return;
    (items || []).forEach((it, i) => { const t = tile(it, Object.assign({}, o, { eager: o.eager && i === 0 })); if (t) host.appendChild(t); });
    if (!host.children.length) host.classList.add('hidden');
  }

  // Loops and photos in a grid. Each item is a loop or an image; empty hides the host.
  function gallery(host, items, o = {}) {
    host = typeof host === 'string' ? q(host) : host;
    if (!host) return;
    const list = (items || []).filter(Boolean);
    const hideSel = host.dataset.hide;
    const die = () => { const t = hideSel ? host.closest(hideSel) : host; t && t.classList.add('hidden'); };
    if (!list.length) return die();
    list.forEach(it => {
      const fig = el('figure');
      const m = media(it, { onDead: () => { fig.remove(); if (!host.children.length) die(); } });
      if (!m) return;
      fig.appendChild(m);
      if (it.caption) fig.appendChild(el('figcaption', {}, it.caption));
      host.appendChild(fig);
    });
    if (!host.children.length) die();
  }

  // TikTok embeds from full URLs or ids. Anything that is not a number is skipped.
  function tiktoks(host, list) {
    host = typeof host === 'string' ? q(host) : host;
    if (!host) return;
    const hideSel = host.dataset.hide;
    const die = () => { const t = hideSel ? host.closest(hideSel) : host; t && t.classList.add('hidden'); };
    (list || []).forEach(v => {
      const raw = String(v && v.url ? v.url : v);
      const m = raw.match(/video\/(\d+)/);
      const id = m ? m[1] : raw.trim();
      if (!/^\d+$/.test(id)) return;
      const fig = el('figure', { style: 'margin:0' });
      fig.appendChild(el('iframe', { src: 'https://www.tiktok.com/embed/v2/' + id, title: 'Sweden AI on TikTok', loading: 'lazy', allowFullscreen: true }));
      if (v && (v.views || v.why)) fig.appendChild(el('figcaption', {}, [v.views ? el('b', {}, v.views) : null, v.why ? el('span', {}, v.why) : null]));
      host.appendChild(fig);
    });
    if (!host.children.length) die();
  }

  // Redirect a flagged page to its hub when the flag is off.
  // Add ?preview to the address to look at the page anyway (local preview only, nothing links to it).
  function gate(flag, fallback) {
    if (isOn(flag) || /[?&]preview\b/.test(location.search)) return true;
    location.replace(fallback);
    return false;
  }

  // DOMContentLoaded fires after every synchronous script, the page's own
  // render script included, so the contact block's CV slot exists by then.
  document.addEventListener('DOMContentLoaded', () => {
    initMail(); initNav(); initTracking(); initReveal(); initCounters(); initBars(); initTilt(); initCursor(); initLightbox(); initSneaker(); initCV();
  });

  return {
    C, S, F, push, el, q, qa, reduce, fine, mailto, isOn, basename, arrow,
    img, loop, facade, media, mount, text, paras, hideIfEmpty, tags,
    rotor, ticker, feed, beforeAfter, cv, contact, quote, inShort, caseHead, stats, counter, bar, pagenav, tile, tiles, gallery, tiktoks, gate, stagger,
  };
})();
