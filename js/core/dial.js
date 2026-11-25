/**
 * لوحة الترددات — خريطة الحروف المكتشفة على مؤشر راديو.
 * كل حرف «محطة» بتردد. المحطة المكتشفة تضيء؛ الضغط عليها يشغّل:
 *   صوت الحرف (النموذج) ← صوت الطفل من الأرشيف ← الكلمة.
 * وظيفتها: مراجعة يختارها الطفل بنفسه + دليل مرئي على ما تعلّمه.
 */
Kanaan.Dial = (function () {
  const { el, digits } = Kanaan.UI;

  const freq = (ep) => {
    const f = (88.1 + ((ep.order || 1) - 1) * 2.4).toFixed(1);
    return digits(f).replace('.', '٫');
  };

  function create({ fresh = null } = {}) {
    let busy = false;
    const now = el('p.dial-now', { 'aria-live': 'polite' }, 'اختر محطة مضيئة لتستمع إليها.');

    const stations = Kanaan.Episodes.list().map((ep) => {
      const learned = Kanaan.Progress.isDone(ep.id);
      const b = el(`button.station${learned ? '.is-lit' : ''}${fresh === ep.id ? '.is-new' : ''}`, {
        type: 'button',
        disabled: !learned,
        'aria-label': learned ? `محطة الحرف ${ep.letter}، التردد ${freq(ep)}` : 'محطة لم تُكتشف بعد'
      },
      el('span.station-letter', { 'aria-hidden': 'true' }, learned ? ep.letter : '·'),
      el('span.station-freq', { 'aria-hidden': 'true' }, freq(ep)));
      b.addEventListener('click', () => tune(ep, b));
      return b;
    });

    async function tune(ep, b) {
      if (busy) return;
      busy = true;
      Kanaan.Sound.stop();
      stations.forEach((s) => s.classList.toggle('is-tuned', s === b));
      Kanaan.Sound.sfx('tune');
      now.textContent = `📻 ${freq(ep)} — محطة الحرف ${ep.letter}`;
      await Kanaan.UI.wait(500);
      await Kanaan.Sound.phoneme(ep.sound).done;
      const hadVoice = await Kanaan.Archive.play(`voice:${ep.id}`);
      if (hadVoice) now.textContent = `📻 ${freq(ep)} — صوتك وأنت تنطق ${ep.letter}`;
      await Kanaan.Sound.say(ep.exampleWord.text, { audio: ep.exampleWord.audio, rate: 0.75 });
      busy = false;
    }

    const node = el('div.dial', null,
      el('div.dial-scale', { role: 'group', 'aria-label': 'لوحة ترددات المحطة' }, stations),
      now);
    return { node };
  }

  /** نافذة «محطاتي» من الشريط العلوي */
  function openDialog() {
    let d = document.getElementById('dial-dialog');
    if (!d) {
      d = el('dialog.dial-dialog', { id: 'dial-dialog', 'aria-labelledby': 'dial-title' });
      document.body.append(d);
      d.addEventListener('close', () => Kanaan.Sound.stop());
    }
    Kanaan.Sound.stop();
    Kanaan.Host.hide();
    d.replaceChildren(
      el('h2.screen-title', { id: 'dial-title' }, '📻 محطاتي'),
      el('p.instruction', null, 'كل حرف اكتشفتَه صار محطة. استمع إليه وإلى صوتك.'),
      create().node,
      el('form', { method: 'dialog' }, el('button.btn.btn--secondary', { type: 'submit' }, 'إغلاق')));
    d.showModal();
  }

  return { create, openDialog, freq };
})();
