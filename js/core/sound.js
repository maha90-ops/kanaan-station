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

  function speakTTS(text, { rate = 0.88, pitch = 1.25 } = {}) {
    return new Promise((resolve) => {
      if (!canSpeak()) return resolve(false);
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = arVoice ? arVoice.lang : 'ar-SA';
      if (arVoice) u.voice = arVoice;
      u.rate = rate; u.pitch = pitch; // نبرة أعلى قليلًا لتناسب صوت طفل
      // مهلة أمان: بعض المتصفحات لا تطلق onend
      const guard = setTimeout(() => resolve(true), 1500 + text.length * 120);
      u.onend = u.onerror = () => { clearTimeout(guard); resolve(true); };
      speechSynthesis.speak(u);
    });
  }

  function playFile(src) {
    return new Promise((resolve) => {
      const a = new Audio(src);
      current.push({ stop: () => { a.pause(); resolve(false); } });
      a.onended = () => resolve(true);
      a.onerror = () => resolve(false);
      a.play().catch(() => resolve(false));
    });
  }

  /** كلام كنعان أو نطق كلمة: الملف أولًا، ثم الصوت الآلي */
  async function say(text, { audio, rate, pitch } = {}) {
    if (audio) {
      const ok = await playFile(audio);
      if (ok) return 'file';
    }
    const ok = await speakTTS(text, { rate, pitch });
    return ok ? 'tts' : 'none';
  }

  /* ---------- توليد صوت احتكاكي (ششش / سسس) ----------
   * ضوضاء بيضاء ← مرشّحات تحدد «لون» الصوت ← غلاف هادئ ← محلل للعرض */
  function noiseBuffer(c, seconds) {
    const b = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  function phoneme(spec) {
    // ملف مسجّل إن وجد
    if (spec.audio) {
      return { analyser: null, done: playFile(spec.audio) };
    }
    const s = spec.synth || spec;
    const c = audioCtx();
    if (!c) return { analyser: null, done: Promise.resolve(false) };
    const dur = (s.durationMs || 1200) / 1000;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c, dur + 0.3);

    let node = src;
    const chain = (n) => { node.connect(n); node = n; };
    if (s.highpassHz) { const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = s.highpassHz; chain(hp); }
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = s.centerHz; bp.Q.value = s.q || 1; chain(bp);
    if (s.lowpassHz) { const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = s.lowpassHz; chain(lp); }

    const g = c.createGain();
    const t0 = c.currentTime;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.9, t0 + 0.12);
    g.gain.setValueAtTime(0.9, t0 + dur - 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    chain(g);

    const an = c.createAnalyser(); an.fftSize = 2048;
    g.connect(an); an.connect(c.destination);

    const done = new Promise((resolve) => { src.onended = () => resolve(true); });
    src.start(t0); src.stop(t0 + dur + 0.05);
    current.push({ stop: () => { try { src.stop(); } catch (e) { /* انتهى */ } } });
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
    say, phoneme, sfx, stop, canSpeak,
    get sfxOn() { return sfxOn; },
    setSfx(on) {
      sfxOn = on;
      try { localStorage.setItem('kanaan:sfx', on ? 'on' : 'off'); } catch (e) { /* تجاهل */ }
    }
  };
})();
