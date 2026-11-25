/**
 * الشاشة ٦ — اكتشاف المعنى
 * لماذا تظهر الصورة الآن فقط؟ الصورة «مكافأة معنى»: الطفل فكّ الرمز ثم اكتشف ما يعنيه،
 * فيرتبط الصوت والرمز والمعنى معًا (ترميز مزدوج) بعد أن بُني كل منها على حدة.
 * ثم سؤال «أين تسمع ش؟» يعيد الانتباه من المعنى إلى الصوت.
 */
Kanaan.Scenes = Kanaan.Scenes || {};
Kanaan.Scenes['sun-hills'] = `
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE7B8"/><stop offset="1" stop-color="#FFF6E4"/></linearGradient>
    <radialGradient id="sunG"><stop offset="0" stop-color="#FFD25A"/><stop offset="1" stop-color="#F6A623"/></radialGradient>
  </defs>
  <rect width="480" height="300" fill="url(#sky)"/>
  <g class="sun-rays" stroke="#F6A623" stroke-width="7" stroke-linecap="round" opacity=".75">
    <line x1="240" y1="30" x2="240" y2="10"/><line x1="296" y1="54" x2="310" y2="40"/><line x1="320" y1="110" x2="340" y2="110"/>
    <line x1="184" y1="54" x2="170" y2="40"/><line x1="160" y1="110" x2="140" y2="110"/>
  </g>
  <circle class="sun-disc" cx="240" cy="112" r="62" fill="url(#sunG)"/>
  <path d="M0 220 Q120 160 240 205 T480 190 V300 H0Z" fill="#C9B27C"/>
  <path d="M0 250 Q140 205 290 240 T480 235 V300 H0Z" fill="#8FA35B"/>
  <!-- بيت حجري صغير -->
  <g transform="translate(330 186)">
    <rect width="78" height="56" rx="3" fill="#E8D6B0" stroke="#A88C5C" stroke-width="2"/>
    <path d="M8 56 V32 a12 12 0 0 1 24 0 V56" fill="#7A5A3A"/>
    <path d="M46 22 h20 v16 h-20z" fill="#7FA7C9" stroke="#A88C5C" stroke-width="2"/>
    <path d="M30 0 h18 v-10 h-18z" fill="#E8D6B0" stroke="#A88C5C" stroke-width="2"/>
  </g>
  <!-- شجرة زيتون -->
  <g transform="translate(90 168)">
    <path d="M30 80 C26 60 34 46 28 30" stroke="#6B4F33" stroke-width="9" fill="none" stroke-linecap="round"/>
    <ellipse cx="22" cy="22" rx="34" ry="20" fill="#6F8A44"/>
    <ellipse cx="48" cy="12" rx="26" ry="16" fill="#7E9A4F"/>
    <ellipse cx="10" cy="4" rx="20" ry="13" fill="#7E9A4F"/>
  </g>
</svg>`;

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
      el('div.scene-art', { role: 'img', 'aria-label': word.image.alt, html: Kanaan.Scenes[word.image.scene] }),
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
