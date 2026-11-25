/**
 * أدوات واجهة مشتركة + سجل الشاشات + مكوّن «رحلتي»
 */
Kanaan.UI = (function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** إنشاء عنصر: el('button.btn.primary', {type:'button', onclick}, 'نص', child) */
  function el(spec, attrs, ...children) {
    const [tag, ...classes] = spec.split('.');
    const node = document.createElement(tag || 'div');
    if (classes.length) node.className = classes.join(' ');
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'dataset') Object.assign(node.dataset, v);
        else node.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      node.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return node;
  }

  const EASTERN = '٠١٢٣٤٥٦٧٨٩';
  const digits = (n) => String(n).replace(/[0-9]/g, (d) => EASTERN[d]);

  const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? Math.min(ms, 150) : ms));

  function announce(text) {
    const a = document.getElementById('announcer');
    a.textContent = '';
    requestAnimationFrame(() => { a.textContent = text; });
  }

  /** شريط تغذية راجعة: لا يعتمد على اللون وحده (أيقونة + نص + شكل) */
  function feedback(kind, text) {
    const icon = { success: '✔', retry: '↺', info: '💡' }[kind] || '';
    announce(text);
    if (Kanaan.Host) Kanaan.Host.hide(); // التغذية الراجعة تحل محل كلام المرشد: مصدر واحد للانتباه
    return el(`p.feedback.feedback--${kind}`, { role: 'status' },
      el('span.feedback-icon', { 'aria-hidden': 'true' }, icon), text);
  }

  /** زر أساسي/ثانوي */
  function button(label, { variant = 'primary', icon, onClick, ariaLabel, big } = {}) {
    return el(`button.btn.btn--${variant}${big ? '.btn--big' : ''}`,
      { type: 'button', onclick: onClick, 'aria-label': ariaLabel },
      icon ? el('span.btn-icon', { 'aria-hidden': 'true' }, icon) : null,
      el('span', null, label));
  }

  /** تمييز الحرف الهدف (مع حركته) داخل كلمة: لون + خط سفلي */
  function highlightLetter(word, letter, { firstOnly = false } = {}) {
    const span = el('span.word');
    const re = new RegExp(`(${letter}[\\u064B-\\u0652]*)`);
    let marked = false;
    word.split(re).forEach((part) => {
      if (!part) return;
      const hit = re.test(part) && !(firstOnly && marked);
      if (hit) marked = true;
      span.append(hit ? el('mark.target', null, part) : part);
    });
    return span;
  }

  /* ---------------- سجل الشاشات ---------------- */
  const screens = {};
  function registerScreen(def) { screens[def.id] = def; }

  /* ---------------- رحلتي ---------------- */
  const STAGES = [
    { key: 'listen', label: 'أستمع', icon: '👂' },
    { key: 'discover', label: 'أكتشف', icon: '🔍' },
    { key: 'speak', label: 'أنطق', icon: '🎙️' },
    { key: 'build', label: 'أبني', icon: '🧩' },
    { key: 'apply', label: 'أوظِّف', icon: '🚀' }
  ];

  function renderJourney(currentKey, doneKeys) {
    const ol = document.getElementById('journey-steps');
    ol.replaceChildren(...STAGES.map((s, i) => {
      const done = doneKeys.includes(s.key);
      const current = s.key === currentKey;
      const state = done ? 'مكتملة' : current ? 'الحالية' : 'قادمة';
      return el(`li.journey-step${done ? '.is-done' : ''}${current ? '.is-current' : ''}`,
        { 'aria-current': current ? 'step' : null, 'aria-label': `${digits(i + 1)}. ${s.label} — ${state}` },
        el('span.journey-num', { 'aria-hidden': 'true' }, done ? '✓' : digits(i + 1)),
        el('span.journey-label', { 'aria-hidden': 'true' }, s.label));
    }));
  }

  /* ---------------- مكوّن الراديو (SVG + شاشة موجة) ---------------- */
  function radio({ withCanvas = true, compact = false } = {}) {
    const canvas = withCanvas ? el('canvas.radio-wave', { width: 520, height: 120, 'aria-hidden': 'true' }) : null;
    const node = el(`div.radio${compact ? '.radio--compact' : ''}`, { role: 'img', 'aria-label': 'جهاز راديو المحطة' },
      el('div.radio-antenna', { 'aria-hidden': 'true' }),
      el('div.radio-body', null,
        el('div.radio-display', null, canvas),
        el('div.radio-bottom', { 'aria-hidden': 'true' },
          el('span.radio-knob'),
          el('div.radio-grille'),
          el('span.radio-knob'))));
    return { node, canvas };
  }

  /* ---------------- مُظهِر الموجة الصوتية ----------------
   * live: يرسم بيانات حقيقية من AnalyserNode (صوت مولّد أو ميكروفون)
   * speech: موجة تقريبية أثناء كلام الصوت الآلي (لا تتوفر بياناته الفعلية)
   * idle: خط هادئ — لا حركة دون صوت */
  function waveView(canvas) {
    const ctx = canvas.getContext('2d');
    let mode = 'idle', analyser = null, raf = 0, t = 0;
    const buf = new Float32Array(1024);
    const color = getComputedStyle(document.documentElement).getPropertyValue('--wave').trim() || '#FFC857';

    function draw() {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.strokeStyle = color;
      ctx.beginPath();
      if (mode === 'live' && analyser) {
        analyser.getFloatTimeDomainData(buf);
        const step = buf.length / w;
        for (let x = 0; x < w; x++) {
          const v = buf[Math.floor(x * step)] || 0;
          const y = h / 2 + Math.max(-1, Math.min(1, v * 2.4)) * (h / 2 - 6);
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
      } else if (mode === 'speech') {
        t += 0.12;
        for (let x = 0; x < w; x++) {
          const env = Math.sin((x / w) * Math.PI);
          const y = h / 2 + env * (Math.sin(x * 0.09 + t * 3) * 0.6 + Math.sin(x * 0.031 - t) * 0.4) * (h / 3);
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
      } else {
        ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
      }
      ctx.stroke();
      if (mode !== 'idle') raf = requestAnimationFrame(draw);
    }

    return {
      live(a) { analyser = a; mode = 'live'; cancelAnimationFrame(raf); draw(); },
      speech() { mode = 'speech'; cancelAnimationFrame(raf); draw(); },
      idle() { mode = 'idle'; cancelAnimationFrame(raf); draw(); },
      destroy() { cancelAnimationFrame(raf); }
    };
  }

  return { el, digits, highlightLetter, wait, announce, feedback, button, registerScreen, screens, renderJourney, STAGES, radio, waveView, reduceMotion };
})();
