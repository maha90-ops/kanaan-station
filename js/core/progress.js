/**
 * التقييم التكويني — سجل محلي (localStorage) لكل حلقة.
 * لا يُعرض للطفل إلا كمؤشر «رحلتي»؛ التفاصيل للمعلم فقط.
 *
 * episodes[id].activities = {
 *   discrimination: { attempts, success, firstTry }
 *   pronunciation:  { attempts, completed, mode: 'mic'|'self-report', levels: [], best }
 *   wordBuilding:   { attempts, success, firstTry }
 *   meaning:        { attempts, success, firstTry }
 *   transfer:       { attempts, success, firstTry, channelsHeard }
 * }
 */
Kanaan.Progress = (function () {
  const KEY = 'kanaan-station:v1';
  let memory = { version: 1, episodes: {} }; // نسخة في الذاكرة إن تعذر التخزين

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) memory = JSON.parse(raw);
    } catch (e) { /* تخزين غير متاح: نعمل من الذاكرة */ }
    return memory;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch (e) { /* تجاهل */ }
  }
  load();

  function episode(id) {
    if (!memory.episodes[id]) {
      memory.episodes[id] = { startedAt: null, completedAt: null, runs: 0, activities: {} };
    }
    return memory.episodes[id];
  }

  function activity(epId, name) {
    const ep = episode(epId);
    if (!ep.activities[name]) ep.activities[name] = { attempts: 0, success: false, firstTry: null };
    return ep.activities[name];
  }

  return {
    /** بداية جولة جديدة في الحلقة (تصفير المحاولات مع الإبقاء على عدد الجولات) */
    start(epId) {
      const ep = episode(epId);
      ep.runs += 1;
      ep.startedAt = new Date().toISOString();
      ep.completedAt = null;
      ep.activities = {};
      save();
    },

    /** تسجيل محاولة في نشاط اختيار/تركيب */
    attempt(epId, name, success, extra) {
      const a = activity(epId, name);
      a.attempts += 1;
      if (a.firstTry === null) a.firstTry = !!success;
      if (success) a.success = true;
      if (extra) Object.assign(a, extra);
      save();
      return a;
    },

    /** تسجيل محاولة نطق */
    pronunciation(epId, result) {
      const a = activity(epId, 'pronunciation');
      a.attempts += 1;
      a.completed = true;
      a.mode = result.mode;
      a.levels = (a.levels || []).concat(result.level || 'self-report');
      const rank = { excellent: 3, close: 2, retry: 1 };
      if (!a.best || (rank[result.level] || 0) > (rank[a.best] || 0)) a.best = result.level || 'self-report';
      if (result.metrics) a.lastMetrics = result.metrics;
      save();
      return a;
    },

    patch(epId, name, data) { Object.assign(activity(epId, name), data); save(); },

    complete(epId) { episode(epId).completedAt = new Date().toISOString(); save(); },

    get(epId) { return episode(epId); },

    /** مراحل «رحلتي» المكتملة */
    stagesDone(epId) {
      const a = episode(epId).activities;
      const done = [];
      if (a.discrimination?.success) done.push('listen');
      if (a.discrimination?.success && a.revealed?.success) done.push('discover');
      if (a.pronunciation?.completed) done.push('speak');
      if (a.wordBuilding?.success) done.push('build');
      if (a.transfer?.success) done.push('apply');
      return done;
    },

    export: () => JSON.parse(JSON.stringify(memory)),
    reset() { memory = { version: 1, episodes: {} }; save(); }
  };
})();
