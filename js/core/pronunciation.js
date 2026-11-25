/**
 * تقييم نطق تقريبي (احتمالي) — وليس حكمًا قاطعًا.
 *
 * لكل فئة صوتية مقيِّم خاص، تختاره الحلقة عبر pronunciationActivity.evaluator:
 *
 *  fricative        (ش) هواء مهموس مستمر؛ نقيس مدته ونطاق طاقته (ش أدنى من س).
 *  voicedFricative  (ز) هواء عالي التردد + اهتزاز الحنجرة معًا؛ غياب الاهتزاز = «س».
 *  nasal            (م) طنين منخفض بشفتين مغلقتين؛ طاقة شبه معدومة فوق ١ ك.هـ.
 *  clarity          (ب، ت، ع) أصوات انفجارية/حلقية لا يمكن تمييزها آليًا بثقة من
 *                   شكل الصوت؛ نتحقق فقط أن الطفل أصدر صوتًا واضحًا، ونحيله إلى
 *                   المقارنة الذاتية مع النموذج. لا ندّعي حكمًا على صحة المخرج.
 *
 * المستويات: excellent | close | retry | clear (للوضوح فقط).
 * حدود معروفة: جودة الميكروفون، الضجيج، نطق اسم الحرف بدل صوته.
 * لذلك: إعادة المحاولة متاحة دائمًا، والمتابعة لا تتوقف على النتيجة.
 */
Kanaan.Pronunciation = (function () {
  function percentile(arr, p) {
    if (!arr.length) return 0;
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.floor(p * s.length))];
  }
  const ms = (frames) => frames.reduce((s, f) => s + f.dt, 0);

  /** الإطارات النشطة: فوق عتبة متكيّفة مع ضجيج الغرفة */
  function activeFrames(frames) {
    const floor = percentile(frames.map((f) => f.rms), 0.15);
    const gate = Math.max(floor * 2.5, 0.006);
    return frames.filter((f) => f.rms > gate);
  }

  const EVALUATORS = {
    fricative(active, p) {
      const fric = active.filter((f) => (f.target + f.competitor) > 2 * f.low);
      const fricMs = ms(fric);
      const share = fric.length ? fric.filter((f) => f.target > f.competitor * 0.9).length / fric.length : 0;
      const confidence = 0.45 * Math.min(1, fricMs / (p.minFricativeMs * 1.6)) + 0.55 * share;
      const metrics = { fricativeMs: Math.round(fricMs), targetShare: +share.toFixed(2), centroidHz: Math.round(percentile(fric.map((f) => f.centroid), 0.5)) };
      if (fricMs < p.shortFricativeMs) return { level: 'retry', reason: ms(active) >= 300 ? 'voiced' : 'short', confidence, metrics };
      if (fricMs >= p.minFricativeMs && share >= 0.6) return { level: 'excellent', reason: 'ok', confidence, metrics };
      return { level: 'close', reason: share < 0.35 || fricMs >= p.minFricativeMs ? 'competitor' : 'short', confidence, metrics };
    },

    voicedFricative(active, p) {
      // مجهور + هواء: طاقة منخفضة واضحة، وطاقة عالية لا تُهمل
      const zLike = active.filter((f) => f.low > 0.15 * (f.low + f.target + f.competitor) && f.target > 0.012 * f.low);
      const sLike = active.filter((f) => f.target > 2 * f.low);         // هواء بلا اهتزاز
      const voiceOnly = active.filter((f) => f.target <= 0.012 * f.low); // اهتزاز بلا هواء
      const zMs = ms(zLike), sMs = ms(sLike), vMs = ms(voiceOnly);
      const confidence = Math.min(1, zMs / (p.minFricativeMs * 1.6));
      const metrics = { voicedFricativeMs: Math.round(zMs), voicelessMs: Math.round(sMs), voiceOnlyMs: Math.round(vMs) };
      if (zMs >= p.minFricativeMs && zMs >= sMs) return { level: 'excellent', reason: 'ok', confidence, metrics };
      if (sMs >= p.shortFricativeMs && sMs > zMs) return { level: 'close', reason: 'voiceless', confidence, metrics };
      if (zMs >= p.shortFricativeMs) return { level: 'close', reason: 'short', confidence, metrics };
      return { level: 'retry', reason: vMs >= 300 ? 'noHiss' : 'short', confidence, metrics };
    },

    nasal(active, p) {
      // طنين: الطاقة تحت ١ ك.هـ تفوق ما فوقها بكثير (الفم مغلق)
      const hum = active.filter((f) => f.low > 15 * (f.target + f.competitor));
      const humMs = ms(hum), actMs = ms(active);
      const confidence = Math.min(1, humMs / (p.minHumMs * 1.6));
      const metrics = { humMs: Math.round(humMs), activeMs: Math.round(actMs) };
      if (humMs >= p.minHumMs) return { level: 'excellent', reason: 'ok', confidence, metrics };
      if (humMs >= p.shortHumMs) return { level: 'close', reason: 'short', confidence, metrics };
      return { level: actMs >= 300 ? 'close' : 'retry', reason: actMs >= 300 ? 'open' : 'short', confidence, metrics };
    },

    clarity(active) {
      return { level: 'clear', reason: 'ok', confidence: null, metrics: {} };
    }
  };

  function evaluate(recording, activity) {
    const active = activeFrames(recording.frames);
    const activeMs = ms(active);
    const p = activity.profile || {};
    let r;
    if (activeMs < 150) r = { level: 'retry', reason: 'silent', confidence: 0, metrics: {} };
    else r = (EVALUATORS[activity.evaluator] || EVALUATORS.clarity)(active, p);
    r.metrics = { activeMs: Math.round(activeMs), ...r.metrics };
    if (r.confidence != null) r.confidence = +r.confidence.toFixed(2);
    return { mode: 'mic', evaluator: activity.evaluator, ...r };
  }

  return { evaluate, evaluators: Object.keys(EVALUATORS) };
})();
