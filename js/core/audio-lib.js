/**
 * مكتبة الصوت — كل صوت في المحطة له «اسم» (cue) ثابت، والملف اختياري.
 *
 *   phonemes/<حرف>              صوت الحرف (بَ) — يُستخدم للحرف الهدف ولخيارات التمييز وصوت المقارنة
 *   listen/<حرف>                نموذج الاستماع الأول (بَ بَ بَ)
 *   words/<الكلمة دون تشكيل>     نطق كلمة (words/بيت)
 *   common/<مفتاح>              جملة لكنعان واحدة لكل الحروف (common/feedback.discrimination.correct)
 *   letters/<معرّف>/<مفتاح>      جملة لكنعان خاصة بحرف (letters/b/script.reveal)
 *
 * الملفات تُوضع في assets/audio/ بالمسار نفسه مكتوبًا بحروف لاتينية (fileKey: phonemes/ب ← phonemes/b.mp3)،
 * ثم يُشغَّل:  python3 tools/build_audio_manifest.py  لتحديث القائمة.
 * ما لا يوجد له ملف يُنطق بالصوت الآلي العربي في المتصفح — لا يتغير أي كود.
 * قائمة التسجيل الكاملة (كل اسم ونصه): node tools/recording_list.js
 */
Kanaan.AudioLib = (function () {
  /* أسماء الملفات بحروف لاتينية (ب → b) حتى تعمل على كل خادم وهاتف ونظام ملفات؛
     الاسم المنطقي يبقى عربيًا في الكود: phonemes/ب ← الملف phonemes/b.mp3 */
  const TR = { 'ا': 'a', 'أ': 'a2', 'إ': 'i2', 'آ': 'aa', 'ء': 'e2', 'ؤ': 'w2', 'ئ': 'y2', 'ى': 'a0', 'ة': 'h0',
    'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h7', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
    'س': 's', 'ش': 'sh', 'ص': 's9', 'ض': 'd9', 'ط': 't6', 'ظ': 'z6', 'ع': 'e3', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ـ': '' };
  const fileKey = (cue) => String(cue).replace(/[\u064B-\u0652\u0670]/g, '').replace(/[\u0621-\u064A\u0640]/g, (c) => (c in TR ? TR[c] : 'x')).replace(/\s+/g, '-');
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
    url: (cue) => (cue ? byCue.get(fileKey(cue)) || null : null),
    has: (cue) => byCue.has(fileKey(cue)),
    fileKey,
    plain,
    wordCue: (text) => `words/${plain(text)}`,
    phonemeCue: (letter) => `phonemes/${letter}`,
    lineCue: (ep, key) => (isCommon(key) ? `common/${key}` : `letters/${ep.id}/${key}`),
    lineText,
    count: () => byCue.size
  };
})();
