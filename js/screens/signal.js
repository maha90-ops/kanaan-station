/**
 * الشاشة ٢ — التقط الإشارة (التمييز السمعي)
 * لماذا دون صورة أو حرف؟ لنقيس ونبني الوعي الصوتي نفسه؛ الصورة تكشف الإجابة
 * (شمس ← ش) فيتحول النشاط إلى تخمين بصري.
 */
Kanaan.UI.registerScreen({
  id: 'signal',
  stage: 'listen',
  render({ ep, next }) {
    const { el, button, feedback, wait } = Kanaan.UI;
    const act = ep.phonemeActivity;
    let wrong = 0, busy = false, solved = false;

    const radio = Kanaan.UI.radio();
    const wave = Kanaan.UI.waveView(radio.canvas);
    const status = el('p.signal-status', { 'aria-live': 'polite' }, '📡 استعدّ لاستقبال الإشارة…');
    const fbSlot = el('div.feedback-slot');
    const scaffoldSlot = el('div.scaffold-slot');

    async function play(spec = ep.sound, label = 'الإشارة') {
      if (busy) return;
      busy = true;
      radio.node.classList.add('is-on');
      status.textContent = `📡 أستمع إلى ${label}…`;
      const { analyser, done } = Kanaan.Sound.phoneme(spec);
      analyser ? wave.live(analyser) : wave.speech();
      await done;
      wave.idle();
      radio.node.classList.remove('is-on');
      status.textContent = '👂 انتهت الإشارة.';
      busy = false;
    }

    const replay = button('أعد الاستماع', { variant: 'secondary', icon: '🔁', onClick: () => play() });

    const options = act.options.map((letter) => el('button.choice.choice--letter', {
      type: 'button', 'aria-label': `الحرف ${letter}`,
      onclick: (e) => choose(letter, e.currentTarget)
    }, el('span.choice-glyph', null, letter), el('span.choice-mark', { 'aria-hidden': 'true' })));

    const question = el('div.question', { hidden: true },
      el('p.question-text', null, act.prompt),
      el('div.choices', { role: 'group', 'aria-label': act.prompt }, options));

    async function choose(letter, btn) {
      if (solved || busy) return;
      const ok = letter === act.correct;
      Kanaan.Progress.attempt(ep.id, 'discrimination', ok);
      if (ok) {
        solved = true;
        btn.classList.add('is-correct');
        btn.querySelector('.choice-mark').textContent = '✔';
        options.forEach((o) => o !== btn && o.setAttribute('disabled', ''));
        Kanaan.Sound.sfx('success');
        fbSlot.replaceChildren(feedback('success', ep.feedback.discrimination.correct));
        await Kanaan.Sound.say(ep.feedback.discrimination.correct);
        await wait(500);
        next();
      } else {
        wrong++;
        btn.classList.add('is-tried');
        btn.querySelector('.choice-mark').textContent = '↺';
        Kanaan.Sound.sfx('gentle');
        fbSlot.replaceChildren(feedback('retry', ep.feedback.discrimination.retry));
        replay.classList.add('attention');
        setTimeout(() => replay.classList.remove('attention'), 2400);
        Kanaan.Sound.say(ep.feedback.discrimination.retry);
        // دعامة بعد محاولتين: قارن بالصوت الأقرب (س) دون كشف حرف الإشارة
        if (wrong >= 2 && act.contrast && !scaffoldSlot.firstChild) {
          scaffoldSlot.append(el('div.scaffold', null,
            el('p', null, '💡 ', ep.feedback.discriminationScaffold),
            el('div.scaffold-pair', null,
              button(`صوت «${act.contrast.letter}»`, { variant: 'ghost', icon: '🔊', onClick: () => play(act.contrast, `صوت ${act.contrast.letter}`) }),
              button('صوت الإشارة', { variant: 'ghost', icon: '📡', onClick: () => play() }))));
        }
      }
    }

    const node = el('section.screen.screen--signal', { 'aria-labelledby': 'signal-title' },
      el('h2.screen-title', { id: 'signal-title', tabindex: '-1' }, 'التقط الإشارة'),
      radio.node, status,
      el('div.row.row--center', null, replay),
      question, fbSlot, scaffoldSlot);

    return {
      node,
      async onEnter() {
        await Kanaan.Host.say(ep.script.signal, { keep: false });
        await wait(250);
        await play();
        question.hidden = false;
        question.classList.add('appear');
        Kanaan.Sound.say(act.prompt);
      },
      cleanup() { wave.destroy(); }
    };
  }
});
