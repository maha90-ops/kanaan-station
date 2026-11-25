/**
 * الصوت: صوت كنعان (ملف مسجّل ← وإلا الصوت الآلي العربي)، توليد الأصوات الاحتكاكية،
 * والمؤثرات القصيرة الهادئة. صوت كنعان هو الأساس؛ المؤثرات قابلة للإيقاف.
 */
Kanaan.Sound = (function () {
  let ctx = null;
  let sfxOn = true;
  let current = []; // مصادر قيد التشغيل لإيقافها عند الانتقال
  let arVoice = null;
  let voicesReady = false;

  try { sfxOn = localStorage.getItem('kanaan:sfx') !== 'off'; } catch (e) { /* تخزين غير متاح */ }

  function audioCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* ---------- اختيار صوت عربي للصوت الآلي ---------- */
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return;
    voicesReady = true;
    const ar = voices.filter((v) => /^ar/i.test(v.lang));
    arVoice = ar.find((v) => /SA|JO|PS/i.test(v.lang)) || ar[0] || null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
  }

  /** هل يمكن نطق نص عربي؟ (قائمة فارغة = لا نعرف بعد، نحاول) */
  function canSpeak() {
    if (!('speechSynthesis' in window)) return false;
    return !voicesReady || !!arVoice;
  }

  /* ---------- أحداث الصوت ----------
   * كل كلام يُعلن بحدث 'kanaan:voice' {state:'start'|'end', who, analyser}
   * who: 'kanaan' (يحرّك فم كنعان) | 'radio' (يحرّك الراديو فقط)
   * analyser: متاح مع الملفات المسجّلة والأصوات المولّدة (موجة حقيقية)؛
   * الصوت الآلي لا يتيح بياناته، فتُقدَّر الحركة تقديرًا. */
  let speaking = 0;
  function emit(state, who, analyser) {
    speaking = Math.max(0, speaking + (state === 'start' ? 1 : -1));
    window.dispatchEvent(new CustomEvent('kanaan:voice', { detail: { state, who, analyser: analyser || null } }));
  }

  function speakTTS(text, { rate = 0.88, pitch = 1.25, who = 'radio', onWord } = {}) {
    return new Promise((resolve) => {
      if (!canSpeak()) return resolve(false);
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = arVoice ? arVoice.lang : 'ar-SA';
      if (arVoice) u.voice = arVoice;
      u.rate = rate; u.pitch = pitch; // نبرة أعلى قليلًا لتناسب صوت طفل
      let started = false, done = false;
      const finish = (result) => {
        if (done) return;
        done = true;
        clearTimeout(guard);
        if (started) emit('end', who);
        resolve(result);
      };
      // مهلة أمان: بعض المتصفحات لا تطلق onend
      const guard = setTimeout(() => finish(true), 1500 + text.length * 120);
      u.onstart = () => { started = true; emit('start', who); };
      u.onboundary = (e) => { if (onWord && e.name !== 'sentence') onWord(e.charIndex); };
      u.onend = () => finish(true);
      // المتصفح يمنع الكلام قبل أول تفاعل من المستخدم
      u.onerror = (e) => finish(e.error === 'not-allowed' ? 'blocked' : true);
      speechSynthesis.speak(u);
    });
  }

  /** تشغيل ملف صوتي عبر محلّل (لتزامن الشفاه والموجة مع الصوت الحقيقي) */
  function playFile(src, { who = 'radio' } = {}) {
    return new Promise((resolve) => {
      const a = new Audio(src);
      let analyser = null;
      const c = audioCtx();
      if (c) {
        try {
          const node = c.createMediaElementSource(a);
          analyser = c.createAnalyser(); analyser.fftSize = 1024;
          node.connect(analyser); analyser.connect(c.destination);
        } catch (e) { analyser = null; }
      }
      let started = false;
      const end = (r) => { if (started) { started = false; emit('end', who); } resolve(r); };
      current.push({ stop: () => { a.pause(); end(false); } });
      a.onplaying = () => { if (!started) { started = true; emit('start', who, analyser); } };
      a.onended = () => end(true);
      a.onerror = () => end(false);
      a.play().catch((e) => end(e && e.name === 'NotAllowedError' ? 'blocked' : false));
    });
  }

  /** كلام كنعان أو نطق كلمة: الملف أولًا، ثم الصوت الآلي.
   *  يعيد: 'file' | 'tts' | 'blocked' (يحتاج لمسة من المستخدم) | 'none' */
  async function say(text, { audio, rate, pitch, who, onWord } = {}) {
    if (audio) {
      const r = await playFile(audio, { who });
      if (r === true) return 'file';
      if (r === 'blocked') return 'blocked';
    }
    const r = await speakTTS(text, { rate, pitch, who, onWord });
    return r === 'blocked' ? 'blocked' : r ? 'tts' : 'none';
  }

  /* ---------- صوت الحرف ----------
   * الأولوية: تسجيل بشري (audio) ← توليد صوتي (synth) ← صوت آلي (tts، مثل «بَ»)
   * أنواع التوليد:
   *   fricative        ضوضاء مرشَّحة (ش، س)
   *   hum              طنين منخفض بشفتين مغلقتين (م)
   *   voicedFricative  ضوضاء عالية + طنين الحنجرة (ز) */
  function noiseBuffer(c, seconds) {
    const b = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  function canPlay(spec) {
    return !!(spec && (spec.audio || spec.synth || (spec.tts && canSpeak())));
  }

  function phoneme(spec) {
    if (spec.audio) return { analyser: null, done: playFile(spec.audio, { who: 'radio' }) };
    if (!spec.synth) {
      return { analyser: null, done: spec.tts ? speakTTS(spec.tts, { rate: 0.6, who: 'radio' }) : Promise.resolve(false) };
    }
    const s = spec.synth;
    const c = audioCtx();
    if (!c) return { analyser: null, done: Promise.resolve(false) };
    const dur = (s.durationMs || 1200) / 1000;
    const t0 = c.currentTime;
    const sources = [];

    // الغلاف: بداية ونهاية ناعمتان
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.9, t0 + 0.12);
    g.gain.setValueAtTime(0.9, t0 + dur - 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    // جزء الضوضاء (الهواء)
    if (s.kind === 'fricative' || s.kind === 'voicedFricative') {
      const src = c.createBufferSource();
      src.buffer = noiseBuffer(c, dur + 0.3);
      let node = src;
      const chain = (n) => { node.connect(n); node = n; };
      if (s.highpassHz) { const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = s.highpassHz; chain(hp); }
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = s.centerHz; bp.Q.value = s.q || 1; chain(bp);
      if (s.lowpassHz) { const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = s.lowpassHz; chain(lp); }
      if (s.kind === 'voicedFricative') { const ng = c.createGain(); ng.gain.value = 0.7; chain(ng); }
      node.connect(g);
      sources.push(src);
    }
    // جزء الطنين (اهتزاز الحنجرة)
    if (s.kind === 'hum' || s.kind === 'voicedFricative') {
      const osc = c.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = s.f0 || 140;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = s.lowpassHz || 500; lp.Q.value = 0.7;
      const vg = c.createGain(); vg.gain.value = s.kind === 'hum' ? 0.55 : 0.22;
      osc.connect(lp); lp.connect(vg); vg.connect(g);
      sources.push(osc);
    }

    const an = c.createAnalyser(); an.fftSize = 2048;
    g.connect(an); an.connect(c.destination);

    emit('start', 'radio', an);
    const done = new Promise((resolve) => { sources[0].onended = () => { emit('end', 'radio'); resolve(true); }; });
    sources.forEach((src) => { src.start(t0); src.stop(t0 + dur + 0.05); });
    current.push({ stop: () => sources.forEach((src) => { try { src.stop(); } catch (e) { /* انتهى */ } }) });
    return { analyser: an, done };
  }

  /* ---------- مؤثرات قصيرة وهادئة ---------- */
  function tone(c, freq, start, len, vol = 0.07, type = 'sine') {
    const o = c.createOscillator(); const g = c.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + len);
    o.connect(g); g.connect(c.destination);
    o.start(start); o.stop(start + len + 0.02);
  }

  const SFX = {
    // استقبال الرسالة: تشويش قصير يُضبط على المحطة
    tune(c, t) {
      const src = c.createBufferSource(); src.buffer = noiseBuffer(c, 0.5);
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 6;
      bp.frequency.setValueAtTime(600, t); bp.frequency.exponentialRampToValueAtTime(2200, t + 0.4);
      const g = c.createGain(); g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      src.connect(bp); bp.connect(g); g.connect(c.destination); src.start(t); src.stop(t + 0.5);
      tone(c, 880, t + 0.42, 0.25, 0.05);
    },
    reveal(c, t) { [523, 659, 784].forEach((f, i) => tone(c, f, t + i * 0.11, 0.35, 0.06)); },
    success(c, t) { tone(c, 659, t, 0.2, 0.06); tone(c, 988, t + 0.12, 0.35, 0.06); },
    gentle(c, t) { tone(c, 440, t, 0.25, 0.04, 'triangle'); },
    tap(c, t) { tone(c, 720, t, 0.08, 0.04, 'triangle'); },
    built(c, t) { [523, 659, 784, 1046].forEach((f) => tone(c, f, t, 0.6, 0.03)); },
    whoosh(c, t) {
      const src = c.createBufferSource(); src.buffer = noiseBuffer(c, 0.35);
      const lp = c.createBiquadFilter(); lp.type = 'lowpass';
      lp.frequency.setValueAtTime(300, t); lp.frequency.exponentialRampToValueAtTime(1800, t + 0.3);
      const g = c.createGain(); g.gain.setValueAtTime(0.025, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.33);
      src.connect(lp); lp.connect(g); g.connect(c.destination); src.start(t); src.stop(t + 0.35);
    }
  };

  function sfx(name) {
    if (!sfxOn) return;
    const c = audioCtx();
    if (!c || !SFX[name]) return;
    SFX[name](c, c.currentTime + 0.01);
  }

  function stop() {
    current.forEach((s) => s.stop());
    current = [];
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  return {
    unlock: audioCtx,
    ctx: () => ctx,
    say, phoneme, sfx, stop, canSpeak, canPlay,
    get speaking() { return speaking > 0; },
    playClip: playFile,
    get sfxOn() { return sfxOn; },
    setSfx(on) {
      sfxOn = on;
      try { localStorage.setItem('kanaan:sfx', on ? 'on' : 'off'); } catch (e) { /* تجاهل */ }
    }
  };
})();
