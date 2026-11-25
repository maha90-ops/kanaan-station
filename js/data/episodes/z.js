/**
 * الحلقة ٥ — «ز» — زَيْت
 * ز صوت احتكاكي مجهور: هواء بين الأسنان + اهتزاز الحنجرة: «ززززز».
 * يُولَّد صوتيًا (ضوضاء + طنين)، ويُقيَّم بطريقة evaluator: 'voicedFricative'.
 * المقارنة مع «س» — نفس المخرج لكن دون اهتزاز.
 */
Kanaan.Episodes.register({
  id: 'z',
  order: 5,
  title: 'الرسالة الخامسة',
  letter: 'ز',
  letterName: 'الزاي',

  sound: { label: 'زززز', audio: null, synth: { kind: 'voicedFricative', centerHz: 6500, q: 1.2, f0: 130, durationMs: 1400 } },

  exampleWord: {
    text: 'زَيْت', plain: 'زيت', letters: ['ز', 'ي', 'ت'], audio: null,
    image: { scene: 'olive-oil', alt: 'جرّة زجاجية فيها زيت زيتون ذهبي وبجانبها غصن زيتون' }
  },

  phonemeActivity: {
    options: ['ر', 'س', 'ز'], correct: 'ز',
    contrast: { letter: 'س', label: 'سسس', audio: null, synth: { kind: 'fricative', centerHz: 7200, q: 1.4, highpassHz: 5200, durationMs: 1100 } }
  },

  pronunciationActivity: {
    evaluator: 'voicedFricative',
    profile: { targetBandHz: [4000, 11000], competitorBandHz: [1000, 4000], minFricativeMs: 250, shortFricativeMs: 120 },
    tips: {
      short: 'أطِل الصوت هكذا: زززززز.',
      voiceless: 'صوتك يشبه «س». ضع يدك على رقبتك وانطق: زززز — هل تشعر بالاهتزاز؟',
      noHiss: 'قرّب أسنانك من بعضها ودع الهواء يمرّ بينها: زززز.',
      silent: 'لم يصلني صوت واضح. اقترب من الميكروفون وانطق: زززز.'
    }
  },

  wordBuildingActivity: { tiles: ['ت', 'ز', 'ي'], target: ['ز', 'ي', 'ت'] },

  transferActivity: {
    channels: [
      { word: 'سَمَك', startsWithTarget: false, startSound: 'س', audio: null },
      { word: 'زَهْرَة', startsWithTarget: true, startSound: 'ز', audio: null },
      { word: 'طَيْر', startsWithTarget: false, startSound: 'ط', audio: null }
    ]
  },

  script: { revealHint: 'انظر: فوق الحرف ز نقطة واحدة. بدونها يصبح ر.' }
});
