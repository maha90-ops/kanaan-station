/**
 * الشاشة ٤ — الآن دورك (النطق)
 * لماذا يسجّل صوته؟ الإنتاج يثبّت التمثيل الصوتي، والاستماع إلى صوته ومقارنته
 * بالنموذج يبني «المراقبة الذاتية». التقييم الآلي تقريبي ولا يحجز الطفل أبدًا.
 */
Kanaan.UI.registerScreen({
  id: 'speak',
  stage: 'speak',
  render({ ep, next, alive }) {
    const { el, button, digits } = Kanaan.UI;
    const act = ep.pronunciationActivity;
    const fb = ep.feedback.pronunciation;
    let rec = null, playbackUrl = null, attempts = 0;

    const modelBtn = () => button('استمع للنموذج', {
      variant: 'secondary', icon: '🔊',
      onClick: () => Kanaan.Sound.phoneme(ep.sound)
    });

    const panel = el('div.mic-panel');
    const footnote = el('p.footnote', null, act.evaluator === 'clarity'
      ? 'ⓘ يتحقق الجهاز فقط من وصول صوتك بوضوح؛ قارن نطقك بالنموذج، وأذن المعلّم هي الحكم.'
      : 'ⓘ تقدير تقريبي يقدّره الجهاز من شكل الصوت؛ أذن المعلّم هي الحكم الأدق.');

    /* --- الحالة ١: جاهز للتسجيل --- */
    function ready() {
      panel.replaceChildren(
        el('button.mic-btn', { type: 'button', onclick: startRec },
          el('span.mic-icon', { 'aria-hidden': 'true' }, '🎙️'),
          el('span.mic-label', null, attempts ? 'سجّل مرة أخرى' : 'سجّل نطقك')),
        el('div.row.row--center', null, modelBtn()));
    }

    /* --- الحالة ٢: يسجّل --- */
    async function startRec() {
      Kanaan.Host.hide();
      Kanaan.Sound.stop();
      const bars = Array.from({ length: 7 }, () => el('span.level-bar'));
      const timeLeft = el('span.rec-time');
      const stopBtn = button('إيقاف', { variant: 'stop', icon: '⏹', onClick: () => finish() });
      panel.replaceChildren(
        el('div.rec-indicator', { role: 'status' },
          el('span.rec-dot', { 'aria-hidden': 'true' }), 'أسمعك الآن… ', timeLeft),
        el('div.level', { 'aria-hidden': 'true' }, bars),
        el('div.row.row--center', null, stopBtn));
      stopBtn.focus();

      try {
        rec = await Kanaan.Recorder.start({
          maxMs: act.maxRecordMs,
          profile: act.profile,
          onLevel(v) {
            bars.forEach((b, i) => {
              const k = 1 - Math.abs(i - 3) / 4;
              b.style.transform = `scaleY(${0.15 + Math.min(1, v * 1.6) * k})`;
            });
            if (!rec) return;
            const elapsed = performance.now() - rec.startedAt;
            timeLeft.textContent = `(${digits(Math.max(0, Math.ceil((act.maxRecordMs - elapsed) / 1000)))})`;
            if (elapsed >= act.maxRecordMs) finish();
          }
        });
      } catch (err) {
        noMic(err);
      }
    }

    /* --- الحالة ٣: النتيجة --- */
    let finishing = false;
    async function finish() {
      if (!rec || finishing) return;
      finishing = true;
      const recording = await rec.stop();
      rec = null; finishing = false;
      if (!alive()) return;
      attempts++;
      if (playbackUrl) URL.revokeObjectURL(playbackUrl);
      playbackUrl = recording.playbackUrl;

      const result = Kanaan.Pronunciation.evaluate(recording, act);
      Kanaan.Progress.pronunciation(ep.id, result);
      if (result.reason !== 'silent') Kanaan.Archive.save(`voice:${ep.id}`, recording.blob);
      showResult(result);
    }

    function showResult(result) {
      const look = {
        excellent: { icon: '🌟', text: fb.excellent },
        close: { icon: '👍', text: fb.close },
        retry: { icon: '🔁', text: fb.retry },
        clear: { icon: '👂', text: fb.clear }
      }[result.level];
      const tip = ['excellent', 'clear'].includes(result.level) ? null : act.tips[result.reason];
      const good = ['excellent', 'clear'].includes(result.level);

      const mine = playbackUrl ? button('استمع لصوتك', {
        variant: 'secondary', icon: '▶',
        onClick: () => { const a = new Audio(playbackUrl); a.play(); }
      }) : null;
      const retry = button('أعد المحاولة', { variant: 'secondary', icon: '🎙️', onClick: startRec });
      const cont = button('متابعة', { variant: good ? 'primary' : 'ghost', icon: '←', onClick: next });

      panel.replaceChildren(
        el('p.heard', null, '👂 ', fb.heard),
        el(`div.result.result--${result.level}`, { role: 'status' },
          el('span.result-icon', { 'aria-hidden': 'true' }, look.icon),
          el('div', null,
            el('p.result-text', null, look.text),
            tip ? el('p.result-tip', null, '💡 ', tip) : null)),
        el('div.row.row--center', null, mine, modelBtn(), retry),
        el('div.row.row--center', null, cont));
      Kanaan.UI.announce(`${fb.heard} ${look.text}`);
      Kanaan.Sound.sfx(good ? 'success' : 'gentle');
      Kanaan.Sound.say(`${fb.heard} ${look.text}`, { who: 'kanaan' });
    }

    /* --- بديل: لا ميكروفون — لا يعلق الطفل --- */
    function noMic(err) {
      rec = null;
      const denied = err && (err.name === 'NotAllowedError' || err.name === 'SecurityError');
      panel.replaceChildren(
        el('div.result.result--close', { role: 'status' },
          el('span.result-icon', { 'aria-hidden': 'true' }, '🎧'),
          el('div', null,
            el('p.result-text', null, denied ? 'لم نحصل على إذن الميكروفون.' : 'الميكروفون غير متاح في هذا الجهاز.'),
            el('p.result-tip', null, `انطق «${ep.sound.label}» بصوت عالٍ أمام معلّمك أو أحد أفراد أسرتك، ثم اضغط الزر.`))),
        el('div.row.row--center', null,
          modelBtn(),
          denied ? button('حاول مرة أخرى', { variant: 'secondary', icon: '🎙️', onClick: startRec }) : null,
          button('نطقتُ الصوت', {
            icon: '✔',
            onClick: () => { Kanaan.Progress.pronunciation(ep.id, { mode: 'self-report', level: null }); next(); }
          })));
    }

    ready();
    const node = el('section.screen.screen--speak', { 'aria-labelledby': 'speak-title' },
      el('h2.screen-title', { id: 'speak-title', tabindex: '-1' }, 'الآن دورك'),
      el('div.model-strip', null,
        el('span.model-letter', { 'aria-hidden': 'true' }, ep.letter),
        el('span.model-sound', null, `صوته: ${ep.sound.label}`)),
      panel, footnote);

    return {
      node,
      onEnter() { Kanaan.Host.say(ep.script.speak); },
      cleanup() {
        if (rec) rec.stop();
        if (playbackUrl) URL.revokeObjectURL(playbackUrl);
      }
    };
  }
});
