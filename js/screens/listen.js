/**
 * ١ أستمع — صوت يختبئ في المحطة
 * لماذا؟ الأذن قبل العين: يسمع الطفل الصوت الهدف («بَ بَ بَ») قبل أي رمز أو صورة،
 * فيُبنى التمثيل الصوتي أولًا. الراديو هو مركز الشاشة: موجاته وشاشته تتحرك مع الصوت فقط.
 */
Kanaan.UI.registerScreen({
  id: 'listen',
  stage: 'listen',
  render({ ep, next, alive }) {
    const { el, button, wait } = Kanaan.UI;
    const radio = Kanaan.UI.radio({ big: true });
    const wave = Kanaan.UI.waveView(radio.canvas);
    const status = el('p.signal-status', { 'aria-live': 'polite' }, '📡 المحطة تستقبل…');
    let busy = false, heard = 0;

    async function play() {
      if (busy) return;
      busy = true;
      Kanaan.Host.hide();
      radio.node.classList.add('is-on');
      status.textContent = '👂 استمع…';
      const { analyser, done } = Kanaan.Sound.phoneme(ep.sound, { repeat: 3 });
      analyser ? wave.live(analyser) : wave.speech();
      await done;
      wave.idle();
      radio.node.classList.remove('is-on');
      status.textContent = '📡 انتهى الصوت.';
      busy = false;
      heard++;
      Kanaan.Progress.patch(ep.id, 'listened', { success: true, times: heard });
      actions.hidden = false;
    }

    const again = button('اسمعه مرة أخرى', { variant: 'secondary', icon: '🔁', onClick: play });
    const go = button('ميّز الصوت', { icon: '←', big: true, onClick: next });
    const actions = el('div.row.row--center', { hidden: true }, again, go);

    const node = el('section.screen.screen--listen', { 'aria-labelledby': 'listen-title' },
      el('h2.screen-title', { id: 'listen-title', tabindex: '-1' }, 'أستمع'),
      radio.node, status, actions,
      Kanaan.Sound.canPlay(ep.sound) ? null
        : el('p.footnote', null, `ⓘ لا يتوفّر صوت لهذا الحرف على هذا الجهاز بعد؛ اطلب من معلّمك أن ينطق «${ep.sound.label}».`));

    return {
      node,
      async onEnter() {
        await Kanaan.Host.say(ep.script.listenIntro, { cue: Kanaan.AudioLib.lineCue(ep, 'script.listenIntro') });
        if (!alive()) return;
        await wait(250);
        await play();
        if (!alive()) return;
        Kanaan.Host.say(ep.script.listenAfter, { cue: Kanaan.AudioLib.lineCue(ep, 'script.listenAfter'), keep: false });
      },
      cleanup() { wave.destroy(); }
    };
  }
});
