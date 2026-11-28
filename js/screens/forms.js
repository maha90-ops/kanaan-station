/**
 * ٦ أكتب (٢) — الحرف يغيّر شكله في الكلمة
 * لماذا؟ الطفل كتب الحرف معزولًا، لكنه يقرؤه في الكلمات بأشكال أخرى (بـ ـبـ ـب).
 * دون هذه الخطوة قد يعرف «ب» ولا يتعرّفها في «حَبْل».
 * النشاط: كلمة فيها الحرف ملوّنًا، والطفل يختار شكله من بطاقات الأشكال وحدها
 * (دون كتابة «أول/وسط/آخر» عليها، كي ينظر إلى الاتصال لا إلى التسمية).
 * بعد كل إجابة صحيحة تنزل الكلمة تحت شكلها، فتكتمل في النهاية لوحة: شكل ← مثال.
 * الخطأ لا يوقف شيئًا: سؤال يوجّه النظر — هل يتصل بما قبله؟ بما بعده؟
 */
Kanaan.UI.registerScreen({
  id: 'forms',
  stage: 'write',
  render({ ep, next, alive }) {
    const { el, button, feedback, wait } = Kanaan.UI;
    const act = ep.formsActivity;
    const L = (k) => ({ cue: Kanaan.AudioLib.lineCue(ep, k) });
    const fbSlot = el('div.feedback-slot');
    let i = 0, busy = false, tries = 0;

    /** الكلمة مع تلوين الحرف في موضعه المحدد (لا أول ظهور له فقط) */
    function marked(word, index) {
      const span = el('span.word', { lang: 'ar' });
      let n = -1, buf = '', hit = false;
      const flush = () => { if (buf) span.append(hit ? el('mark.target', null, buf) : buf); buf = ''; };
      for (const ch of word) {
        if (!/[ً-ْٰ]/.test(ch)) { n++; const h = n === index; if (h !== hit) { flush(); hit = h; } }
        buf += ch;
      }
      flush();
      return span;
    }

    const wordBox = el('p.forms-word');
    const hear = button('اسمع الكلمة', { variant: 'ghost', icon: '🔊', onClick: () => sayWord() });
    const counter = el('p.forms-count', { 'aria-live': 'polite' });

    const cards = act.choices.map((f) => {
      const shelf = el('span.form-examples');
      const b = el('button.choice.form-card', {
        type: 'button', 'aria-label': `الشكل ${f}`, onclick: () => choose(f, b)
      }, el('span.choice-glyph', null, f), el('span.choice-mark', { 'aria-hidden': 'true' }));
      return { b, f, shelf };
    });
    const board = el('div.forms-board', { role: 'group', 'aria-label': 'أشكال الحرف' },
      cards.map((c) => el('div.form-col', null, c.b, c.shelf)));

    const sayWord = () => {
      const it = act.items[i];
      return it ? Kanaan.Sound.say(it.word, { cue: it.cue, rate: 0.75 }) : Promise.resolve();
    };

    function show() {
      const it = act.items[i];
      tries = 0;
      wordBox.replaceChildren(marked(it.word, it.index));
      counter.textContent = `كلمة ${Kanaan.UI.digits(i + 1)} من ${Kanaan.UI.digits(act.items.length)}`;
      cards.forEach((c) => {
        c.b.classList.remove('is-tried', 'is-correct');
        c.b.querySelector('.choice-mark').textContent = '';
        c.b.removeAttribute('disabled');
      });
      fbSlot.replaceChildren();
    }

    async function choose(f, b) {
      if (busy) return;
      const it = act.items[i];
      const ok = f === it.form;
      tries++;
      Kanaan.Progress.attempt(ep.id, 'forms', ok, { pos: it.pos, word: it.plain, tries });
      Kanaan.Sound.stop();
      if (ok) {
        busy = true;
        b.classList.add('is-correct');
        b.querySelector('.choice-mark').textContent = '✔';
        Kanaan.Sound.sfx('success');
        Kanaan.Puppet.express('happy');
        const msg = ep.feedback.forms[it.pos];
        fbSlot.replaceChildren(feedback('success', msg));
        // الكلمة تنزل تحت شكلها: مثال دائم لهذا الشكل
        const card = cards.find((c) => c.f === f);
        card.shelf.append(el('span.form-example.appear', null, marked(it.word, it.index)));
        await Kanaan.Host.say(msg, L(`feedback.forms.${it.pos}`));
        if (!alive()) return;
        await wait(350);
        i++;
        busy = false;
        if (i < act.items.length) { show(); sayWord(); } else finish();
      } else {
        b.classList.add('is-tried');
        b.querySelector('.choice-mark').textContent = '↺';
        b.setAttribute('disabled', '');
        Kanaan.Sound.sfx('gentle');
        Kanaan.Puppet.express('encourage');
        fbSlot.replaceChildren(feedback('retry', ep.feedback.forms.retry));
        await Kanaan.Host.say(ep.feedback.forms.retry, L('feedback.forms.retry'));
      }
    }

    async function finish() {
      wordBox.replaceChildren(el('span.forms-letter', { 'aria-hidden': 'true' }, ep.letter));
      counter.textContent = '';
      hear.hidden = true;
      question.hidden = true;
      cards.forEach((c) => {
        c.b.classList.remove('is-correct', 'is-tried');
        c.b.querySelector('.choice-mark').textContent = '';
        c.b.setAttribute('disabled', '');
      });
      board.classList.add('is-done');   // لوحة الخلاصة: كل شكل تحته أمثلته
      Kanaan.Sound.sfx('built');
      fbSlot.replaceChildren(feedback('success', ep.script.formsDone));
      Kanaan.Puppet.express('happy');
      await Kanaan.Host.say(ep.script.formsDone, L('script.formsDone'));
      if (!alive()) return;
      if (!act.joins) {
        noteSlot.replaceChildren(el('p.letter-hint.appear', null, '💡 ', ep.script.formsNonJoining));
        await Kanaan.Host.say(ep.script.formsNonJoining, L('script.formsNonJoining'));
        if (!alive()) return;
      }
      Kanaan.Host.hide();
      nextRow.replaceChildren(button('تابع', { icon: '←', big: true, onClick: next }));
    }

    const question = el('p.question-text', null, 'بأيّ شكل جاء الحرف الملوّن؟');
    const nextRow = el('div.row.row--center');
    const noteSlot = el('div.forms-note');
    const node = el('section.screen.screen--forms', { 'aria-labelledby': 'forms-title' },
      el('h2.screen-title', { id: 'forms-title', tabindex: '-1' }, 'الحرف في الكلمة'),
      el('div.forms-stage', null, wordBox, el('div.row.row--center', null, hear), counter),
      question, board, fbSlot, noteSlot, nextRow);

    show();
    return {
      node,
      async onEnter() {
        Kanaan.Puppet.express('ask');
        await Kanaan.Host.say(ep.script.formsIntro, L('script.formsIntro'));
        if (alive() && i === 0 && !busy) sayWord();
      }
    };
  }
});
