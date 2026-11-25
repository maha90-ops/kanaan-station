/**
 * التسجيل الصوتي + استخراج خصائص صوتية لحظية.
 *
 * التدفق:
 *  getUserMedia (بدون كبت الضوضاء — لأنه يحذف الأصوات الاحتكاكية مثل ش)
 *    ├─► MediaRecorder  → ملف يسمعه الطفل («استمع لصوتك»)
 *    └─► AnalyserNode   → كل ~٢٠ م.ث: شدة الصوت + توزيع الطاقة على الترددات
 *
 * كل التحليل محلي في المتصفح؛ لا يُرسل أي صوت إلى خادم.
 */
Kanaan.Recorder = (function () {
  const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  function bandPower(power, binHz, lo, hi) {
    let s = 0;
    const a = Math.max(1, Math.floor(lo / binHz));
    const b = Math.min(power.length - 1, Math.ceil(hi / binHz));
    for (let i = a; i <= b; i++) s += power[i];
    return s;
  }

  /**
   * يبدأ التسجيل ويعيد كائن تحكم.
   * onLevel(0..1) لرسم مؤشر بسيط.
   */
  async function start({ maxMs = 4000, onLevel, profile } = {}) {
    if (!supported) throw new Error('unsupported');
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
    });

    const c = Kanaan.Sound.unlock();
    const source = c.createMediaStreamSource(stream);
    const an = c.createAnalyser();
    an.fftSize = 2048;
    an.smoothingTimeConstant = 0.2;
    source.connect(an); // لا نوصله بالسماعات: لا صدى

    const binHz = c.sampleRate / an.fftSize;
    const time = new Float32Array(an.fftSize);
    const freq = new Float32Array(an.frequencyBinCount);
    const power = new Float32Array(an.frequencyBinCount);
    const frames = [];
    const [tLo, tHi] = profile.targetBandHz;
    const [cLo, cHi] = profile.competitorBandHz;

    // تسجيل ملف للاستماع الذاتي
    let recorder = null; const chunks = [];
    if (window.MediaRecorder) {
      try {
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
        recorder.start();
      } catch (e) { recorder = null; }
    }

    const t0 = performance.now();
    let last = t0;
    const timer = setInterval(() => {
      const now = performance.now();
      an.getFloatTimeDomainData(time);
      an.getFloatFrequencyData(freq);
      let sq = 0;
      for (let i = 0; i < time.length; i++) sq += time[i] * time[i];
      const rms = Math.sqrt(sq / time.length);
      for (let i = 0; i < freq.length; i++) power[i] = Math.pow(10, freq[i] / 10);

      let num = 0, den = 0;
      const ca = Math.floor(1000 / binHz), cb = Math.min(freq.length - 1, Math.floor(11000 / binHz));
      for (let i = ca; i <= cb; i++) { num += i * binHz * power[i]; den += power[i]; }

      frames.push({
        dt: now - last,
        rms,
        low: bandPower(power, binHz, 80, 1000),
        target: bandPower(power, binHz, tLo, tHi),
        competitor: bandPower(power, binHz, cLo, cHi),
        centroid: den ? num / den : 0
      });
      last = now;
      onLevel && onLevel(Math.min(1, rms * 8));
      if (now - t0 >= maxMs) ctrl.stop();
    }, 20);

    let stopped = null;
    const ctrl = {
      startedAt: t0,
      stop() {
        if (stopped) return stopped;
        clearInterval(timer);
        stopped = new Promise((resolve) => {
          const finish = () => {
            stream.getTracks().forEach((t) => t.stop());
            source.disconnect();
            const blob = chunks.length ? new Blob(chunks, { type: chunks[0].type }) : null;
            resolve({
              frames,
              durationMs: performance.now() - t0,
              playbackUrl: blob ? URL.createObjectURL(blob) : null
            });
          };
          if (recorder && recorder.state !== 'inactive') {
            recorder.onstop = finish;
            recorder.stop();
          } else finish();
        });
        return stopped;
      }
    };
    return ctrl;
  }

  return { supported, start };
})();
