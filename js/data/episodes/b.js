/**
 * الحلقة ٢ — «ب» — بَيْت
 * ب صوت انفجاري (يُغلق الشفتان ثم ينفتحان) — لا يمكن توليده بالضوضاء،
 * فيُستخدم الصوت الآلي «بَ» مؤقتًا حتى يصل التسجيل البشري.
 * التقييم: «وضوح» فقط (evaluator: 'clarity') — لا ندّعي تمييز ب من غيره آليًا.
 */
Kanaan.Episodes.register({
  id: 'b',
  order: 2,
  title: 'الرسالة الثانية',
  letter: 'ب',
  letterName: 'الباء',

  sound: { label: 'بَ', audio: null, tts: 'بَ' },

  exampleWord: {
    text: 'بَيْت', plain: 'بيت', letters: ['ب', 'ي', 'ت'], audio: null,
    image: { scene: 'stone-house', alt: 'بيت فلسطيني من حجر له باب مقوّس ونوافذ، وبجانبه شجرة زيتون' }
  },

  // م أقرب صوت لـ ب (كلاهما بالشفتين) — هو صوت المقارنة
  phonemeActivity: { options: ['ت', 'ب', 'م'], correct: 'ب', contrast: { letter: 'م', label: 'مَ', audio: null, tts: 'مَ' } },

  pronunciationActivity: {
    evaluator: 'clarity',
    tips: { silent: 'لم يصلني صوت واضح. أغلق شفتيك ثم افتحهما بقوة: بَ.' }
  },

  wordBuildingActivity: { tiles: ['ت', 'ب', 'ي'], target: ['ب', 'ي', 'ت'] },

  transferActivity: {
    channels: [
      { word: 'بَاب', startsWithTarget: true, startSound: 'ب', audio: null },
      { word: 'مَاء', startsWithTarget: false, startSound: 'م', audio: null },
      { word: 'دَار', startsWithTarget: false, startSound: 'د', audio: null }
    ]
  },

  script: { revealHint: 'انظر: تحت الحرف ب نقطة واحدة.' }
});
