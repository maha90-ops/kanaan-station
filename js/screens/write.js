/**
 * ٦ أكتب — ورشة الكتابة
 * ثلاثة مستويات بتلاشي الدعم تدريجيًا (scaffolding fading):
 *   ١ أتتبّع: مسار منقّط كثيف + نقطة بداية خضراء + سهم الاتجاه (+ «شاهد كيف يُكتب»)
 *   ٢ أُكمل: نقاط أقل ومسار أخفّ، مع نقطة البداية فقط
 *   ٣ أكتب: لا مسار؛ يكتب الطفل الحرف بنفسه
 * يعمل باللمس والقلم والفأرة (Pointer Events). التقييم تقديري ولطيف ولا يمنع التقدّم:
 * نقارن الحبر بشكل الحرف (التغطية والدقة)، وفي المستوى الثالث بعد مواءمة الحجم والموضع.
 * أثناء الكتابة تتوقف كل حركة غير ضرورية (يختفي المرشد) ليتركّز الانتباه على اليد والحرف.
 *
 * الحرف بلا مسارات في بياناته؟ يُتتبَّع شكل الخط (Noto Naskh) نفسه — فكل حروف الـ٢٨ تعمل.
 */
Kanaan.UI.registerScreen({
  id: 'write',
  stage: 'write',
  render({ ep, next, alive }) {
    const { el, button, feedback, digits } = Kanaan.UI;
    const NS = 'http://www.w3.org/2000/svg';
    const S = 240; // لوحة الكتابة بوحدات ثابتة
    const W = ep.writingActivity || {};
    const strokes = W.strokes || [];
    const dots = W.dots || [];
    const glyphMode = !strokes.length;
    const LEVELS = [
      { key: 'trace', label: 'أتتبّع', line: ep.script.write, cueKey: 'script.write' },
      { key: 'complete', label: 'أُكمل', line: ep.script.write2, cueKey: 'script.write2' },
      { key: 'free', label: 'أكتب', line: ep.script.write3, cueKey: 'script.write3' }
    ];
    let level = 0, inkStrokes = [], drawing = null, checked = false;
    const results = {};

    /* ---------- عناصر الواجهة ---------- */
    const tabs = el('ol.write-levels', { 'aria-label': 'مستويات الكتابة' });
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${S} ${S}`);
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('write-guide');
    const canvas = el('canvas.write-ink', { 'aria-hidden': 'true' });
    const pad = el('div.write-pad', {
      role: 'img', tabindex: '0',
      'aria-label': `مساحة الكتابة: اكتب الحرف ${ep.letter} بإصبعك أو بالفأرة`
    }, svg, canvas);
    const fbSlot = el('div.feedback-slot');
    const instruction = el('p.instruction.write-instruction', { 'aria-live': 'polite' });
    const tipSlot = el('p.write-tip', { 'aria-live': 'polite' });
    const demoBtn = button('شاهد كيف يُكتب', { variant: 'ghost', icon: '👀', onClick: () => demo() });
    const clearBtn = button('امسح', { variant: 'secondary', icon: '🧽', onClick: () => { clearInk(); fbSlot.replaceChildren(); tipSlot.textContent = ''; } });
    const checkBtn = button('انتهيت', { icon: '✔', onClick: () => check() });
    const after = el('div.row.row--center');

    /* ---------- المسارات المرجعية ---------- */
    const pathEls = strokes.map((d) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); return p; });
    const meas = document.createElementNS(NS, 'svg');
    meas.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
    pathEls.forEach((p) => meas.append(p.cloneNode()));

    function svgEl(tag, attrs) {
      const n = document.createElementNS(NS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      return n;
    }

    function drawGuides() {
      svg.replaceChildren();
      // خط القاعدة دائمًا (يساعد على وضع الحرف) — الشكل الوحيد في المستوى الثالث
      svg.append(svgEl('line', { x1: 14, y1: 168, x2: S - 14, y2: 168, class: 'g-base' }));
      // الشكل الصحيح خفيفًا — يظهر فقط بعد محاولة تحتاج إعادة (للمقارنة، لا للحكم)
      if (glyphMode) {
        const m = svgEl('text', { x: S / 2, y: 168, 'text-anchor': 'middle', class: 'g-model g-model-glyph' });
        m.textContent = ep.letter; svg.append(m);
      } else {
        strokes.forEach((d) => svg.append(svgEl('path', { d, class: 'g-model' })));
        dots.forEach(([x, y]) => svg.append(svgEl('circle', { cx: x, cy: y, r: 6, class: 'g-model g-model-dot' })));
      }
      if (level === 2) return;
      if (glyphMode) {
        const t = svgEl('text', { x: S / 2, y: 168, 'text-anchor': 'middle', class: `g-glyph g-glyph--${level}` });
        t.textContent = ep.letter;
        svg.append(t);
        return;
      }
      strokes.forEach((d) => {
        svg.append(svgEl('path', { d, class: `g-track g-track--${level}` }));
        svg.append(svgEl('path', { d, class: `g-dots g-dots--${level}` }));
      });
      dots.forEach(([x, y]) => svg.append(svgEl('circle', { cx: x, cy: y, r: 9, class: 'g-nuqta' })));
      // نقطة البداية + سهم الاتجاه (المستوى الأول)
      const p0 = meas.children[0];
      const a = p0.getPointAtLength(0), b = p0.getPointAtLength(Math.min(26, p0.getTotalLength()));
      svg.append(svgEl('circle', { cx: a.x, cy: a.y, r: 11, class: 'g-start' }));
      if (level === 0) {
        const c = p0.getPointAtLength(Math.min(44, p0.getTotalLength()));
        const ang = Math.atan2(c.y - b.y, c.x - b.x) * 180 / Math.PI;
        svg.append(svgEl('path', { d: 'M-9 -8 L9 0 L-9 8 Z', class: 'g-arrow', transform: `translate(${c.x} ${c.y}) rotate(${ang})` }));
      }
    }

    function paintTabs() {
      tabs.replaceChildren(...LEVELS.map((L, i) => {
        const done = results[L.key];
        return el(`li.write-level${i === level ? '.is-current' : ''}${done ? '.is-done' : ''}`,
          { 'aria-current': i === level ? 'step' : null },
          el('span.wl-num', { 'aria-hidden': 'true' }, done ? '✓' : digits(i + 1)), L.label);
      }));
    }

    /* ---------- الحبر (Pointer Events: لمس، قلم، فأرة) ---------- */
    const ctx = canvas.getContext('2d');
    function fit() {
      const r = pad.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      redraw();
    }
    const toLocal = (e) => {
      const r = canvas.getBoundingClientRect();
      return [((e.clientX - r.left) / r.width) * S, ((e.clientY - r.top) / r.height) * S];
    };
    function strokeSeg(points) {
      const k = canvas.width / S;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = getComputedStyle(pad).getPropertyValue('--ink').trim() || '#1F4E35';
      ctx.lineWidth = 11 * k;
      ctx.beginPath();
      points.forEach(([x, y], i) => (i ? ctx.lineTo(x * k, y * k) : ctx.moveTo(x * k, y * k)));
      if (points.length === 1) ctx.lineTo(points[0][0] * k + 0.1, points[0][1] * k);
      ctx.stroke();
    }
    function redraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      inkStrokes.forEach(strokeSeg);
    }
    function clearInk() { inkStrokes = []; checked = false; pad.classList.remove('show-model'); redraw(); }

    canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* بعض المتصفحات/الأحداث لا تدعم الالتقاط */ }
      if (checked) { clearInk(); fbSlot.replaceChildren(); tipSlot.textContent = ''; }
      drawing = [toLocal(e)];
      inkStrokes.push(drawing);
      redraw();
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!drawing) return;
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      evs.forEach((ev) => drawing.push(toLocal(ev)));
      redraw();
    });
    const end = () => { drawing = null; };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);

    /* ---------- التقييم التقديري ---------- */
    function mask(drawFn) {
      const c = document.createElement('canvas');
      c.width = S; c.height = S;
      const g = c.getContext('2d');
      g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#000'; g.fillStyle = '#000';
      drawFn(g);
      const d = g.getImageData(0, 0, S, S).data;
      const m = new Uint8Array(S * S);
      for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 40 ? 1 : 0;
      return m;
    }
    const glyphFont = '700 170px "Noto Naskh Arabic", "Amiri", serif';
    function targetDraw(width) {
      return (g) => {
        if (glyphMode) {
          g.font = glyphFont; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
          g.fillText(ep.letter, S / 2, 168);
          if (width > 8) { g.lineWidth = width - 8; g.strokeText(ep.letter, S / 2, 168); }
          return;
        }
        g.lineWidth = width;
        strokes.forEach((d) => g.stroke(new Path2D(d)));
        dots.forEach(([x, y]) => { g.beginPath(); g.arc(x, y, Math.max(6, width / 2), 0, Math.PI * 2); g.fill(); });
      };
    }
    function bbox(m) {
      let x0 = S, y0 = S, x1 = 0, y1 = 0, n = 0;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (m[y * S + x]) { n++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      return n ? { x0, y0, x1, y1, w: x1 - x0 + 1, h: y1 - y0 + 1 } : null;
    }

    function evaluate() {
      const pts = inkStrokes.flat();
      if (pts.length < 6) return { level: 'empty' };
      let ink = inkStrokes;
      let shapeOk = true;
      const core = mask(targetDraw(glyphMode ? 0 : 6));
      if (level === 2) {
        // المستوى الثالث: الطفل يكتب في أي مكان وبأي حجم — نواءم حبره مع إطار الحرف قبل المقارنة
        const t = bbox(core);
        const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
        const b = { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
        const bw = Math.max(1, b.x1 - b.x0), bh = Math.max(1, b.y1 - b.y0);
        // نسبة العرض إلى الارتفاع يجب أن تشبه الحرف (خطّ قصير أو خربشة لا تشبه شكله)
        // نضيف سُمك القلم للطرفين: حرف رفيع كالألف خطّ بلا عرض رياضيًا
        const aspectInk = (bw + 16) / (bh + 16), aspectT = (t.w + 16) / (t.h + 16);
        const ratio = aspectInk > aspectT ? aspectInk / aspectT : aspectT / aspectInk;
        if (ratio > 2 || Math.max(bw, bh) < 30) shapeOk = false;
        const k = Math.min(t.w / bw, t.h / bh);
        const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2, tx = (t.x0 + t.x1) / 2, ty = (t.y0 + t.y1) / 2;
        ink = inkStrokes.map((s) => s.map(([x, y]) => [tx + (x - cx) * k, ty + (y - cy) * k]));
      }
      const drawInk = (w) => (g) => {
        g.lineWidth = w;
        ink.forEach((s) => { g.beginPath(); s.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); if (s.length === 1) g.lineTo(s[0][0] + .1, s[0][1]); g.stroke(); });
      };
      const tol = level === 2 ? 40 : 30;
      const track = mask(targetDraw(tol));
      const inkThin = mask(drawInk(6));
      const inkWide = mask(drawInk(level === 2 ? 30 : 26));
      let inkN = 0, inkIn = 0, coreN = 0, coreHit = 0;
      for (let i = 0; i < S * S; i++) {
        if (inkThin[i]) { inkN++; if (track[i]) inkIn++; }
        if (core[i]) { coreN++; if (inkWide[i]) coreHit++; }
      }
      const precision = inkN ? inkIn / inkN : 0;
      const coverage = coreN ? coreHit / coreN : 0;
      const pass = shapeOk && (level === 2 ? coverage >= 0.68 && precision >= 0.55 : coverage >= 0.7 && precision >= 0.6);

      // تلميحات محددة (لا تمنع النجاح): نقطة البداية، والنقاط
      let tip = '';
      if (!glyphMode && level < 2) {
        const p0 = meas.children[0].getPointAtLength(0);
        const first = inkStrokes[0][0];
        if (Math.hypot(first[0] - p0.x, first[1] - p0.y) > 45) tip = 'ابدأ من النقطة الخضراء واتبع السهم.';
      }
      if (!tip && dots.length) {
        const missing = dots.filter(([x, y]) => !pts.some(([px, py]) => Math.hypot(px - x, py - y) < 24));
        if (missing.length && level < 2) tip = dots.length > 1 ? 'لا تنسَ النقاط!' : 'لا تنسَ النقطة!';
      }
      return { level: pass ? 'pass' : 'retry', coverage: +coverage.toFixed(2), precision: +precision.toFixed(2), tip };
    }

    async function check() {
      const r = evaluate();
      if (r.level === 'empty') {
        tipSlot.textContent = '✋ اكتب الحرف بإصبعك أو بالفأرة داخل المربع.';
        return;
      }
      checked = true;
      const L = LEVELS[level];
      results[L.key] = r;
      const pass = r.level === 'pass';
      const text = !pass ? ep.feedback.writing.retry : level === 2 ? ep.feedback.writing.excellent : ep.feedback.writing.traced;
      const key = !pass ? 'retry' : level === 2 ? 'excellent' : 'traced';
      fbSlot.replaceChildren(feedback(pass ? 'success' : 'retry', text));
      tipSlot.textContent = r.tip ? `💡 ${r.tip}` : '';
      if (!pass) pad.classList.add('show-model');   // نُظهر الشكل الصحيح خفيفًا للمقارنة
      Kanaan.Sound.sfx(pass ? 'success' : 'gentle');
      Kanaan.Sound.say(text + (r.tip ? ' ' + r.tip : ''), { who: 'kanaan', cue: Kanaan.AudioLib.lineCue(ep, `feedback.writing.${key}`) });
      Kanaan.Progress.patch(ep.id, 'writing', {
        completed: level === 2 || !!Kanaan.Progress.get(ep.id).activities.writing?.completed,
        levels: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, { pass: v.level === 'pass', coverage: v.coverage, precision: v.precision }]))
      });
      paintTabs();
      after.replaceChildren(
        button('حاول مرة أخرى', { variant: 'secondary', icon: '↻', onClick: () => { clearInk(); fbSlot.replaceChildren(); tipSlot.textContent = ''; after.replaceChildren(); } }),
        level < 2
          ? button(`المستوى التالي: ${LEVELS[level + 1].label}`, { icon: '←', onClick: () => goLevel(level + 1) })
          : button('أوظّف الحرف', { icon: '🎯', big: true, onClick: next }));
    }

    /* ---------- عرض توضيحي: كيف يُكتب الحرف ---------- */
    function demo() {
      pad.classList.remove('demoing');
      void pad.offsetWidth;
      svg.querySelectorAll('.g-demo').forEach((n) => n.remove());
      if (glyphMode) {
        const t = svgEl('text', { x: S / 2, y: 168, 'text-anchor': 'middle', class: 'g-demo g-demo-glyph' });
        t.textContent = ep.letter;
        svg.append(t);
      } else {
        let delay = 0;
        strokes.forEach((d, i) => {
          const p = svgEl('path', { d, class: 'g-demo' });
          const len = meas.children[i].getTotalLength();
          p.style.strokeDasharray = len;
          p.style.strokeDashoffset = len;
          p.style.animation = `writeDemo 1.6s ${delay}s ease-in-out forwards`;
          svg.append(p);
          delay += 1.7;
        });
        dots.forEach(([x, y], i) => {
          const c = svgEl('circle', { cx: x, cy: y, r: 7, class: 'g-demo g-demo-dot' });
          c.style.animationDelay = `${delay + i * 0.35}s`;
          svg.append(c);
        });
      }
      pad.classList.add('demoing');
      Kanaan.Sound.sfx('tap');
    }

    function goLevel(i) {
      level = i;
      clearInk();
      fbSlot.replaceChildren(); tipSlot.textContent = ''; after.replaceChildren();
      drawGuides(); paintTabs();
      demoBtn.hidden = level !== 0;
      sayLevel();
    }

    // تركيز: التعليمات نصًا فوق اللوحة وبصوت كنعان، دون فقاعة أو صورة تغطي الأدوات
    function sayLevel() {
      const L = LEVELS[level];
      instruction.textContent = L.line;
      Kanaan.Host.hide();
      Kanaan.Sound.say(L.line, { who: 'kanaan', cue: Kanaan.AudioLib.lineCue(ep, L.cueKey) });
    }

    const node = el('section.screen.screen--write', { 'aria-labelledby': 'write-title' },
      el('h2.screen-title', { id: 'write-title', tabindex: '-1' }, `✍️ أكتب حرف ${ep.letter}`),
      tabs, instruction, meas,
      el('div.write-area', null, pad,
        el('div.write-tools', null, demoBtn, clearBtn, checkBtn)),
      tipSlot, fbSlot, after);

    const onResize = () => fit();
    return {
      node,
      async onEnter() {
        drawGuides(); paintTabs(); fit();
        window.addEventListener('resize', onResize);
        if (document.fonts && glyphMode) document.fonts.load(glyphFont).then(() => alive() && drawGuides());
        sayLevel();
      },
      cleanup() { window.removeEventListener('resize', onResize); }
    };
  }
});
