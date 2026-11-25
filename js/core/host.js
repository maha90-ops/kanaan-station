/**
 * كنعان المرشد: يظهر عند الحاجة فقط، يتكلم (صوت + نص مكتوب)، ثم يختفي.
 * الصورة الرمزية دمية حيّة (Puppet) تتحرك شفتاها مع الكلام.
 * زر الصوت في الفقاعة يعمل تشغيلًا/إيقافًا.
 */
Kanaan.Host = (function () {
  const root = () => document.getElementById('host');
  let lastLine = null, talking = false;

  function paintBtn() {
    const b = document.getElementById('host-replay');
    b.textContent = talking ? '⏹' : '🔊';
    b.setAttribute('aria-label', talking ? 'أوقف كلام كنعان' : 'أعد كلام كنعان');
  }

  async function say(text, { audio, keep = true } = {}) {
    lastLine = { text, audio };
    const h = root();
    document.getElementById('host-text').textContent = text;
    h.hidden = false;
    h.classList.remove('is-leaving');
    h.classList.add('is-speaking');
    talking = true; paintBtn();
    await Kanaan.Sound.say(text, { audio, who: 'kanaan' });
    talking = false; paintBtn();
    h.classList.remove('is-speaking');
    if (!keep) hide();
  }

  function hide() {
    const h = root();
    if (h.hidden) return;
    h.classList.add('is-leaving');
    setTimeout(() => { h.hidden = true; h.classList.remove('is-leaving'); }, Kanaan.UI.reduceMotion ? 0 : 250);
  }

  function init() {
    // الصورة الرمزية: دمية كنعان مقصوصة على الرأس
    const slot = document.getElementById('host-avatar');
    if (slot && Kanaan.Puppet) slot.replaceChildren(Kanaan.Puppet.avatar());
    document.getElementById('host-replay').addEventListener('click', () => {
      if (talking) { Kanaan.Sound.stop(); return; }
      if (lastLine) say(lastLine.text, { audio: lastLine.audio });
    });
  }

  return { say, hide, init };
})();
