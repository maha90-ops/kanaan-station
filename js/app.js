/**
 * المحرّك: يقرأ تسلسل الشاشات من الحلقة (ep.flow) ويعرضها واحدة تلو الأخرى.
 * لا يعرف شيئًا عن حرف بعينه.
 * اختيار حلقة: index.html?ep=sh  (الافتراضي: أول حلقة مسجّلة)
 */
(function () {
  const { UI, Sound, Host, Progress, Episodes } = Kanaan;
  const stageEl = document.getElementById('stage');
  const bar = document.getElementById('station-bar');

  let ep = null, flow = [], index = 0, active = null, token = 0, missionEp = null, reviewEp = null;

  function show(i) {
    const id = flow[i];
    const def = UI.screens[id];
    if (!def) { console.error('[Kanaan] شاشة غير معروفة:', id); return; }

    if (active?.cleanup) active.cleanup();
    Sound.stop();
    Host.hide();
    const my = ++token;
    index = i;

    const ctx = {
      ep,
      next: () => { if (my === token && index + 1 < flow.length) { Sound.sfx('whoosh'); show(index + 1); } },
      restart: () => startEpisode(ep.id),
      goEpisode: (id) => startEpisode(id),
      alive: () => my === token,
      missionEp,
      reviewEp
    };
    active = def.render(ctx);

    bar.hidden = id === 'welcome';
    document.body.dataset.screen = id;
    if (id !== 'welcome') UI.renderJourney(def.stage, Progress.stagesDone(ep.id));

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
    const all = Episodes.list();
    document.getElementById('episode-chip').textContent =
      `📬 الرسالة ${UI.digits(all.indexOf(ep) + 1)} من ${UI.digits(all.length)}`;
    Progress.start(ep.id);

    /* شاشات التهيئة في بداية الحلقة (فقط عند وجود حروف سابقة):
       تقرير المهمة — عن آخر حرف أُعطيت مهمته في جلسة سابقة
       رسالة من الأرشيف — حرف أقدم لم يُراجَع منذ مدة (مراجعة متباعدة) */
    const mId = Progress.pendingMission(ep.id);
    missionEp = mId ? Episodes.get(mId) : null;
    const rId = Progress.reviewCandidate([ep.id, mId].filter(Boolean));
    reviewEp = rId && Sound.canPlay(Episodes.get(rId)?.sound) ? Episodes.get(rId) : null;
    const warmup = [missionEp && 'mission', reviewEp && 'review'].filter(Boolean);
    flow = [ep.flow[0], ...warmup, ...ep.flow.slice(1)];
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
  document.getElementById('dial-open').addEventListener('click', () => Kanaan.Panels.achievements());
  // العودة إلى الاستوديو: تبقى الحلقة الحالية وتقدّمها كما هو، و«ابدأ الاستماع» يعيد الطفل إليها
  document.getElementById('home-btn').addEventListener('click', () => { Sound.stop(); Sound.sfx('whoosh'); show(0); });
  paintSfx();

  Host.init();
  const params = new URLSearchParams(location.search);
  // المتابعة من أول رسالة لم تكتمل (أو اختيار حلقة محددة: ?ep=b)
  const firstOpen = Episodes.list().find((e) => !Progress.isDone(e.id)) || Episodes.list()[0];
  startEpisode(params.get('ep') || firstOpen.id);

  // للمعلم/المطوّر: Kanaan.debug.export() لتصدير السجل
  Kanaan.debug = { export: Progress.export, reset: Progress.reset, go: (n) => show(n) };
})();
