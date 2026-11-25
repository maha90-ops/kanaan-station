/**
 * تقييم نطق تقريبي (احتمالي) — وليس حكمًا قاطعًا.
 *
 * المنطق: صوت «ش» احتكاكي مهموس؛ أي: ضوضاء هوائية مستمرة دون اهتزاز
 * الأحبال الصوتية، وتتركز طاقته في نطاق أدنى من «س».
 * نقيس من التسجيل:
 *   ١. مدة الصوت الاحتكاكي (هل أُطيل الصوت؟)
 *   ٢. نسبة الإطارات التي يقع مركز طاقتها في نطاق الشين لا السين.
 * ونحوّلهما إلى «ثقة» بين ٠ و١ ثم إلى ثلاثة مستويات لطيفة.
 *
 * حدود معروفة: جودة الميكروفون، الضجيج، نطق الطفل لاسم الحرف «شين» بدل صوته.
 * لذلك: إعادة المحاولة متاحة دائمًا، والمتابعة لا تتوقف على النتيجة.
 */
Kanaan.Pronunciation = (function () {
  function percentile(arr, p) {
    if (!arr.length) return 0;
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.floor(p * s.length))];
  }

  function evaluate(recording, profile) {
    const { frames } = recording;
    const floor = percentile(frames.map((f) => f.rms), 0.15);
    const gate = Math.max(floor * 2.5, 0.006);
    const active = frames.filter((f) => f.rms > gate);
    const activeMs = active.reduce((s, f) => s + f.dt, 0);

    // إطار احتكاكي: الطاقة فوق ٢ك.هـ أكبر بوضوح من الطاقة المجهورة المنخفضة
    const fric = active.filter((f) => (f.target + f.competitor) > 2 * f.low);
    const fricMs = fric.reduce((s, f) => s + f.dt, 0);
    // إطار «شيني»: الطاقة في نطاق الشين تغلب نطاق السين
    const shLike = fric.filter((f) => f.target > f.competitor * 0.9);
    const share = fric.length ? shLike.length / fric.length : 0;
    const centroid = Math.round(percentile(fric.map((f) => f.centroid), 0.5));

    const durationScore = Math.min(1, fricMs / (profile.minFricativeMs * 1.6));
    const confidence = +(0.45 * durationScore + 0.55 * share).toFixed(2);

    let level, reason;
    if (activeMs < 150) { level = 'retry'; reason = 'silent'; }
    else if (fricMs < profile.shortFricativeMs) { level = 'retry'; reason = activeMs >= 300 ? 'voiced' : 'short'; }
    else if (fricMs >= profile.minFricativeMs && share >= 0.6) { level = 'excellent'; reason = 'ok'; }
    else if (share < 0.35) { level = 'close'; reason = 'competitor'; }
    else { level = 'close'; reason = fricMs < profile.minFricativeMs ? 'short' : 'competitor'; }

    return {
      mode: 'mic',
      level,
      reason,
      confidence,
      metrics: { activeMs: Math.round(activeMs), fricativeMs: Math.round(fricMs), targetShare: +share.toFixed(2), centroidHz: centroid }
    };
  }

  return { evaluate };
})();
