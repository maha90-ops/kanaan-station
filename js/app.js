/**
 * المحرّك: يقرأ تسلسل الشاشات من الحلقة (ep.flow) ويعرضها واحدة تلو الأخرى.
 * لا يعرف شيئًا عن حرف بعينه.
 * اختيار حلقة: index.html?ep=sh  (الافتراضي: أول حلقة مسجّلة)
 */
(function () {
  const { UI, Sound, Host, Progress, Episodes } = Kanaan;
  const stageEl = document.getElementById('stage');
  const bar = document.getElementById('station-bar');

  let ep = null, index = 0, active = null, token = 0;

  function show(i) {
    const id = ep.flow[i];
    const def = UI.screens[id];
    if (!def) { console.error('[Kanaan] شاشة غير معروفة:', id); return; }

    if (active?.cleanup) active.cleanup();
    Sound.stop();
    Host.hide();
    const my = ++token;
    index = i;

    const ctx = {
      ep,
      next: () => { if (my === token && index + 1 < ep.flow.length) { Sound.sfx('whoosh'); show(index + 1); } },
      restart: () => startEpisode(ep.id),
      goEpisode: (id) => startEpisode(id),
      alive: () => my === token
    };
    active = def.render(ctx);

    bar.hidden = id === 'welcome';
    document.body.dataset.screen = id;
    if (def.stage || id === 'success') UI.renderJourney(def.stage, Progress.stagesDone(ep.id));

    active.node.classList.add('screen-enter');
    stageEl.replaceChildren(active.node);
    const focusEl = active.node.querySelector(active.focus || '.screen-title');
    if (focusEl) focusEl.focus({ preventScroll: false });
    window.scrollTo({ top: 0 });

    if (active.onEnter) Promise.resolve(active.onEnter()).catch((e) => console.error(e));
  }

  function startEpisode(id) {
    ep = Episodes.get(id) || Episodes.list()[0];
    if (!ep) return;
    Progress.start(ep.id);
    show(0);
  }

  /* زر المؤثرات */
  const sfxBtn = document.getElementById('sfx-toggle');
  function paintSfx() {
    sfxBtn.setAttribute('aria-pressed', String(Sound.sfxOn));
    sfxBtn.querySelector('.sfx-icon').textContent = Sound.sfxOn ? '🔔' : '🔕';
    sfxBtn.querySelector('.sfx-label').textContent = Sound.sfxOn ? 'المؤثرات: تعمل' : 'المؤثرات: متوقفة';
  }
  sfxBtn.addEventListener('click', () => { Sound.setSfx(!Sound.sfxOn); paintSfx(); });
  paintSfx();

  Host.init();
  const params = new URLSearchParams(location.search);
  startEpisode(params.get('ep') || 'sh');

  // للمعلم/المطوّر: Kanaan.debug.export() لتصدير السجل
  Kanaan.debug = { export: Progress.export, reset: Progress.reset, go: (n) => show(n) };
})();
