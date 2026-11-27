/**
 * ٢ أميّز — تمييز سمعي خالص
 * يسمع الطفل الإشارة، ثم يستمع إلى ثلاثة أصوات (لا حروف ولا صور) ويختار المطابق.
 * لماذا أصوات لا حروف؟ الحرف لم يُكتشف بعد؛ عرضه هنا يكشف الإجابة لمن يعرف شكله،
 * ويحوّل المهمة إلى تعرّف بصري. بعد الإجابة الصحيحة تُكشف حروف الأصوات الثلاثة
 * (ربط الصوت بالرمز) ثم يخرج الحرف من الراديو في الشاشة التالية.
 */
Kanaan.UI.registerScreen({
  id: 'signal',
  stage: 'discriminate',
  render({ ep, next, alive }) {
    const { el, button, feedback, wait, digits } = Kanaan.UI;
    const act = ep.phonemeActivity;
    let wrong = 0, busy = false, solved = false, picked = null;

    const radio = Kanaan.UI.radio();
    const wave = Kanaan.UI.waveView(radio.canvas);
    const status = el('p.signal-status', { 'aria-live': 'polite' }, '👂 اضغط على كل صوت لتسمعه.');
    const fbSlot = el('div.feedback-slot');
    const scaffoldSlot = el('div.scaffold-slot');

    async function play(spec = ep.sound, label = 'الإشارة', card = null) {
      Kanaan.Sound.stop();
      busy = true;
      radio.node.classList.add('is-on');
      cards.forEach((c) => c.node.classList.toggle('is-playing', c.node === card));
      status.textContent = `📡 أستمع إلى ${label}…`;
      const { analyser, done } = Kanaan.Sound.phoneme(spec);
      analyser ? wave.live(analyser) : wave.speech();
      await done;
      wave.idle();
      radio.node.classList.remove('is-on');
      if (card) card.classList.remove('is-playing');
      status.textContent = '👂 انتهى الصوت.';
      busy = false;
    }

    const replay = button('أعد سماع الصوت المختبئ', { variant: 'secondary', icon: '📡', onClick: () => play() });

    // بطاقات الأصوات: لمس البطاقة يُسمع صوتها ويختارها؛ زر «هذا هو» يؤكد
    const cards = act.options.map((letter, i) => {
      const glyph = el('span.sound-glyph', { 'aria-hidden': 'true' }, '؟');
      const node = el('button.sound-card', {
        type: 'button', 'aria-pressed': 'false', 'aria-label': `الصوت ${digits(i + 1)}`,
        onclick: () => {
          if (solved) return;
          picked = i;
          cards.forEach((c, j) => { c.node.classList.toggle('is-picked', j === i); c.node.setAttribute('aria-pressed', String(j === i)); });
          confirm.removeAttribute('disabled');
          play(act.sounds[letter], `الصوت ${digits(i + 1)}`, node);
        }
      },
      el('span.sound-bars', { 'aria-hidden': 'true' }, el('i'), el('i'), el('i'), el('i'), el('i')),
      el('span.sound-name', null, `صوت ${digits(i + 1)}`),
      glyph,
      el('span.choice-mark', { 'aria-hidden': 'true' }));
      return { node, glyph, letter };
    });

    const confirm = button('هذا هو الصوت!', { icon: '✔', onClick: () => choose() });
    confirm.setAttribute('disabled', '');

    const question = el('div.question', null,
      el('p.question-text', null, act.prompt),
      el('div.sound-cards', { role: 'group', 'aria-label': act.prompt }, cards.map((c) => c.node)),
      el('div.row.row--center', null, confirm));

    async function choose() {
      if (solved || picked == null) return;
      const c = cards[picked];
      const ok = c.letter === act.correct;
      Kanaan.Progress.attempt(ep.id, 'discrimination', ok);
      Kanaan.Sound.stop();
      if (ok) {
        solved = true;
        confirm.setAttribute('disabled', '');
        c.node.classList.add('is-correct');
        c.node.querySelector('.choice-mark').textContent = '✔';
        // كشف رموز الأصوات الثلاثة: كل صوت له حرف
        cards.forEach((x, j) => setTimeout(() => {
          x.glyph.textContent = x.letter;
          x.node.classList.add('is-revealed');
          x.node.setAttribute('aria-label', `الصوت ${digits(j + 1)}: حرف ${x.letter}`);
        }, 250 + j * 180));
        Kanaan.Sound.sfx('success');
        fbSlot.replaceChildren(feedback('success', ep.feedback.discrimination.correct));
        await Kanaan.Sound.say(ep.feedback.discrimination.correct, { who: 'kanaan', cue: Kanaan.AudioLib.lineCue(ep, 'feedback.discrimination.correct') });
        await wait(700);
        if (alive()) next();
      } else {
        wrong++;
        c.node.classList.add('is-tried');
        c.node.classList.remove('is-picked');
        c.node.querySelector('.choice-mark').textContent = '↺';
        picked = null;
        confirm.setAttribute('disabled', '');
        Kanaan.Sound.sfx('gentle');
        fbSlot.replaceChildren(feedback('retry', ep.feedback.discrimination.retry));
        replay.classList.add('attention');
        setTimeout(() => replay.classList.remove('attention'), 2400);
        Kanaan.Sound.say(ep.feedback.discrimination.retry, { who: 'kanaan', cue: Kanaan.AudioLib.lineCue(ep, 'feedback.discrimination.retry') });
        // دعامة بعد محاولتين: المقارنة بالصوت الأقرب، دون كشف رمز الإشارة
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
      el('h2.screen-title', { id: 'signal-title', tabindex: '-1' }, 'أميّز الصوت'),
      radio.node, status,
      el('div.row.row--center', null, replay),
      Kanaan.Sound.canPlay(ep.sound) ? null
        : el('p.footnote', null, `ⓘ لا يتوفّر صوت لهذا الحرف على هذا الجهاز بعد؛ اطلب من معلّمك أن ينطق «${ep.sound.label}».`),
      question, fbSlot, scaffoldSlot);

    return {
      node,
      async onEnter() {
        // الصوت سُمع في «أستمع»؛ كنعان يسأل، ثم يشرح كيف نختار
        Kanaan.Puppet.express('ask');
        await Kanaan.Host.say(act.prompt, { cue: Kanaan.AudioLib.lineCue(ep, 'phonemeActivity.prompt') });
        if (!alive()) return;
        Kanaan.Host.say(ep.script.signal, { cue: Kanaan.AudioLib.lineCue(ep, 'script.signal'), keep: false });
      },
      cleanup() { wave.destroy(); }
    };
  }
});
