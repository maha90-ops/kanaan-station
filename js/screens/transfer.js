/**
 * ٧ أوظّف (٢) — مهمة انتقالية (نقل التعلم)
 * لماذا؟ معرفة «ش = شمس» قد تكون حفظًا. هنا كلمات جديدة لم تُدرَّس، تُسمع أولًا
 * دون كتابة، وعلى الطفل أن يميّز الصوت في أول الكلمة — بينها «سَمَك» لاختبار
 * التمييز بين ش وس في سياق جديد. الكلمات تُكشف بعد الإجابة لربط ما سُمع بما يُكتب.
 */
Kanaan.UI.registerScreen({
  id: 'transfer',
  stage: 'apply',
  render({ ep, next, alive }) {
    const { el, button, feedback, wait, digits } = Kanaan.UI;
    const act = ep.transferActivity;
    const fbSlot = el('div.feedback-slot');
    const canHear = Kanaan.Sound.canSpeak() || act.channels.every((c) => Kanaan.AudioLib.has(c.cue));
    let tuned = null, solved = false;

    const radio = Kanaan.UI.radio({ compact: true });
    const wave = Kanaan.UI.waveView(radio.canvas);

    const hl = (w) => Kanaan.UI.highlightLetter(w, ep.wordLetter, { firstOnly: true });

    const channels = act.channels.map((c, i) => {
      const label = el('span.channel-word', null, canHear ? '؟' : c.word);
      const b = el('button.channel', {
        type: 'button', 'aria-pressed': 'false',
        'aria-label': `القناة ${digits(i + 1)}${canHear ? '' : `: ${c.word}`}`,
        onclick: () => tune(i)
      },
      el('span.channel-num', null, `قناة ${digits(i + 1)}`),
      label,
      el('span.channel-heard', { 'aria-hidden': 'true' }));
      return { b, label, data: c, heard: false };
    });

    async function tune(i) {
      if (solved) return;
      tuned = i;
      channels.forEach((ch, j) => {
        ch.b.classList.toggle('is-tuned', j === i);
        ch.b.setAttribute('aria-pressed', String(j === i));
      });
      confirm.removeAttribute('disabled');
      const ch = channels[i];
      Kanaan.Sound.sfx('tap');
      radio.node.classList.add('is-on');
      wave.speech();
      await Kanaan.Sound.say(ch.data.word, { cue: ch.data.cue, rate: 0.7 });
      wave.idle();
      radio.node.classList.remove('is-on');
      ch.heard = true;
      ch.b.querySelector('.channel-heard').textContent = '👂';
      Kanaan.Progress.patch(ep.id, 'transfer', { channelsHeard: channels.filter((c) => c.heard).length });
    }

    const confirm = button('هذه هي!', { icon: '✔', onClick: () => choose() });
    confirm.setAttribute('disabled', '');

    async function choose() {
      if (solved || tuned == null) return;
      const ch = channels[tuned];
      const ok = ch.data.startsWithTarget;
      Kanaan.Progress.attempt(ep.id, 'transfer', ok);
      if (ok) {
        solved = true;
        confirm.setAttribute('disabled', '');
        Kanaan.Sound.sfx('success');
        ch.b.classList.add('is-correct');
        // كشف تدريجي لكل الكلمات مع تمييز صوتها الأول
        for (const c of channels) {
          c.label.replaceChildren(c.data.startsWithTarget ? hl(c.data.word) : c.data.word);
          c.b.classList.add('is-revealed');
          await wait(350);
        }
        fbSlot.replaceChildren(feedback('success', ep.feedback.transfer.correct));
        Kanaan.Puppet.express('happy');
        await Kanaan.Sound.say(ep.feedback.transfer.correct, { who: 'kanaan', cue: Kanaan.AudioLib.lineCue(ep, 'feedback.transfer.correct') });
        await wait(700);
        if (alive()) next();
      } else {
        // تغذية راجعة مُعلِّمة: نكشف الكلمة وصوتها الأول بدل «خطأ»
        ch.label.replaceChildren(ch.data.word);
        ch.b.classList.add('is-revealed', 'is-tried');
        const msg = `«${ch.data.word}» تبدأ بصوت ${ch.data.startSound}. ${ep.feedback.transfer.retry}`;
        Kanaan.Sound.sfx('gentle');
        fbSlot.replaceChildren(feedback('retry', msg));
        // بصوت مسجّل: الكلمة نفسها ثم جملة الإعادة المشتركة (النص الكامل على الشاشة)
        if (Kanaan.AudioLib.url(Kanaan.AudioLib.lineCue(ep, 'feedback.transfer.retry'))) {
          await Kanaan.Sound.say(ch.data.word, { cue: ch.data.cue, rate: 0.7 });
          if (alive()) Kanaan.Sound.say(ep.feedback.transfer.retry, { who: 'kanaan', cue: Kanaan.AudioLib.lineCue(ep, 'feedback.transfer.retry') });
        } else Kanaan.Sound.say(msg, { who: 'kanaan' });
      }
    }

    const node = el('section.screen.screen--transfer', { 'aria-labelledby': 'transfer-title' },
      el('h2.screen-title', { id: 'transfer-title', tabindex: '-1' }, 'مهمة جديدة: ثلاث قنوات'),
      radio.node,
      el('div.channels', { role: 'group', 'aria-label': 'قنوات الراديو' }, channels.map((c) => c.b)),
      el('p.question-text', null, act.prompt),
      el('div.row.row--center', null, confirm),
      canHear ? null : el('p.footnote', null, 'ⓘ لا يتوفّر صوت عربي في هذا المتصفح؛ اقرأ الكلمات بصوت عالٍ مع معلّمك.'),
      fbSlot);

    return {
      node,
      onEnter() { Kanaan.Host.say(ep.script.transfer, { cue: Kanaan.AudioLib.lineCue(ep, 'script.transfer') }); },
      cleanup() { wave.destroy(); }
    };
  }
});
