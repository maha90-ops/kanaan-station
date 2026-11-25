/**
 * الحلقة ١ — «ش» — شَمْس
 *
 * بنية كل حلقة:
 *  letter / letterName     الحرف واسمه
 *  sound                   صوت الحرف: audio (تسجيل بشري) ← synth (توليد) ← tts (صوت آلي)
 *  exampleWord             الكلمة الهدف + حروفها + مشهدها + صوتها
 *  phonemeActivity         التمييز السمعي: خيارات + صوت مقارنة (دعامة)
 *  pronunciationActivity   النطق: evaluator يحدد طريقة التقييم التقريبي
 *  wordBuildingActivity    الحروف مبعثرة → الكلمة
 *  meaningActivity         أين تسمع الصوت؟ (كلمات مألوفة)
 *  transferActivity        قنوات بكلمات جديدة تُسمع قبل أن تُرى
 *  script / feedback       اختياري: ما لم يُذكر يُولَّد تلقائيًا في registry.js
 *
 * كل حقل audio: null الآن — يُملأ بمسار التسجيل البشري (مثل 'assets/audio/sh/phoneme.mp3').
 */
Kanaan.Episodes.register({
  id: 'sh',
  order: 1,
  title: 'الرسالة الأولى',
  letter: 'ش',
  letterName: 'الشِّين',

  // صوت احتكاكي مهموس طاقته بين ~٢ و~٥ ك.هـ — يُولَّد صوتيًا بدقة جيدة
  sound: { label: 'ششش', audio: null, synth: { kind: 'fricative', centerHz: 3000, q: 1.1, lowpassHz: 6200, durationMs: 1400 } },

  exampleWord: {
    text: 'شَمْس', plain: 'شمس', letters: ['ش', 'م', 'س'], audio: null,
    image: { scene: 'sun-hills', alt: 'شمس دافئة تشرق فوق تلال فيها شجرة زيتون وبيت من حجر' }
  },

  phonemeActivity: {
    options: ['س', 'ش', 'ج'], correct: 'ش',
    contrast: { letter: 'س', label: 'سسس', audio: null, synth: { kind: 'fricative', centerHz: 7200, q: 1.4, highpassHz: 5200, durationMs: 1100 } }
  },

  pronunciationActivity: {
    evaluator: 'fricative',
    profile: { targetBandHz: [1700, 5200], competitorBandHz: [5200, 11000], minFricativeMs: 250, shortFricativeMs: 120 },
    tips: {
      short: 'أطِل الصوت هكذا: شـشـشـشـش.',
      competitor: 'صوتك يشبه «س». دوِّر شفتيك إلى الأمام وأرجع لسانك قليلًا.',
      silent: 'لم يصلني صوت واضح. اقترب من الميكروفون وانطق بصوت أعلى.',
      voiced: 'ش صوت هواء هادئ بلا نغمة. ضع إصبعك على فمك كأنك تقول «اسكت»: شـشـشـش.'
    }
  },

  wordBuildingActivity: { tiles: ['س', 'ش', 'م'], target: ['ش', 'م', 'س'] },

  meaningActivity: {
    options: [{ word: 'بَيْت', has: false }, { word: 'شَمْس', has: true }, { word: 'قَمَر', has: false }]
  },

  transferActivity: {
    channels: [
      { word: 'تِين', startsWithTarget: false, startSound: 'ت', audio: null },
      { word: 'سَمَك', startsWithTarget: false, startSound: 'س', audio: null },
      { word: 'شَاي', startsWithTarget: true, startSound: 'ش', audio: null }
    ]
  },

  script: { revealHint: 'انظر: فوق الحرف ش ثلاث نقاط.' }
});
