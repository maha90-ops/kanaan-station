/**
 * 🔴 على الهواء — الطفل مذيع.
 * لماذا؟ يتحوّل تسجيل الطفل من «اختبار» إلى «بثّ» يملكه: ملكية + دافعية + مراقبة ذاتية
 * (يسمع صوته في سياق حقيقي). بعد البث يضيء حرفه كمحطة جديدة على لوحة الترددات.
 */
Kanaan.UI.registerScreen({
  id: 'onair',
  stage: null,
  render({ ep, next, alive }) {
    const { el, button, wait } = Kanaan.UI;
    const sign = el('div.onair-sign', { 'aria-hidden': 'true' }, el('span.onair-dot'), 'على الهواء');
    const dialSlot = el('div.dial-slot');
    const actions = el('div.row.row--center');
    let started = false;

    async function broadcast() {
      if (started) return;
      started = true;
      actions.replaceChildren();
      sign.classList.add('is-live');
      Kanaan.Sound.sfx('tune');
      await wait(600);
      await Kanaan.Host.say(ep.script.onairIntro, { cue: Kanaan.AudioLib.lineCue(ep, 'script.onairIntro') });
      if (!alive()) return;
      const had = await Kanaan.Archive.play(`voice:${ep.id}`);
      if (!alive()) return;
      if (!had) await Kanaan.Host.say(ep.script.onairNoVoice, { cue: Kanaan.AudioLib.lineCue(ep, 'script.onairNoVoice') });
      await Kanaan.Host.say(ep.script.onairWord, { cue: Kanaan.AudioLib.lineCue(ep, 'script.onairWord') });
      if (!alive()) return;
      await Kanaan.Sound.say(ep.exampleWord.text, { cue: ep.exampleWord.cue, rate: 0.75 });
      sign.classList.remove('is-live');
      Kanaan.Sound.sfx('built');
      Kanaan.Host.hide();
      // محطة جديدة تضيء
      dialSlot.replaceChildren(
        el('p.question-text', null, `محطة جديدة على لوحة الترددات: ${ep.letter} ${Kanaan.Dial.freq(ep)}`),
        Kanaan.Dial.create({ fresh: ep.id }).node);
      actions.replaceChildren(
        button('أعد البث', { variant: 'ghost', icon: '🔁', onClick: () => { started = false; broadcast(); } }),
        button('متابعة', { icon: '←', onClick: next }));
    }

    actions.append(button('ابدأ البث', { icon: '🔴', big: true, onClick: broadcast }));

    const node = el('section.screen.screen--onair', { 'aria-labelledby': 'onair-title' },
      el('h2.screen-title', { id: 'onair-title', tabindex: '-1' }, 'أنت مذيع اليوم!'),
      sign, actions, dialSlot);

    return { node, onEnter() { Kanaan.Host.say(ep.script.onairStart, { cue: Kanaan.AudioLib.lineCue(ep, 'script.onairStart') }); } };
  }
});
