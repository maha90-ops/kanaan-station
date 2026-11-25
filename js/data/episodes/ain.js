/**
 * الحلقة ٦ — «ع» — عِنَب
 * ع صوت حلقي — لا يمكن توليده ولا تقييمه آليًا بدقة؛ صوت آلي مؤقت + تقييم «وضوح».
 * المقارنة مع «أ» (الخلط الأشيع عند الأطفال).
 */
Kanaan.Episodes.register({
  id: 'ain',
  order: 6,
  title: 'الرسالة السادسة',
  letter: 'ع',
  letterName: 'العين',

  sound: { label: 'عَ', audio: null, tts: 'عَ' },

  exampleWord: {
    text: 'عِنَب', plain: 'عنب', letters: ['ع', 'ن', 'ب'], audio: null,
    image: { scene: 'grapes', alt: 'عنقود عنب بنفسجي مع ورقة عنب خضراء' }
  },

  phonemeActivity: { options: ['أ', 'ح', 'ع'], correct: 'ع', contrast: { letter: 'أ', label: 'أَ', audio: null, tts: 'أَ' } },

  pronunciationActivity: {
    evaluator: 'clarity',
    tips: { silent: 'لم يصلني صوت واضح. الصوت يخرج من وسط حلقك: عَ.' }
  },

  wordBuildingActivity: { tiles: ['ب', 'ع', 'ن'], target: ['ع', 'ن', 'ب'] },

  transferActivity: {
    channels: [
      { word: 'أَرْنَب', startsWithTarget: false, startSound: 'أ', audio: null },
      { word: 'دَار', startsWithTarget: false, startSound: 'د', audio: null },
      { word: 'عَيْن', startsWithTarget: true, startSound: 'ع', audio: null }
    ]
  },

  script: { revealHint: 'انظر: رأس الحرف ع مفتوح مثل فم صغير.' }
});
