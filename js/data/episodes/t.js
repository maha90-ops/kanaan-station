/**
 * الحلقة ٣ — «ت» — تِين
 * ت صوت انفجاري مهموس (طرف اللسان خلف الأسنان). المقارنة مع «د» (نظيره المجهور).
 */
Kanaan.Episodes.register({
  id: 't',
  order: 3,
  title: 'الرسالة الثالثة',
  letter: 'ت',
  letterName: 'التاء',

  sound: { label: 'تَ', audio: null, tts: 'تَ' },

  exampleWord: {
    text: 'تِين', plain: 'تين', letters: ['ت', 'ي', 'ن'], audio: null,
    image: { scene: 'figs', alt: 'طبق فيه ثمار تين بنفسجية وورقة تين خضراء' }
  },

  phonemeActivity: { options: ['د', 'ك', 'ت'], correct: 'ت', contrast: { letter: 'د', label: 'دَ', audio: null, tts: 'دَ' } },

  pronunciationActivity: {
    evaluator: 'clarity',
    tips: { silent: 'لم يصلني صوت واضح. ضع طرف لسانك خلف أسنانك ثم أبعده: تَ.' }
  },

  wordBuildingActivity: { tiles: ['ن', 'ي', 'ت'], target: ['ت', 'ي', 'ن'] },

  meaningActivity: {
    options: [{ word: 'تِين', has: true }, { word: 'شَمْس', has: false }, { word: 'قَمَر', has: false }]
  },

  transferActivity: {
    channels: [
      { word: 'دَار', startsWithTarget: false, startSound: 'د', audio: null },
      { word: 'تُفَّاح', startsWithTarget: true, startSound: 'ت', audio: null },
      { word: 'كَعْك', startsWithTarget: false, startSound: 'ك', audio: null }
    ]
  },

  script: { revealHint: 'انظر: فوق الحرف ت نقطتان.' }
});
