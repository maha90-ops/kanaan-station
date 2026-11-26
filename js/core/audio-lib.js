/**
 * مكتبة الصوت — كل صوت في المحطة له «اسم» (cue) ثابت، والملف اختياري.
 *
 *   phonemes/<حرف>              صوت الحرف (بَ) — يُستخدم للحرف الهدف ولخيارات التمييز وصوت المقارنة
 *   listen/<حرف>                نموذج الاستماع الأول (بَ بَ بَ)
 *   words/<الكلمة دون تشكيل>     نطق كلمة (words/بيت)
 *   common/<مفتاح>              جملة لكنعان واحدة لكل الحروف (common/feedback.discrimination.correct)
 *   letters/<معرّف>/<مفتاح>      جملة لكنعان خاصة بحرف (letters/b/script.reveal)
 *
 * الملفات تُوضع في assets/audio/ بالمسار نفسه (mp3 أو m4a أو ogg أو wav)،
 * ثم يُشغَّل:  python3 tools/build_audio_manifest.py  لتحديث القائمة.
 * ما لا يوجد له ملف يُنطق بالصوت الآلي العربي في المتصفح — لا يتغير أي كود.
 * قائمة التسجيل الكاملة (كل اسم ونصه): node tools/recording_list.js
 */
Kanaan.AudioLib = (function () {
  const M = window.Kanaan.AudioManifest || { base: 'assets/audio/', files: [] };
  const byCue = new Map();
  M.files.forEach((f) => byCue.set(f.replace(/\.(mp3|m4a|ogg|wav)$/i, ''), M.base + f));

  const plain = (t) => String(t).replace(/[ً-ْٰ]/g, '').trim();

  /** هل نص هذا المفتاح واحد في كل الحروف؟ إذن تكفيه جملة مشتركة واحدة */
  function isCommon(key) {
    const eps = Kanaan.Episodes.list();
    const texts = new Set(eps.map((e) => lineText(e, key)));
    return texts.size === 1;
  }

  function lineText(ep, key) {
    return key.split('.').reduce((o, k) => (o == null ? o : o[k]), ep);
  }

  return {
    url: (cue) => (cue ? byCue.get(cue) || null : null),
    has: (cue) => byCue.has(cue),
    plain,
    wordCue: (text) => `words/${plain(text)}`,
    phonemeCue: (letter) => `phonemes/${letter}`,
    lineCue: (ep, key) => (isCommon(key) ? `common/${key}` : `letters/${ep.id}/${key}`),
    lineText,
    count: () => byCue.size
  };
})();
