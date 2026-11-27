/**
 * ٣ أكتشف — الطفل يكتشف رمز الصوت بنفسه
 * بعد أن ميّز الصوت بأذنه، تظهر ثلاثة حروف متشابهة الشكل (مثل ب ت ث)،
 * ويسمع تلميحًا بصريًا («تحت الحرف ب نقطة واحدة»). يختار الطفل الحرف:
 * هذا تمييز بصري بين الحروف المتشابهة — من أصعب ما يواجهه المتعلّم المبتدئ —
 * والمدح «لقد اكتشفت الحرف» يأتي بعد فعلٍ حقيقي لا قبله.
 * بعد الاختيار الصحيح يخرج الحرف من الراديو ويُسمع صوته (ربط الرمز بالصوت).
 */
Kanaan.UI.registerScreen({
  id: 'reveal',
  stage: 'discover',
  render({ ep, next, alive }) {
    const { el, button, feedback, wait, digits } = Kanaan.UI;
    const radio = Kanaan.UI.radio({ compact: true });
    const wave = Kanaan.UI.waveView(radio.canvas);
    const L = (k) => ({ cue: Kanaan.AudioLib.lineCue(ep, k) });
    let solved = false, tries = 0;

    const glyph = el('div.big-letter', { 'aria-hidden': 'true', hidden: true }, ep.letter);
    const stageBox = el('div.reveal-stage', null, glyph, radio.node);
    const name = el('p.letter-name', { hidden: true }, `حرف ${ep.letterName}`);
    const hint = el('p.letter-hint', null, '💡 ', ep.script.revealHint);
    const fbSlot = el('div.feedback-slot');

    async function model() {
      radio.node.classList.add('is-on');
      const { analyser, done } = Kanaan.Sound.phoneme(ep.sound);
      analyser ? wave.live(analyser) : wave.speech();
      glyph.classList.add('is-sounding');
      await done;
      glyph.classList.remove('is-sounding');
      wave.idle();
      radio.node.classList.remove('is-on');
    }

    // ترتيب ثابت للخيارات، لكن الحرف الصحيح ليس أولًا دائمًا
    const opts = ep.discoverActivity.options.slice();
    const shift = (ep.order || 1) % opts.length;
    const shown = opts.map((_, i) => opts[(i + shift) % opts.length]);
    const cards = shown.map((l) => el('button.choice.choice--letter', {
      type: 'button', 'aria-label': `الحرف ${l}`, onclick: (e) => choose(l, e.currentTarget)
    }, el('span.choice-glyph', null, l), el('span.choice-mark', { 'aria-hidden': 'true' })));
    const picker = el('div.question', null,
      el('p.question-text', null, 'أيّ حرف يُكتب به هذا الصوت؟'),
      el('div.choices', { role: 'group', 'aria-label': 'اختر الحرف' }, cards),
      el('div.row.row--center', null,
        button('اسمع الصوت', { variant: 'ghost', icon: '🔊', onClick: model }),
        button('اسمع التلميح', { variant: 'ghost', icon: '💡', onClick: () => Kanaan.Host.say(ep.script.revealHint, L('script.revealHint')) })));

    async function choose(l, card) {
      if (solved) return;
      tries++;
      const ok = l === ep.letter;
      Kanaan.Progress.attempt(ep.id, 'revealed', ok, { tries });
      Kanaan.Sound.stop();
      if (ok) {
        solved = true;
        card.classList.add('is-correct');
        card.querySelector('.choice-mark').textContent = '✔';
        cards.forEach((c) => c !== card && c.setAttribute('disabled', ''));
        Kanaan.Sound.sfx('reveal');
        // الحرف المختار يخرج من الراديو
        picker.hidden = true;
        hint.hidden = true;
        glyph.hidden = false;
        glyph.classList.add('is-rising');
        await wait(1000);
        if (!alive()) return;
        name.hidden = false;
        fbSlot.replaceChildren(feedback('success', ep.script.reveal));
        Kanaan.Puppet.express('happy');
        await Kanaan.Host.say(ep.script.reveal, L('script.reveal'));
        if (!alive()) return;
        await model();
        if (!alive()) return;
        actions.hidden = false;
      } else {
        card.classList.add('is-tried');
        card.querySelector('.choice-mark').textContent = '↺';
        card.setAttribute('disabled', '');
        Kanaan.Sound.sfx('gentle');
        fbSlot.replaceChildren(feedback('retry', ep.script.discoverRetry));
        Kanaan.Puppet.express('encourage');
        await Kanaan.Host.say(ep.script.discoverRetry, L('script.discoverRetry'));
        if (alive() && !solved) Kanaan.Host.say(ep.script.revealHint, L('script.revealHint'));
      }
    }

    const again = button('استمع مرة أخرى', { variant: 'secondary', icon: '🔊', onClick: model });
    const go = button('الآن دوري', { icon: '🎙️', onClick: next });
    const actions = el('div.row.row--center', { hidden: true }, again, go);

    const node = el('section.screen.screen--reveal', { 'aria-labelledby': 'reveal-title' },
      el('h2.screen-title', { id: 'reveal-title', tabindex: '-1' }, 'أكتشف الحرف'),
      stageBox, name, hint, picker, fbSlot, actions);

    return {
      node,
      async onEnter() {
        Kanaan.Puppet.express('ask');
        await Kanaan.Host.say(ep.script.discoverAsk, L('script.discoverAsk'));
        if (!alive() || solved) return;
        Kanaan.Host.say(ep.script.revealHint, { ...L('script.revealHint'), keep: false });
      },
      cleanup() { wave.destroy(); }
    };
  }
});
