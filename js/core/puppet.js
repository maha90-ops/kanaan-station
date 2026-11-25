/**
 * كنعان الحيّ (Puppet) — الشخصية نفسها من الرسم المرجعي، مقسّمة إلى طبقات متحركة:
 *   الخلفية (plate) · الرأس · الفم · الجفنان (SVG) · اليد
 * كل الإحداثيات بوحدات بكسل الرسم الأصلي (1672×941)، والحاوية تُحجَّم بـ transform.
 *
 * الحركة (ولكلٍّ وظيفة):
 *   رمش طبيعي متقطع ............ يجعل الشخصية حيّة دون أن تشتّت
 *   تمايل خفيف جدًا للرأس ....... حضور هادئ (يتوقف مع «أوقف الحركة» أو تقليل الحركة)
 *   الشفتان مع الصوت ........... تحدد بصريًا «من يتكلم الآن» (تعمل دائمًا)
 *   إيماءة اليد أثناء الكلام .... توجيه الانتباه إلى الراديو/الرسالة
 *
 * التزامن: مع الملفات المسجّلة يُقرأ الصوت الحقيقي (AnalyserNode)؛
 * مع الصوت الآلي لا تتوفر بياناته فتُقدَّر حركة الفم بإيقاع مقاطع تقريبي.
 */
Kanaan.Motion = (function () {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  try { paused = localStorage.getItem('kanaan:motion') === 'off'; } catch (e) { /* تجاهل */ }
  const apply = () => document.documentElement.classList.toggle('motion-off', paused || media.matches);
  apply();
  media.addEventListener?.('change', apply);
  return {
    get calm() { return paused || media.matches; },
    get paused() { return paused; },
    setPaused(v) {
      paused = v; apply();
      try { localStorage.setItem('kanaan:motion', v ? 'off' : 'on'); } catch (e) { /* تجاهل */ }
    }
  };
})();

/** مستوى الصوت المشترك (0..1) لكل ما يتفاعل مع الصوت: الفم، الموجات، الميكروفون، شاشة الراديو */
Kanaan.Voice = (function () {
  const state = { level: 0, any: false, kanaan: false, analyser: null, kanaanAnalyser: null };
  let anyCount = 0, kCount = 0;
  const buf = new Float32Array(1024);

  window.addEventListener('kanaan:voice', ({ detail: d }) => {
    const on = d.state === 'start';
    anyCount = Math.max(0, anyCount + (on ? 1 : -1));
    if (d.who === 'kanaan') {
      kCount = Math.max(0, kCount + (on ? 1 : -1));
      state.kanaanAnalyser = on ? d.analyser : null;
    }
    if (on && d.analyser) state.analyser = d.analyser;
    if (!anyCount) state.analyser = null;
    state.any = anyCount > 0;
    state.kanaan = kCount > 0;
  });

  // إيقاع مقاطع تقريبي للصوت الآلي: ~٤٫٥ مقطع/ث مع تنوّع عشوائي ووقفات قصيرة
  let syl = { t0: 0, len: 220, peak: 0.8 };
  function procedural(now) {
    if (now - syl.t0 > syl.len) {
      const pause = Math.random() < 0.12;
      syl = { t0: now, len: pause ? 260 : 150 + Math.random() * 140, peak: pause ? 0.05 : 0.45 + Math.random() * 0.55 };
    }
    const p = (now - syl.t0) / syl.len;
    return syl.peak * Math.sin(Math.PI * p);
  }

  function rms(an) {
    const b = buf.length > an.fftSize ? buf.subarray(0, an.fftSize) : buf;
    an.getFloatTimeDomainData(b);
    let s = 0;
    for (let i = 0; i < b.length; i++) s += b[i] * b[i];
    return Math.sqrt(s / b.length);
  }

  /** يُستدعى كل إطار من المؤقّت المشترك */
  function update(now) {
    let target = 0;
    if (state.any) {
      const an = state.kanaan ? state.kanaanAnalyser : state.analyser;
      target = an ? Math.min(1, Math.max(0, (rms(an) - 0.01) * 7)) : procedural(now);
    }
    // استجابة سريعة للفتح وأبطأ للإغلاق (أطبع للعين)
    state.level += (target - state.level) * (target > state.level ? 0.55 : 0.25);
    if (state.level < 0.002) state.level = 0;
  }

  return { state, update };
})();

Kanaan.Puppet = (function () {
  const A = 'assets/scene/';
  const HEAD = { x: 152, y: 226, w: 340, h: 306, pivot: [178, 334] };
  const MOUTH = { x: 328, y: 438, w: 86, h: 58, originY: 14 };
  const HAND = { x: 558, y: 494, w: 104, h: 110, pivot: [8, 98] };
  // الجفنان بإحداثيات طبقة الرأس (ألوان البشرة مأخوذة من الرسم فوق العين وتحتها)
  const EYES = [
    { cx: 155, cy: 196, rx: 32, ry: 26, top: '#F0915C', bottom: '#F88A5E' },
    { cx: 250, cy: 168, rx: 23, ry: 26, top: '#FA9E68', bottom: '#F9986E' }
  ];

  const instances = new Set();
  const NS = 'http://www.w3.org/2000/svg';

  function svg(tag, attrs) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  function lids() {
    const s = svg('svg', { class: 'kp-lids', width: HEAD.w, height: HEAD.h, viewBox: `0 0 ${HEAD.w} ${HEAD.h}`, 'aria-hidden': 'true' });
    const defs = svg('defs', {});
    s.append(defs);
    return {
      node: s,
      groups: EYES.map((e, i) => {
        const gid = `kpLid${i}${Math.random().toString(36).slice(2, 7)}`;
        const grad = svg('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 });
        grad.append(svg('stop', { offset: 0, 'stop-color': e.top }), svg('stop', { offset: 1, 'stop-color': e.bottom }));
        defs.append(grad);
        const g = svg('g', { class: 'kp-lid', style: `transform-origin:${e.cx}px ${e.cy - e.ry}px` });
        g.append(
          svg('ellipse', { cx: e.cx, cy: e.cy, rx: e.rx, ry: e.ry, fill: `url(#${gid})` }),
          // خط الرموش عند إغلاق العين
          svg('path', { d: `M${e.cx - e.rx + 2} ${e.cy + 2} Q${e.cx} ${e.cy + e.ry * 0.95} ${e.cx + e.rx - 2} ${e.cy + 2}`, fill: 'none', stroke: '#2A160C', 'stroke-width': 4, 'stroke-linecap': 'round' }));
        s.append(g);
        return g;
      })
    };
  }

  /** يركّب طبقات كنعان داخل حاوية بإحداثيات الرسم الأصلي */
  function mount(canvas, { hand = true, plate = true } = {}) {
    const el = Kanaan.UI.el;
    if (plate) {
      canvas.append(el('picture', null,
        el('source', { srcset: A + 'plate.webp', type: 'image/webp' }),
        el('img.kp-plate', { src: A + 'plate.jpg', alt: '', width: 1672, height: 941, draggable: 'false' })));
    }
    const handEl = hand ? el('img.kp-hand', {
      src: A + 'hand.webp', alt: '', draggable: 'false',
      style: `left:${HAND.x}px;top:${HAND.y}px;width:${HAND.w}px;height:${HAND.h}px;transform-origin:${HAND.pivot[0]}px ${HAND.pivot[1]}px`
    }) : null;
    const mouth = el('div.kp-mouth', {
      style: `left:${MOUTH.x - HEAD.x}px;top:${MOUTH.y - HEAD.y}px;width:${MOUTH.w}px;height:${MOUTH.h}px;transform-origin:50% ${MOUTH.originY}px`
    }, el('img', { src: A + 'mouth.webp', alt: '', draggable: 'false' }));
    const l = lids();
    const head = el('div.kp-head', {
      style: `left:${HEAD.x}px;top:${HEAD.y}px;width:${HEAD.w}px;height:${HEAD.h}px;transform-origin:${HEAD.pivot[0]}px ${HEAD.pivot[1]}px`
    }, el('img', { src: A + 'head.webp', alt: '', draggable: 'false' }), mouth, l.node);
    if (handEl) canvas.append(handEl);
    canvas.append(head);

    const inst = { head, mouth, hand: handEl, lids: l.groups, blinkAt: performance.now() + 1500 + Math.random() * 2000, blinkT: -1, gesture: 0, canvas };
    instances.add(inst);
    ensureTicker();
    return {
      destroy() { instances.delete(inst); },
      /** دخول هادئ عند فتح الصفحة */
      enter() { head.classList.add('kp-enter'); handEl && handEl.classList.add('kp-enter'); }
    };
  }

  /** صورة رمزية مقصوصة على الرأس (للمرشد في الشاشات الأخرى) */
  function avatar(size = 88) {
    const el = Kanaan.UI.el;
    const crop = { x: 160, y: 236, size: 310 };
    const canvas = el('div.kp-canvas', { style: `transform: translate(${-crop.x}px, ${-crop.y}px)` });
    // .kp-avatar بحجم القصّ الأصلي ثم يُصغَّر رقميًا إلى الحجم المطلوب
    const inner = el('div.kp-avatar-inner', { style: `transform: scale(${size / crop.size})` }, canvas);
    const wrap = el('div.kp-avatar', { style: `width:${size}px;height:${size}px` }, inner);
    wrap._puppet = mount(canvas, { hand: false });
    return wrap;
  }

  /* ---------- المؤقّت المشترك ---------- */
  let raf = 0;
  function ensureTicker() { if (!raf) raf = requestAnimationFrame(tick); }

  function tick(now) {
    raf = requestAnimationFrame(tick);
    Kanaan.Voice.update(now);
    const V = Kanaan.Voice.state;
    const calm = Kanaan.Motion.calm;
    const talk = V.kanaan;
    const open = talk ? V.level : 0;

    for (const p of instances) {
      if (!p.canvas.isConnected) continue;
      // الفم: ابتسامة مفتوحة (الرسم الأصلي) في الراحة، ويتحرك بين شبه مغلق ومفتوح أثناء الكلام
      const target = talk ? 0.26 + 0.74 * open : 1;
      p.mouthS = p.mouthS == null ? 1 : p.mouthS + (target - p.mouthS) * 0.5;
      p.mouth.style.transform = `scaleY(${p.mouthS.toFixed(3)})`;

      // الرأس: تمايل هادئ + إيماءة خفيفة مع الكلام
      let rot = 0, ty = 0;
      if (!calm) { rot = 0.45 * Math.sin(now / 1900); ty = 0.9 * Math.sin(now / 1450); }
      if (talk) { rot += (open - 0.4) * 0.9; ty += -open * 1.2; }
      p.head.style.transform = `translateY(${ty.toFixed(2)}px) rotate(${rot.toFixed(3)}deg)`;

      // اليد: إيماءة لطيفة أثناء الكلام فقط
      if (p.hand) {
        p.gesture += ((talk ? 1 : 0) - p.gesture) * 0.04;
        const g = p.gesture * (calm ? 1.2 : 2.8) * Math.sin(now / 520);
        p.hand.style.transform = `rotate(${(-g).toFixed(3)}deg)`;
      }

      // الرمش: كل ٢٫٥–٦ ث، وأحيانًا رمشة مزدوجة؛ يتوقف مع «أوقف الحركة»
      if (!Kanaan.Motion.paused) {
        if (p.blinkT < 0 && now >= p.blinkAt) p.blinkT = now;
        if (p.blinkT >= 0) {
          const t = (now - p.blinkT) / 170;
          const s = t >= 1 ? 0 : Math.sin(Math.PI * t);
          p.lids.forEach((g) => { g.style.transform = `scaleY(${s.toFixed(3)})`; });
          if (t >= 1) {
            p.blinkT = -1;
            p.blinkAt = now + (Math.random() < 0.18 ? 180 : 2500 + Math.random() * 3500);
          }
        }
      } else p.lids.forEach((g) => { g.style.transform = 'scaleY(0)'; });
    }
  }

  return { mount, avatar, HEAD };
})();
