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
 *  meaningActivity         اختياري: موضع الصوت في الكلمة يُحسب تلقائيًا (بداية/وسط/نهاية)
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

  // التمييز السمعي: ثلاثة أصوات احتكاكية متقاربة تُسمع ولا تُرى (س · ش · ز)
  phonemeActivity: { options: ['س', 'ش', 'ز'], correct: 'ش' },

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

  transferActivity: {
    channels: [
      { word: 'تِين', startsWithTarget: false, startSound: 'ت', audio: null },
      { word: 'سَمَك', startsWithTarget: false, startSound: 'س', audio: null },
      { word: 'شَاي', startsWithTarget: true, startSound: 'ش', audio: null }
    ]
  },

  script: { revealHint: 'انظر: فوق الحرف ش ثلاث نقاط.' }
});
