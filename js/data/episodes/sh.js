/**
 * الحلقة ١ — حرف الشين «ش» — الكلمة الهدف «شَمْس»
 *
 * بنية الحلقة (مطابقة لكل الحروف القادمة):
 *  letter                 الحرف المعزول
 *  sound                  الصوت (ملف مسجّل إن وُجد، وإلا يُولَّد صوتيًا)
 *  exampleWord            الكلمة الهدف + حروفها + صورتها + صوتها
 *  phonemeActivity        التمييز السمعي (الصوت دون صورة أو حرف)
 *  pronunciationActivity  النطق + ملف الصوت الصوتي (acoustic profile) للتقييم التقريبي
 *  wordBuildingActivity   تركيب الكلمة من حروفها
 *  meaningActivity        اكتشاف المعنى + تحديد الكلمة التي فيها الصوت
 *  transferActivity       نقل التعلم إلى كلمات جديدة (صوت أولًا ثم كشف)
 *  feedback               عبارات التغذية الراجعة (إيجابية دائمًا)
 *  script                 كلام كنعان في كل مرحلة
 *  flow                   ترتيب الشاشات
 *
 * حقول audio: ضع مسار ملف mp3 مسجّل بصوت بشري عند توفره (أفضل من الصوت الآلي).
 */
Kanaan.Episodes.register({
  id: 'sh',
  order: 1,
  title: 'الرسالة الأولى',
  letter: 'ش',
  letterName: 'الشِّين',

  sound: {
    label: 'ششش',
    audio: null, // مثال: 'assets/audio/sh/phoneme.mp3'
    // توليد صوتي احتياطي: صوت احتكاكي مهموس طاقته بين ~٢ و~٥ كيلوهرتز
    synth: { kind: 'fricative', centerHz: 3000, q: 1.1, lowpassHz: 6200, durationMs: 1400 }
  },

  exampleWord: {
    text: 'شَمْس',
    plain: 'شمس',
    letters: ['ش', 'م', 'س'],
    // تقطيع صوتي يُستخدم كدعامة: ش… م… س… شَمْس
    segments: ['شْ', 'مْ', 'سْ'],
    audio: null,
    image: { scene: 'sun-hills', alt: 'شمس دافئة تشرق فوق تلال فيها شجرة زيتون وبيت من حجر' }
  },

  // الشاشة ٢: التقط الإشارة
  phonemeActivity: {
    prompt: 'ما الصوت الذي سمعتَه؟',
    options: ['س', 'ش', 'ج'],
    correct: 'ش',
    // دعامة تمييز عند تكرار المحاولة: مقارنة الصوت الهدف بأقرب صوت مشابه
    contrast: {
      letter: 'س',
      label: 'سسس',
      synth: { kind: 'fricative', centerHz: 7200, q: 1.4, highpassHz: 5200, durationMs: 1100 }
    }
  },

  // الشاشة ٤: الآن دورك
  pronunciationActivity: {
    prompt: 'انطق صوت الحرف ش',
    maxRecordMs: 4000,
    // ملف تقريبي: الشين احتكاكي مهموس طاقته أدنى من السين
    profile: {
      targetBandHz: [1700, 5200],   // نطاق الطاقة المتوقع للشين
      competitorBandHz: [5200, 11000], // نطاق السين (الخلط الأشيع)
      minFricativeMs: 250,           // أطِل الصوت: ششششش
      shortFricativeMs: 120
    },
    tips: {
      short: 'أطِل الصوت هكذا: شـشـشـشـش.',
      competitor: 'صوتك يشبه «س». دوِّر شفتيك إلى الأمام وأرجع لسانك قليلًا.',
      silent: 'لم يصلني صوت واضح. اقترب من الميكروفون وانطق بصوت أعلى.',
      // سمعنا صوتًا بنغمة (ربما اسم الحرف «شين» أو حرف علة) لا هواءً مهموسًا
      voiced: 'ش صوت هواء هادئ بلا نغمة. ضع إصبعك على فمك كأنك تقول «اسكت»: شـشـشـش.'
    }
  },

  // الشاشة ٥: ابنِ الكلمة
  wordBuildingActivity: {
    prompt: 'رتّب الحروف لتبني كلمة تبدأ بصوت ش.',
    tiles: ['س', 'ش', 'م'], // ترتيب مبعثر مقصود (ليس ترتيب الكلمة)
    target: ['ش', 'م', 'س']
  },

  // الشاشة ٦: اكتشاف المعنى
  meaningActivity: {
    prompt: 'أين تسمع صوت ش؟',
    options: [
      { word: 'بَيْت', has: false },
      { word: 'شَمْس', has: true },
      { word: 'قَمَر', has: false }
    ]
  },

  // الشاشة ٧: مهمة انتقالية — كلمات جديدة لم تُدرَّس، تُسمع قبل أن تُرى
  transferActivity: {
    prompt: 'أيّ قناة تبدأ كلمتها بصوت ش؟',
    channels: [
      { word: 'تِين', startsWithTarget: false, startSound: 'ت', audio: null },
      { word: 'سَمَك', startsWithTarget: false, startSound: 'س', audio: null },
      { word: 'شَاي', startsWithTarget: true, startSound: 'ش', audio: null }
    ]
  },

  feedback: {
    discrimination: { correct: 'أحسنت! التقطتَ الإشارة الصحيحة.', retry: 'اقتربت! استمع مرة أخرى.' },
    discriminationScaffold: 'استمع إلى الفرق: هذا صوت «س»… وهذا صوت الإشارة.',
    pronunciation: {
      heard: 'استمعتُ إلى نطقك.',
      excellent: 'رائع! نطقك واضح.',
      close: 'محاولة جميلة! استمع إلى النموذج وحاول مرة أخرى.',
      retry: 'لنحاول معًا. استمع جيدًا ثم أعد النطق.'
    },
    build: { correct: 'رائع! بنيتَ كلمة.', retry: 'اقتربت! ابدأ بالحرف الذي صوته ششش.' },
    meaning: { correct: 'نعم! في كلمة شَمْس صوت ش.', retry: 'استمع إلى الكلمة… هل فيها ششش؟' },
    transfer: { correct: 'أحسنت! «شَاي» تبدأ بصوت ش.', retry: 'هذه كلمة تبدأ بصوت آخر. استمع للقنوات مرة أخرى.' }
  },

  script: {
    welcome: 'مرحبًا يا أصدقاء! أنا كنعان، مذيع محطة الحروف. وصلتني اليوم رسالة غامضة… لكن أحد الحروف اختفى منها! هل تساعدني في اكتشافه؟',
    signal: 'اسمع الإشارة جيدًا.',
    reveal: 'لقد اكتشفنا الحرف السري: ش',
    revealHint: 'انظر: فوق الحرف ش ثلاث نقاط.',
    speak: 'والآن أريد أن أسمع صوتك! انطق صوت الحرف ش.',
    build: 'الحرف ش يريد أن يجد أصدقاءه. ساعده في بناء كلمة.',
    meaning: 'شَمْس! تبدأ كلمة شمس بصوت ش.',
    transfer: 'وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أي كلمة تبدأ بصوت ش.',
    success: 'رائع يا مستكشف الحروف! لقد فككتَ الرسالة الأولى.'
  },

  flow: ['welcome', 'signal', 'reveal', 'speak', 'build', 'meaning', 'transfer', 'success']
});
