/**
 * سجل الحلقات (Episodes registry)
 * ---------------------------------
 * كل حرف = حلقة إذاعية مستقلة في ملف خاص داخل js/data/episodes/.
 * لإضافة حرف جديد: انسخ sh.js، غيّر البيانات، وأضف وسم <script> في index.html.
 * لا حاجة لتعديل الشاشات أو المحرّك.
 */
window.Kanaan = window.Kanaan || {};

Kanaan.Episodes = (function () {
  const store = new Map();

  // الحقول الإلزامية لكل حلقة — يُتحقق منها عند التسجيل لتجنّب أخطاء صامتة.
  const REQUIRED = [
    'id', 'letter', 'sound', 'exampleWord', 'phonemeActivity',
    'pronunciationActivity', 'wordBuildingActivity', 'meaningActivity',
    'transferActivity', 'feedback', 'script', 'flow'
  ];

  function register(episode) {
    const missing = REQUIRED.filter((k) => !(k in episode));
    if (missing.length) {
      console.error('[Kanaan] حلقة ناقصة:', episode.id, missing);
      return;
    }
    store.set(episode.id, Object.freeze(episode));
  }

  return {
    register,
    get: (id) => store.get(id),
    list: () => [...store.values()].sort((a, b) => (a.order || 0) - (b.order || 0)),
    next(id) {
      const all = this.list();
      const i = all.findIndex((e) => e.id === id);
      return i >= 0 ? all[i + 1] || null : null;
    }
  };
})();
