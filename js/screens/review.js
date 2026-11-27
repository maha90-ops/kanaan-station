/**
 * رسالة من الأرشيف — مراجعة متباعدة قصيرة لحرف أقدم قبل الحرف الجديد.
 * لماذا؟ الاسترجاع بعد فاصل زمني يثبّت التعلّم أكثر من التكرار المتصل،
 * ووضع الحرف القديم بين خيارات مشابهة يحافظ على التمييز.
 * منخفضة المخاطر: الخطأ يكشف الإجابة ويتابع الطفل دون أن يعلق.
 */
Kanaan.UI.registerScreen({
  id: 'review',
  stage: null,
  render({ ep, next, alive, reviewEp: old }) {
    const { el, button, feedback, wait } = Kanaan.UI;
    const fbSlot = el('div.feedback-slot');
    const after = el('div.row.row--center');
    let busy = false, solved = false;

    // الخيارات: الحرف القديم + أقرب صوت له + حرف آخر مكتشف (أو من خياراته)
    const learned = Kanaan.Episodes.list().filter((e) => Kanaan.Progress.isDone(e.id) && e.id !== old.id).map((e) => e.letter);
    const pool = [old.phonemeActivity.contrast?.letter, ...learned, ...old.phonemeActivity.options]
      .filter((l) => l && l !== old.letter);
    const opts = [old.letter, ...[...new Set(pool)].slice(0, 2)];
    const shift = old.order % opts.length; // ترتيب ثابت لكن ليس الصحيح أولًا دائمًا
    const options = opts.map((_, i) => opts[(i + shift) % opts.length]);

    const radio = Kanaan.UI.radio({ compact: true });
    const wave = Kanaan.UI.waveView(radio.canvas);

    async function play() {
      if (busy) return;
      busy = true;
      radio.node.classList.add('is-on');
      const { analyser, done } = Kanaan.Sound.phoneme(old.sound);
      analyser ? wave.live(analyser) : wave.speech();
      await done;
      wave.idle();
      radio.node.classList.remove('is-on');
      busy = false;
    }

    const buttons = options.map((L) => el('button.choice.choice--letter', {
      type: 'button', 'aria-label': `الحرف ${L}`, onclick: (e) => choose(L, e.currentTarget)
    }, el('span.choice-glyph', null, L), el('span.choice-mark', { 'aria-hidden': 'true' })));

    async function choose(L, b) {
      if (solved) return;
      solved = true;
      Kanaan.Sound.stop(); // الطفل أجاب قبل انتهاء الصوت: نحترم إجابته
      busy = false;
      const ok = L === old.letter;
      Kanaan.Progress.attempt(ep.id, 'review', ok, { letter: old.letter });
      Kanaan.Progress.reviewed(old.id);
      buttons.forEach((x) => x.setAttribute('disabled', ''));
      const right = buttons[options.indexOf(old.letter)];
      right.classList.add('is-correct');
      right.querySelector('.choice-mark').textContent = '✔';
      if (ok) {
        Kanaan.Sound.sfx('success');
        fbSlot.replaceChildren(feedback('success', old.script.reviewCorrect));
        await Kanaan.Sound.say(old.script.reviewCorrect, { who: 'kanaan', cue: Kanaan.AudioLib.lineCue(old, 'script.reviewCorrect') });
        await wait(400);
        if (alive()) next();
      } else {
        b.classList.add('is-tried');
        Kanaan.Sound.sfx('gentle');
        const msg = old.script.reviewRetry;
        fbSlot.replaceChildren(feedback('retry', msg));
        await Kanaan.Sound.say(msg, { who: 'kanaan', cue: Kanaan.AudioLib.lineCue(old, 'script.reviewRetry') });
        if (!alive()) return;
        await play();
        after.replaceChildren(button('متابعة', { icon: '←', onClick: next }));
      }
    }

    const node = el('section.screen.screen--review', { 'aria-labelledby': 'review-title' },
      el('h2.screen-title', { id: 'review-title', tabindex: '-1' }, '🗄️ رسالة من الأرشيف'),
      radio.node,
      el('div.row.row--center', null, button('أعد الاستماع', { variant: 'secondary', icon: '🔁', onClick: play })),
      el('p.question-text', null, 'أيّ حرف هذا؟'),
      el('div.choices', { role: 'group', 'aria-label': 'أيّ حرف هذا؟' }, buttons),
      fbSlot, after);

    return {
      node,
      async onEnter() {
        await Kanaan.Host.say(ep.script.reviewAsk, { cue: Kanaan.AudioLib.lineCue(ep, 'script.reviewAsk'), keep: false });
        if (alive()) play();
      },
      cleanup() { wave.destroy(); }
    };
  }
});
