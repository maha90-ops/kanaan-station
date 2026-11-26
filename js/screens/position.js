/**
 * ٧ أوظّف (١) — أين تسمع الصوت في الكلمة؟
 * وعي فونيمي بموضع الصوت: بداية / وسط / نهاية — يُجاب بالأذن مع إمكانية إبطاء الكلمة.
 * الصورة صغيرة هنا (ظهرت بعد البناء): تذكير بالمعنى لا أكثر.
 */
Kanaan.UI.registerScreen({
  id: 'position',
  stage: 'apply',
  render({ ep, next, alive }) {
    const { el, button, feedback, wait } = Kanaan.UI;
    const act = ep.meaningActivity;
    const word = ep.exampleWord;
    const fbSlot = el('div.feedback-slot');
    let solved = false;

    const caption = el('figcaption.scene-word', null, el('span.word', null, word.text));
    const scene = el('figure.scene.scene--small', null,
      word.image.src
        ? el('div.scene-art', null, el('img', { src: word.image.src, alt: word.image.alt }))
        : el('div.scene-art', { role: 'img', 'aria-label': word.image.alt, html: Kanaan.Scenes[word.image.scene] }),
      caption);

    // ثلاثة مواضع؛ أيقونة من ثلاث خانات تُملأ منها خانة الموضع (من اليمين في العربية)
    const POS = [['start', 'في البداية'], ['middle', 'في الوسط'], ['end', 'في النهاية']];
    const slotsIcon = (k) => el('span.pos-icon', { 'aria-hidden': 'true' },
      POS.map(([p]) => el(`span.pos-dot${p === k ? '.on' : ''}`)));
    const opts = POS.map(([k, label]) => {
      const b = el('button.pos-card', { type: 'button', onclick: () => choose(k, b) },
        slotsIcon(k), el('span.pos-label', null, label), el('span.choice-mark', { 'aria-hidden': 'true' }));
      return b;
    });

    const slow = button('اسمع الكلمة ببطء', { variant: 'secondary', icon: '🐢', onClick: () => Kanaan.Sound.say(word.text, { cue: word.cue, rate: 0.45 }) });
    const question = el('div.question', null,
      el('p.question-text', null, act.prompt),
      el('div.row.row--center', null, slow),
      el('div.pos-cards', { role: 'group', 'aria-label': act.prompt }, opts));

    async function choose(k, b) {
      if (solved) return;
      const ok = k === word.position;
      Kanaan.Progress.attempt(ep.id, 'meaning', ok, { position: k });
      if (ok) {
        solved = true;
        b.classList.add('is-correct');
        b.querySelector('.choice-mark').textContent = '✔';
        opts.forEach((o) => o !== b && o.setAttribute('disabled', ''));
        caption.replaceChildren(Kanaan.UI.highlightLetter(word.text, ep.wordLetter, { firstOnly: true }));
        Kanaan.Puppet.express('happy');
        Kanaan.Sound.sfx('success');
        fbSlot.replaceChildren(feedback('success', ep.feedback.meaning.correct));
        await Kanaan.Sound.say(ep.feedback.meaning.correct, { who: 'kanaan', cue: Kanaan.AudioLib.lineCue(ep, 'feedback.meaning.correct') });
        await wait(600);
        if (alive()) next();
      } else {
        b.classList.add('is-tried');
        b.querySelector('.choice-mark').textContent = '↺';
        Kanaan.Sound.sfx('gentle');
        fbSlot.replaceChildren(feedback('retry', ep.feedback.meaning.retry));
        await Kanaan.Sound.say(ep.feedback.meaning.retry, { who: 'kanaan', cue: Kanaan.AudioLib.lineCue(ep, 'feedback.meaning.retry') });
        if (alive()) Kanaan.Sound.say(word.text, { cue: word.cue, rate: 0.45 });
      }
    }

    const node = el('section.screen.screen--meaning', { 'aria-labelledby': 'meaning-title' },
      el('h2.screen-title', { id: 'meaning-title', tabindex: '-1' }, 'أين الصوت؟'),
      scene, question, fbSlot);

    return {
      node,
      onEnter() {
        Kanaan.Host.say(act.prompt, { cue: Kanaan.AudioLib.lineCue(ep, 'meaningActivity.prompt'), keep: false });
      }
    };
  }
});
