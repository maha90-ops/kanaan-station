/**
 * لوحة الترددات — خريطة الحروف المكتشفة على مؤشر راديو.
 * كل حرف «محطة» بتردد. المحطة المكتشفة تضيء؛ الضغط عليها يشغّل:
 *   صوت الحرف (النموذج) ← صوت الطفل وهو ينطقه ← كلمة المحطة ←
 *   الكلمة التي اكتشفها الطفل بنفسه في بيته (مهمة المحطة) إن سجّلها.
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
      if (await Kanaan.Archive.get(`voice:${ep.id}`)) {
        now.textContent = `🎙️ ${freq(ep)} — صوتك وأنت تنطق ${ep.letter}`;
        await Kanaan.Archive.play(`voice:${ep.id}`);
      }
      now.textContent = `📻 ${freq(ep)} — كلمة المحطة: ${ep.exampleWord.text}`;
      await Kanaan.Sound.say(ep.exampleWord.text, { cue: Kanaan.AudioLib.wordCue(ep.exampleWord.text), rate: 0.75 });
      // اكتشاف الطفل نفسه: ما وجده في بيته يبدأ بهذا الصوت — من كلماته هو، لا من الدرس
      if (!(await Kanaan.Archive.get(`mission:${ep.id}`))) { busy = false; return; }
      now.textContent = `🔎 ${freq(ep)} — كلمة اكتشفتَها في بيتك تبدأ بصوت ${ep.letter}`;
      await Kanaan.UI.wait(400);
      await Kanaan.Archive.play(`mission:${ep.id}`);
      busy = false;
    }

    const node = el('div.dial', null,
      el('div.dial-scale', { role: 'group', 'aria-label': 'لوحة ترددات المحطة' }, stations),
      now);
    return { node };
  }

  return { create, freq };
})();
