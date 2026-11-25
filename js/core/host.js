/**
 * كنعان المرشد: يظهر عند الحاجة فقط، يتكلم (صوت + نص مكتوب)، ثم يختفي.
 */
Kanaan.Host = (function () {
  const root = () => document.getElementById('host');
  let lastLine = null;

  async function say(text, { audio, keep = true } = {}) {
    lastLine = { text, audio };
    const h = root();
    document.getElementById('host-text').textContent = text;
    h.hidden = false;
    h.classList.remove('is-leaving');
    h.classList.add('is-speaking');
    await Kanaan.Sound.say(text, { audio });
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
    document.getElementById('host-replay').addEventListener('click', () => {
      if (lastLine) say(lastLine.text, { audio: lastLine.audio });
    });
  }

  return { say, hide, init };
})();
