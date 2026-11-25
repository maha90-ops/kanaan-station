/**
 * الشاشة ٦ — اكتشاف المعنى
 * لماذا تظهر الصورة الآن فقط؟ الصورة «مكافأة معنى»: الطفل فكّ الرمز ثم اكتشف ما يعنيه،
 * فيرتبط الصوت والرمز والمعنى معًا (ترميز مزدوج) بعد أن بُني كل منها على حدة.
 * ثم سؤال «أين تسمع ش؟» يعيد الانتباه من المعنى إلى الصوت.
 */
Kanaan.UI.registerScreen({
  id: 'meaning',
  stage: 'apply',
  render({ ep, next, alive }) {
    const { el, button, feedback, wait } = Kanaan.UI;
    const act = ep.meaningActivity;
    const word = ep.exampleWord;
    const fbSlot = el('div.feedback-slot');
    let solved = false;

    const highlight = (w) => Kanaan.UI.highlightLetter(w, ep.letter);

    const scene = el('figure.scene', null,
      word.image.src
        ? el('div.scene-art', null, el('img', { src: word.image.src, alt: word.image.alt }))
        : el('div.scene-art', { role: 'img', 'aria-label': word.image.alt, html: Kanaan.Scenes[word.image.scene] }),
      el('figcaption.scene-word', null, highlight(word.text)));

    const cards = act.options.map((o) => {
      const card = el('div.word-card');
      const pick = el('button.word-pick', { type: 'button', onclick: () => choose(o, card) }, el('span.word', null, o.word));
      const hear = el('button.icon-btn.icon-btn--round', {
        type: 'button', 'aria-label': `استمع إلى كلمة ${o.word}`,
        onclick: () => Kanaan.Sound.say(o.word, { audio: o.audio, rate: 0.75 })
      }, '🔊');
      card.append(pick, hear, el('span.choice-mark', { 'aria-hidden': 'true' }));
      return card;
    });

    const question = el('div.question', { hidden: true },
      el('p.question-text', null, act.prompt),
      el('div.word-cards', { role: 'group', 'aria-label': act.prompt }, cards));

    async function choose(o, card) {
      if (solved) return;
      Kanaan.Progress.attempt(ep.id, 'meaning', o.has);
      if (o.has) {
        solved = true;
        card.classList.add('is-correct');
        card.querySelector('.choice-mark').textContent = '✔';
        card.querySelector('.word-pick').replaceChildren(highlight(o.word));
        Kanaan.Sound.sfx('success');
        fbSlot.replaceChildren(feedback('success', ep.feedback.meaning.correct));
        await Kanaan.Sound.say(ep.feedback.meaning.correct);
        await wait(500);
        if (alive()) next();
      } else {
        card.classList.add('is-tried');
        card.querySelector('.choice-mark').textContent = '↺';
        Kanaan.Sound.sfx('gentle');
        fbSlot.replaceChildren(feedback('retry', ep.feedback.meaning.retry));
        await Kanaan.Sound.say(o.word, { audio: o.audio, rate: 0.75 });
        if (alive()) Kanaan.Sound.say(ep.feedback.meaning.retry);
      }
    }

    const node = el('section.screen.screen--meaning', { 'aria-labelledby': 'meaning-title' },
      el('h2.screen-title', { id: 'meaning-title', tabindex: '-1' }, 'ماذا بنيتَ؟'),
      scene, question, fbSlot);

    return {
      node,
      async onEnter() {
        Kanaan.Sound.sfx('reveal');
        scene.classList.add('is-revealing');
        await wait(900);
        if (!alive()) return;
        await Kanaan.Host.say(ep.script.meaning);
        if (!alive()) return;
        Kanaan.Host.hide();
        question.hidden = false;
        question.classList.add('appear');
        Kanaan.Sound.say(act.prompt);
      }
    };
  }
});
