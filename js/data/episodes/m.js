/**
 * الحلقة ٤ — «م» — مَوْز
 * م صوت أنفي مستمر (الشفتان مغلقتان والصوت يخرج من الأنف): «ممممم».
 * يُولَّد صوتيًا كطنين منخفض، ويُقيَّم آليًا بطريقة «الطنين» (evaluator: 'nasal').
 */
Kanaan.Episodes.register({
  id: 'm',
  order: 4,
  title: 'الرسالة الرابعة',
  letter: 'م',
  letterName: 'الميم',

  sound: { label: 'ممم', audio: null, synth: { kind: 'hum', f0: 150, lowpassHz: 450, durationMs: 1400 } },

  exampleWord: {
    text: 'مَوْز', plain: 'موز', letters: ['م', 'و', 'ز'], audio: null,
    image: { scene: 'bananas', alt: 'عنقود من حبات الموز الصفراء' }
  },

  // ن أنفي أيضًا — أقرب صوت مشابه
  phonemeActivity: { options: ['ن', 'م', 'ب'], correct: 'م', contrast: { letter: 'ن', label: 'نَ', audio: null, tts: 'نَ' } },

  pronunciationActivity: {
    evaluator: 'nasal',
    profile: { targetBandHz: [1000, 3000], competitorBandHz: [3000, 8000], minHumMs: 300, shortHumMs: 120 },
    tips: {
      short: 'أطِل الصوت هكذا: ممممممم.',
      open: 'أغلق شفتيك جيدًا ودع الصوت يخرج من أنفك: ممممم.',
      silent: 'لم يصلني صوت واضح. أغلق شفتيك وغنِّ بصوت أعلى: ممممم.'
    }
  },

  wordBuildingActivity: { tiles: ['ز', 'م', 'و'], target: ['م', 'و', 'ز'] },

  transferActivity: {
    channels: [
      { word: 'نَار', startsWithTarget: false, startSound: 'ن', audio: null },
      { word: 'بَاب', startsWithTarget: false, startSound: 'ب', audio: null },
      { word: 'مَاء', startsWithTarget: true, startSound: 'م', audio: null }
    ]
  },

  script: { revealHint: 'انظر: رأس الحرف م دائرة صغيرة، مثل فمك وهو مغلق.' }
});
