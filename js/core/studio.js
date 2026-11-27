/**
 * الاستوديو — الصفحة الرئيسية الحيّة.
 * الرسم المرجعي مقسّم إلى طبقات، وفوق كل عنصر مرسوم عنصر حقيقي في موضعه نفسه:
 *
 *   العنوان واللافتة ......... نص حقيقي (h1) فوق لوح الخشب
 *   فقاعة الكلام ............. نص حقيقي تُظلَّل كلماته أثناء الكلام (ربط المنطوق بالمكتوب)
 *   موجات الهوائي ............ SVG: تتنفس بهدوء، وتنشط مع الصوت
 *   شاشة الراديو ............. خط هادئ، وموجة صوتية حيّة أثناء الصوت
 *   الميكروفون ............... توهّج ينبض مع مستوى صوت كنعان
 *   الساعة ................... الساعة المطرّزة نفسها، بعقارب حقيقية تتبع الوقت
 *   ابدأ الاستماع ............ زر حقيقي؛ أشعة الانتباه تظهر بعد انتهاء الترحيب فقط
 *   أزرار المكتب الأربعة ..... إنجازاتي · تقدمي · دليل المعلم · عن المحطة
 *
 * الإحداثيات بوحدات الرسم الأصلي (1672×941). على الهاتف تُقصّ اللقطة على كنعان والراديو،
 * وتنتقل اللافتة والساعة والأزرار والنص إلى أعلى/أسفل المشهد بحجم مقروء.
 */
Kanaan.Studio = (function () {
  const { el } = Kanaan.UI;
  const NS = 'http://www.w3.org/2000/svg';
  const W = 1672, H = 941;
  const MOBILE_VIEW = { x: 135, y: 212, w: 840, h: 560 };
  const CLOCK = { x: 1290, y: 100, size: 280 }; // أصغر من الرسم الأصلي حتى لا تنافس كنعان

  const pos = (x, y, w, h) => `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;

  /* ---------- عقارب الساعة بأسلوب الرسم: سوداء مدبّبة مع ورقتي زيتون، ومركز مطرّز ---------- */
  function clockHands() {
    const hand = (cls, len, w) => `<g class="${cls}">
      <path d="M${-w} 10 L0 ${-len} L${w} 10 Z" fill="#1E1410"/>
      <ellipse cx="-9" cy="${-len * 0.55}" rx="9" ry="3.6" fill="#5E7A35" transform="rotate(-35 -9 ${-len * 0.55})"/>
      <ellipse cx="9" cy="${-len * 0.62}" rx="9" ry="3.6" fill="#6F8A44" transform="rotate(35 9 ${-len * 0.62})"/></g>`;
    let stitch = '';
    for (let i = 0; i < 16; i++) {
      stitch += `<rect x="-2.4" y="-2.4" width="4.8" height="4.8" fill="${i % 2 ? '#A4161A' : '#2F6B3A'}" transform="rotate(${i * 22.5}) translate(0 -27) rotate(45)"/>`;
    }
    return `<svg class="st-hands" viewBox="-195 -195 390 390" aria-hidden="true">
      <circle r="36" fill="#F7EEDC"/>${stitch}
      ${hand('clk-h', 104, 7)}${hand('clk-m', 140, 5.5)}
      <circle r="14" fill="url(#clkGold)"/>
      <defs><radialGradient id="clkGold" cx=".35" cy=".35"><stop offset="0" stop-color="#FFF0A8"/><stop offset=".6" stop-color="#E7B333"/><stop offset="1" stop-color="#A9740F"/></radialGradient></defs>
    </svg>`;
  }

  function antennaSVG() {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 140 130');
    s.setAttribute('aria-hidden', 'true');
    s.classList.add('st-waves');
    let arcs = '';
    [20, 34, 48].forEach((r, i) => {
      // قوس عمودي على كل جانب من رأس الهوائي
      const d = (side) => `M${70 + side * r * 0.62} ${62 - r * 0.78} Q${70 + side * r * 1.12} 62 ${70 + side * r * 0.62} ${62 + r * 0.78}`;
      arcs += `<path class="st-arc" style="--i:${i}" d="${d(-1)}"/><path class="st-arc" style="--i:${i}" d="${d(1)}"/>`;
    });
    s.innerHTML = `${arcs}<circle class="st-tip" cx="70" cy="62" r="10"/>`;
    return s;
  }

  const ICONS = {
    about: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="#4A2A12"/><circle cx="24" cy="14" r="3.6" fill="#FFE7A3"/><rect x="20.5" y="20" width="7" height="17" rx="3" fill="#FFE7A3"/></svg>',
    teacher: '<svg viewBox="0 0 48 48"><path d="M4 11c7-2 14-1 20 4v26c-6-5-13-6-20-4z" fill="#F2B233" stroke="#4A2A12" stroke-width="3" stroke-linejoin="round"/><path d="M44 11c-7-2-14-1-20 4v26c6-5 13-6 20-4z" fill="#F2B233" stroke="#4A2A12" stroke-width="3" stroke-linejoin="round"/><path d="M9 18c4-1 8 0 11 2M9 24c4-1 8 0 11 2M39 18c-4-1-8 0-11 2M39 24c-4-1-8 0-11 2" stroke="#4A2A12" stroke-width="2" fill="none"/></svg>',
    progress: '<svg viewBox="0 0 48 48"><rect x="6" y="28" width="9" height="14" rx="2" fill="#4A2A12"/><rect x="19.5" y="19" width="9" height="23" rx="2" fill="#4A2A12"/><rect x="33" y="8" width="9" height="34" rx="2" fill="#4A2A12"/></svg>',
    achievements: '<svg viewBox="0 0 48 48"><path d="M14 6h20v12a10 10 0 0 1-20 0z" fill="#F2B233" stroke="#4A2A12" stroke-width="3"/><path d="M14 10H6c0 8 4 12 9 12M34 10h8c0 8-4 12-9 12" fill="none" stroke="#4A2A12" stroke-width="3"/><path d="M24 28v7M16 42h16l-2-7H18z" fill="#4A2A12" stroke="#4A2A12" stroke-width="3" stroke-linejoin="round"/><path d="M24 10l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill="#4A2A12"/></svg>'
  };

  function create({ ep, onStart }) {
    const text = ep.script.welcome;
    const canvas = el('div.kp-canvas.st-canvas');
    const puppet = Kanaan.Puppet.mount(canvas);

    // كلمات الفقاعة مع مواقعها في النص (لتظليل الكلمة المنطوقة)
    const words = [];
    let idx = 0;
    const bubbleText = el('p.st-bubble-text', { id: 'st-greeting' });
    text.split(/(\s+)/).forEach((tok) => {
      if (/^\s+$/.test(tok)) {
        // سطر جديد بعد كل جملة (كما في الرسم المرجعي)
        const prev = words[words.length - 1];
        bubbleText.append(prev && /[!.…؟]$/.test(prev.s.textContent) ? el('br') : tok);
        idx += tok.length;
        return;
      }
      const s = el('span.st-w', null, tok);
      words.push({ s, from: idx, to: idx + tok.length });
      bubbleText.append(s);
      idx += tok.length;
    });

    const title = el('h1.st-title', { id: 'welcome-title', tabindex: '-1' }, el('span', null, 'محطة كنعان'), el('span', null, 'للحروف'));
    const ribbon = el('p.st-ribbon', null, 'اسمع … اكتشف … انطق … ابنِ الكلمة');
    const sign = el('div.st-sign', null, title, ribbon);

    const radioScreen = el('canvas.st-radio-screen', { width: 384, height: 146, 'aria-hidden': 'true', style: pos(700, 563, 192, 73) });
    const wave = Kanaan.UI.waveView(radioScreen);
    const waves = antennaSVG();
    waves.setAttribute('style', pos(780, 388, 140, 130));
    const micGlow = el('div.st-mic-glow', { 'aria-hidden': 'true', style: pos(437, 515, 150, 150) });

    /* ---------- الساعة ---------- */
    const tip = el('span.st-clock-tip', { role: 'status' });
    const clock = el('button.st-clock', { type: 'button', 'aria-label': 'ساعة المحطة' },
      el('img', { src: 'assets/scene/clock.webp', alt: '', draggable: 'false' }));
    clock.insertAdjacentHTML('beforeend', clockHands());
    // «● على الهواء الآن»: جزء من الساعة، يفتح الرسالة نفسها عند الضغط
    const onAir = el('button.st-onair', { type: 'button', 'aria-describedby': 'st-clock-tip' },
      el('span.st-onair-dot', { 'aria-hidden': 'true' }), 'على الهواء الآن');
    tip.id = 'st-clock-tip';
    const clockWrap = el('div.st-clock-wrap', null, clock, onAir, tip);
    let tipTimer = 0;
    const showTip = (sticky) => {
      tip.textContent = 'أنت الآن على الهواء مع كنعان';
      clockWrap.classList.add('show-tip');
      clearTimeout(tipTimer);
      if (sticky) tipTimer = setTimeout(() => clockWrap.classList.remove('show-tip'), 3200);
    };
    const hideTip = () => clockWrap.classList.remove('show-tip');
    clock.addEventListener('mouseenter', () => showTip(false));
    clock.addEventListener('mouseleave', hideTip);
    clock.addEventListener('focus', () => showTip(false));
    clock.addEventListener('blur', hideTip);
    clock.addEventListener('click', () => { Kanaan.Sound.sfx('tap'); showTip(true); });
    onAir.addEventListener('click', () => { Kanaan.Sound.sfx('tap'); showTip(true); });

    function tickClock() {
      const d = new Date();
      const s = d.getSeconds(), m = d.getMinutes() + s / 60, h = (d.getHours() % 12) + m / 60;
      const set = (c, deg) => clock.querySelector(c).setAttribute('transform', `rotate(${deg.toFixed(2)})`);
      set('.clk-h', h * 30); set('.clk-m', m * 6); // دون عقرب ثوانٍ: حركة مستمرة لا تخدم التعلّم
      clock.setAttribute('aria-label', `ساعة المحطة، الوقت الآن ${d.toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' })}`);
    }
    tickClock();
    const clockTimer = setInterval(tickClock, 15000);

    /* ---------- زر البدء + أشعة الانتباه (بعد الترحيب فقط) ---------- */
    let starting = false;
    async function begin() {
      if (starting) return;
      starting = true;
      dropWaiter();
      Kanaan.Sound.unlock();
      Kanaan.Sound.stop();
      // فكّ ترميز كل التسجيلات الآن (أول لمسة) لتبدأ فورًا في كل الشاشات
      const M = Kanaan.AudioManifest || { files: [] };
      Kanaan.Sound.preload(M.files.map((f) => M.base + f));
      startWrap.classList.add('is-pressed');
      // كنعان يبدأ الكلام هنا في الاستوديو: تتحرك شفتاه وموجات الراديو، ثم ينطلق المسار
      await Promise.race([
        Kanaan.Sound.say(ep.script.go, { who: 'kanaan', cue: Kanaan.AudioLib.lineCue(ep, 'script.go') }),
        Kanaan.UI.wait(2600)
      ]);
      onStart();
    }
    const start = el('button.st-start', { type: 'button', onclick: begin },
      el('span.st-start-play', { 'aria-hidden': 'true' }), el('span.st-start-label', null, 'ابدأ الاستماع'));
    const rays = el('div.st-rays', { 'aria-hidden': 'true', html:
      '<svg viewBox="0 0 150 75"><g stroke="#FFC94A" stroke-width="9" stroke-linecap="round"><line x1="75" y1="8" x2="75" y2="34"/><line x1="40" y1="16" x2="51" y2="40"/><line x1="110" y1="16" x2="99" y2="40"/><line x1="8" y1="44" x2="28" y2="54"/><line x1="142" y1="44" x2="122" y2="54"/></g></svg>' });
    const startWrap = el('div.st-start-wrap', null, rays, start);

    /* ---------- أزرار المكتب ---------- */
    // أزرار ثانوية هادئة وأصغر: لا تنافس «ابدأ الاستماع»
    const navDefs = [ // ترتيب DOM من اليمين إلى اليسار
      ['about', 'عن المحطة', 1096, 210], ['teacher', 'دليل المعلم', 864, 210],
      ['progress', 'تقدمي', 632, 210], ['achievements', 'إنجازاتي', 400, 210]
    ];
    const navBtns = navDefs.map(([id, label, x, w]) => el('button.st-nav', {
      type: 'button', 'data-x': x, 'data-w': w,
      onclick: () => { Kanaan.Sound.sfx('tap'); Kanaan.Panels[id](); }
    }, el('span.st-nav-icon', { 'aria-hidden': 'true', html: ICONS[id] }), el('span.st-nav-label', null, label)));
    const nav = el('nav.st-navbar', { 'aria-label': 'أقسام المحطة' }, navBtns);

    /* ---------- التحكم: تشغيل/إيقاف صوت كنعان، إيقاف الحركة ---------- */
    const voiceBtn = el('button.st-ctl.st-voice', { type: 'button', 'aria-controls': 'st-greeting' });
    const motionBtn = el('button.st-ctl', { type: 'button' });
    const paintMotion = () => {
      const off = Kanaan.Motion.paused;
      motionBtn.replaceChildren(el('span', { 'aria-hidden': 'true' }, off ? '▶' : '⏸'), off ? 'شغّل الحركة' : 'أوقف الحركة');
      motionBtn.setAttribute('aria-pressed', String(off));
    };
    motionBtn.addEventListener('click', () => { Kanaan.Motion.setPaused(!Kanaan.Motion.paused); paintMotion(); });
    paintMotion();

    let talking = false, needsTap = false;
    const paintVoice = () => {
      voiceBtn.replaceChildren(el('span', { 'aria-hidden': 'true' }, talking ? '⏹' : '🔊'), talking ? 'أوقف الصوت' : 'اسمع كنعان');
      voiceBtn.classList.toggle('attention-pulse', needsTap && !talking);
    };

    function highlight(charIndex) {
      words.forEach((w) => {
        w.s.classList.toggle('is-now', charIndex >= w.from && charIndex < w.to + 1);
        if (charIndex >= w.to) w.s.classList.add('is-said');
      });
    }
    const clearHighlight = () => words.forEach((w) => w.s.classList.remove('is-now', 'is-said'));

    // مستمع «أول لمسة تشغّل الترحيب» — يُزال عند البدء أو مغادرة الاستوديو
    let waiter = null;
    function dropWaiter() {
      if (!waiter) return;
      document.removeEventListener('pointerdown', waiter, true);
      document.removeEventListener('keydown', waiter, true);
      waiter = null;
    }

    async function greet() {
      if (talking || !root.isConnected) return;
      needsTap = false;
      talking = true; paintVoice();
      clearHighlight();
      // تظليل تقديري إن لم يرسل المتصفح مواضع الكلمات
      let gotBoundary = false, est = null, t0 = 0;
      const onVoice = ({ detail }) => {
        if (detail.state !== 'start' || detail.who !== 'kanaan') return;
        t0 = performance.now();
        setTimeout(() => {
          if (gotBoundary || !talking) return;
          est = setInterval(() => highlight(Math.floor((performance.now() - t0) / 78)), 120);
        }, 700);
      };
      window.addEventListener('kanaan:voice', onVoice);
      const r = await Kanaan.Sound.say(text, {
        who: 'kanaan',
        cue: 'common/script.welcome', // assets/audio/common/script.welcome.mp3 إن وُجد
        onWord: (ci) => { gotBoundary = true; highlight(ci); }
      });
      window.removeEventListener('kanaan:voice', onVoice);
      clearInterval(est);
      talking = false;
      if (r === 'blocked') {
        // المتصفح يمنع الصوت قبل أول لمسة: أول لمسة على المشهد تشغّل الترحيب
        needsTap = true;
        dropWaiter();
        waiter = (e) => {
          if (e.target.closest && e.target.closest('button, a, dialog')) return;
          dropWaiter();
          if (!root.isConnected) return;   // غادرنا الاستوديو: لا ترحيب في مكان آخر
          Kanaan.Sound.unlock();
          greet();
        };
        document.addEventListener('pointerdown', waiter, true);
        document.addEventListener('keydown', waiter, true);
      } else {
        words.forEach((w) => { w.s.classList.remove('is-now'); w.s.classList.add('is-said'); });
        startWrap.classList.add('call-attention'); // الآن فقط نوجّه الانتباه إلى الزر
      }
      paintVoice();
    }
    voiceBtn.addEventListener('click', () => {
      if (talking) { Kanaan.Sound.stop(); return; }
      Kanaan.Sound.unlock();
      greet();
    });
    paintVoice();

    /* ---------- استجابة المشهد للصوت ---------- */
    let raf = 0, live = null;
    function frame() {
      raf = requestAnimationFrame(frame);
      const V = Kanaan.Voice.state;
      waves.style.setProperty('--lv', V.level.toFixed(3));
      micGlow.style.opacity = V.kanaan ? (0.25 + V.level * 0.75).toFixed(3) : '0';
      if (V.any !== live) {
        live = V.any;
        waves.classList.toggle('is-live', live);
        radioScreen.classList.toggle('is-live', live);
        if (live) (V.analyser ? wave.live(V.analyser) : wave.speech()); else wave.idle();
      }
    }
    raf = requestAnimationFrame(frame);

    /* ---------- التخطيط ---------- */
    const bubbleBtn = el('button.st-bubble-btn', { type: 'button', 'aria-label': 'اسمع كنعان', onclick: () => voiceBtn.click() }, '🔊');
    const bubble = el('div.st-bubble', { style: pos(462, 280, 326, 196) }, bubbleText, bubbleBtn);
    canvas.append(radioScreen, waves, micGlow, bubble);
    const frameEl = el('div.st-frame', null, canvas);
    const top = el('div.st-top');
    const bottom = el('div.st-bottom');
    const controls = el('div.st-controls', null, voiceBtn, motionBtn);
    const root = el('div.studio', { role: 'region', 'aria-label': 'استوديو محطة كنعان' }, top, frameEl, bottom);

    let mobile = null;
    function layout() {
      const m = window.innerWidth < 760;
      const avail = root.clientWidth || window.innerWidth;
      if (m !== mobile) {
        mobile = m;
        root.classList.toggle('is-mobile', m);
        if (m) {
          top.append(sign, clockWrap);
          bottom.append(bubbleText, startWrap, nav, controls);
          navBtns.forEach((b) => b.removeAttribute('style'));
        } else {
          canvas.append(sign, clockWrap, startWrap, nav);
          bubble.prepend(bubbleText);
          navBtns.forEach((b) => b.setAttribute('style', pos(+b.dataset.x, 806, +b.dataset.w, 76)));
          top.replaceChildren();
          bottom.replaceChildren(controls);
        }
      }
      if (m) {
        const v = MOBILE_VIEW, k = avail / v.w;
        canvas.style.transform = `scale(${k}) translate(${-v.x}px, ${-v.y}px)`;
        frameEl.style.width = `${avail}px`;
        frameEl.style.height = `${v.h * k}px`;
      } else {
        const k = Math.min(avail / W, (window.innerHeight - 76) / H);
        canvas.style.transform = `scale(${k})`;
        frameEl.style.width = `${W * k}px`;
        frameEl.style.height = `${H * k}px`;
      }
    }
    window.addEventListener('resize', layout);

    return {
      node: root,
      title,
      mounted() { layout(); puppet.enter(); },
      greet,
      destroy() {
        dropWaiter();
        cancelAnimationFrame(raf);
        clearInterval(clockTimer);
        clearTimeout(tipTimer);
        window.removeEventListener('resize', layout);
        wave.destroy();
        puppet.destroy();
      }
    };
  }

  return { create, CLOCK };
})();
