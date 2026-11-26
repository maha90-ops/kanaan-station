/**
 * ٣ أكتشف — يظهر الحرف تدريجيًا من الراديو
 * لماذا الآن؟ بعد أن ميّز الطفل الصوت بأذنه، نربط الصوت المعروف برمزه المكتوب
 * (مبدأ: الصوت أولًا ثم الرمز). الحرف «يخرج» من الراديو = الصوت يتحوّل إلى شكل.
 */
Kanaan.UI.registerScreen({
  id: 'reveal',
  stage: 'discover',
  render({ ep, next, alive }) {
    const { el, button, wait } = Kanaan.UI;
    const radio = Kanaan.UI.radio({ compact: true });
    const wave = Kanaan.UI.waveView(radio.canvas);

    const glyph = el('div.big-letter', { 'aria-hidden': 'true' }, ep.letter);
    const stageBox = el('div.reveal-stage', null, glyph, radio.node);
    const name = el('p.letter-name', { hidden: true }, `حرف ${ep.letterName}`);
    const hint = el('p.letter-hint', { hidden: true }, '💡 ', ep.script.revealHint);

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

    const again = button('استمع مرة أخرى', { variant: 'secondary', icon: '🔊', onClick: model });
    const go = button('الآن دوري', { icon: '🎙️', onClick: next });
    const actions = el('div.row.row--center', { hidden: true }, again, go);

    const node = el('section.screen.screen--reveal', { 'aria-labelledby': 'reveal-title' },
      el('h2.screen-title', { id: 'reveal-title', tabindex: '-1' }, 'أكتشف الحرف'),
      el('p.sr-only', null, `الحرف المكتشف: ${ep.letter}`),
      stageBox, name, hint, actions);

    return {
      node,
      async onEnter() {
        Kanaan.Progress.attempt(ep.id, 'revealed', true);
        await wait(300);
        Kanaan.Sound.sfx('reveal');
        glyph.classList.add('is-rising');
        await wait(1100);
        if (!alive()) return;
        name.hidden = false;
        await Kanaan.Host.say(ep.script.reveal, { cue: Kanaan.AudioLib.lineCue(ep, 'script.reveal') });
        Kanaan.Puppet.express('happy');
        if (!alive()) return;
        await model();
        if (!alive()) return;
        // التلميح البصري يظهر نصًا على الشاشة ويُقرأ صوتيًا (دون تكراره في فقاعة كنعان)
        Kanaan.Host.hide();
        hint.hidden = false;
        actions.hidden = false;
        Kanaan.Sound.say(ep.script.revealHint, { who: 'kanaan', cue: Kanaan.AudioLib.lineCue(ep, 'script.revealHint') });
      },
      cleanup() { wave.destroy(); }
    };
  }
});
