/**
 * أرشيف المحطة — تسجيلات الطفل محفوظة على جهازه فقط (IndexedDB).
 *   voice:<ep>    آخر تسجيل لنطق صوت الحرف (يُبثّ في «على الهواء» ولوحة الترددات)
 *   mission:<ep>  اسم الشيء الذي وجده الطفل في مهمة خارج الشاشة
 * إن تعذّر التخزين (تصفّح خاص مثلًا) تعمل التجربة كاملة دون أرشيف.
 */
Kanaan.Archive = (function () {
  const DB = 'kanaan-station', STORE = 'voices';
  let dbp = null;

  function db() {
    if (!dbp) {
      dbp = new Promise((resolve) => {
        try {
          const req = indexedDB.open(DB, 1);
          req.onupgradeneeded = () => req.result.createObjectStore(STORE);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(null);
        } catch (e) { resolve(null); }
      });
    }
    return dbp;
  }

  async function tx(mode, fn) {
    const d = await db();
    if (!d) return null;
    return new Promise((resolve) => {
      try {
        const t = d.transaction(STORE, mode);
        const req = fn(t.objectStore(STORE));
        t.oncomplete = () => resolve(req ? req.result : true);
        t.onerror = () => resolve(null);
      } catch (e) { resolve(null); }
    });
  }

  return {
    save: (key, blob) => (blob ? tx('readwrite', (s) => s.put({ blob, at: Date.now() }, key)) : Promise.resolve(null)),
    async get(key) { const r = await tx('readonly', (s) => s.get(key)); return r || null; },
    /** تشغيل تسجيل محفوظ؛ يعيد false إن لم يوجد */
    async play(key) {
      const r = await this.get(key);
      if (!r) return false;
      const url = URL.createObjectURL(r.blob);
      await Kanaan.Sound.playClip(url, { who: 'radio' }); // يحرّك موجات الراديو
      URL.revokeObjectURL(url);
      return true;
    },
    clear: () => tx('readwrite', (s) => s.clear())
  };
})();
