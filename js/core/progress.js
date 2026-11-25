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
      const rank = { excellent: 3, clear: 2, close: 2, retry: 1 };
      if (!a.best || (rank[result.level] || 0) > (rank[a.best] || 0)) a.best = result.level || 'self-report';
      if (result.metrics) a.lastMetrics = result.metrics;
      save();
      return a;
    },

    patch(epId, name, data) { Object.assign(activity(epId, name), data); save(); },

    complete(epId) {
      const ep = episode(epId);
      ep.completedAt = new Date().toISOString();
      ep.everCompleted = true; // لا يُمسح عند إعادة الحلقة
      save();
    },

    isDone(epId) { return !!memory.episodes[epId]?.everCompleted; },

    /* ---- مهمة خارج الشاشة ---- */
    assignMission(epId) {
      memory.missions = memory.missions || {};
      const m = memory.missions[epId];
      if (!m || m.reportedAt) memory.missions[epId] = { assignedAt: Date.now(), reportedAt: null, found: null };
      save();
    },
    /** مهمة تنتظر التقرير: أُعطيت قبل ٢٠ دقيقة على الأقل (أي في جلسة سابقة) */
    pendingMission(currentId, minAgeMs = 20 * 60 * 1000) {
      const ms = memory.missions || {};
      const open = Object.entries(ms)
        .filter(([id, m]) => id !== currentId && !m.reportedAt && Date.now() - m.assignedAt >= minAgeMs)
        .sort((a, b) => b[1].assignedAt - a[1].assignedAt);
      return open.length ? open[0][0] : null;
    },
    reportMission(epId, found) {
      const m = (memory.missions || {})[epId];
      if (m) { m.reportedAt = Date.now(); m.found = found; save(); }
    },

    /* ---- مراجعة متباعدة ---- */
    reviewed(epId) { memory.reviewedAt = memory.reviewedAt || {}; memory.reviewedAt[epId] = Date.now(); save(); },
    /** أقدم حرف مكتمل لم يُراجَع مؤخرًا (عدا المستبعَدين) */
    reviewCandidate(excludeIds) {
      const r = memory.reviewedAt || {};
      const done = Object.keys(memory.episodes).filter((id) => memory.episodes[id].everCompleted && !excludeIds.includes(id));
      done.sort((a, b) => (r[a] || 0) - (r[b] || 0));
      return done[0] || null;
    },

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
    reset() { memory = { version: 1, episodes: {} }; save(); if (Kanaan.Archive) Kanaan.Archive.clear(); }
  };
})();
