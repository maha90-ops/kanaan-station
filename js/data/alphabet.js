/**
 * فهرس الحروف العربية الـ٢٨ — الأساس الذي تُبنى عليه كل حلقة.
 *
 * لكل حرف:
 *   name      اسمه            cls      فئته الصوتية (تحدد طريقة التوليد والتقييم)
 *   voiced    مجهور؟           contrast أقرب صوت يخلط به الأطفال (للتمييز والدعامة)
 *   words     كلمات مقترحة مألوفة للطفل ومرتبطة بالبيئة الفلسطينية (تبدأ بالحرف)
 *
 * الفئات: fricative (احتكاكي) · stop (انفجاري) · nasal (أنفي) · liquid (مائع)
 *         affricate (مركّب) · guttural (حلقي) · glide (لين)
 *
 * الحلقة (js/data/episodes/*.js) ترث من هنا ما لا تحدده: الاسم، صوت الحرف،
 * أصوات خيارات التمييز، وطريقة تقييم النطق. وأشكال الحرف (أول/وسط/آخر) تُحسب تلقائيًا.
 */
Kanaan.Alphabet = (function () {
  const ROWS = [
    // حرف  الاسم      الفئة        مجهور  مقابل  كلمات
    ['ا', 'الألف', 'glide', true, 'ع', ['أَرْنَب', 'أَسَد', 'إِبْرِيق']],
    ['ب', 'الباء', 'stop', true, 'م', ['بَيْت', 'بَاب', 'بَطَّة']],
    ['ت', 'التاء', 'stop', false, 'د', ['تِين', 'تُفَّاح', 'تَمْر']],
    ['ث', 'الثاء', 'fricative', false, 'س', ['ثَوْب', 'ثَلْج', 'ثَعْلَب']],
    ['ج', 'الجيم', 'affricate', true, 'ش', ['جَمَل', 'جَبَل', 'جَزَر']],
    ['ح', 'الحاء', 'guttural', false, 'هـ', ['حَلِيب', 'حِصَان', 'حَمَامَة']],
    ['خ', 'الخاء', 'guttural', false, 'غ', ['خُبْز', 'خَرُوف', 'خِيَار']],
    ['د', 'الدال', 'stop', true, 'ت', ['دَار', 'دِيك', 'دُبّ']],
    ['ذ', 'الذال', 'fricative', true, 'ز', ['ذَهَب', 'ذُرَة', 'ذَيْل']],
    ['ر', 'الراء', 'liquid', true, 'ل', ['رُمَّان', 'رِيشَة', 'رَأْس']],
    ['ز', 'الزاي', 'fricative', true, 'س', ['زَيْت', 'زَيْتُون', 'زَهْرَة']],
    ['س', 'السين', 'fricative', false, 'ش', ['سَمَك', 'سُلَّم', 'سَيَّارَة']],
    ['ش', 'الشين', 'fricative', false, 'س', ['شَمْس', 'شَاي', 'شَجَرَة']],
    ['ص', 'الصاد', 'fricative', false, 'س', ['صَابُون', 'صَقْر', 'صُنْدُوق']],
    ['ض', 'الضاد', 'stop', true, 'د', ['ضِفْدَع', 'ضَوْء']],
    ['ط', 'الطاء', 'stop', false, 'ت', ['طَيْر', 'طَابَة', 'طَبْل']],
    ['ظ', 'الظاء', 'fricative', true, 'ذ', ['ظَرْف', 'ظِلّ']],
    ['ع', 'العين', 'guttural', true, 'أ', ['عِنَب', 'عَيْن', 'عُصْفُور']],
    ['غ', 'الغين', 'guttural', true, 'خ', ['غَيْمَة', 'غَزَال']],
    ['ف', 'الفاء', 'fricative', false, 'ث', ['فَرَاشَة', 'فِيل', 'فُسْتُق']],
    ['ق', 'القاف', 'stop', false, 'ك', ['قَمَر', 'قِطَّة', 'قَلَم']],
    ['ك', 'الكاف', 'stop', false, 'ق', ['كَعْك', 'كِتَاب', 'كُرْسِيّ']],
    ['ل', 'اللام', 'liquid', true, 'ر', ['لَيْمُون', 'لَوْز']],
    ['م', 'الميم', 'nasal', true, 'ن', ['مَوْز', 'مَاء', 'مِفْتَاح']],
    ['ن', 'النون', 'nasal', true, 'م', ['نَار', 'نَحْلَة', 'نَجْمَة']],
    ['هـ', 'الهاء', 'guttural', false, 'ح', ['هِلَال', 'هُدْهُد']],
    ['و', 'الواو', 'glide', true, 'ي', ['وَرْدَة', 'وَلَد']],
    ['ي', 'الياء', 'glide', true, 'و', ['يَد', 'يَمَامَة']]
  ];

  /** أصوات يمكن توليدها بدقة مقبولة دون تسجيل (البقية: تسجيل بشري أو صوت آلي مؤقت) */
  const SYNTH = {
    'ش': { label: 'ششش', synth: { kind: 'fricative', centerHz: 3000, q: 1.1, lowpassHz: 6200, durationMs: 1400 } },
    'س': { label: 'سسس', synth: { kind: 'fricative', centerHz: 7200, q: 1.4, highpassHz: 5200, durationMs: 1200 } },
    'ز': { label: 'زززز', synth: { kind: 'voicedFricative', centerHz: 6500, q: 1.2, f0: 130, durationMs: 1400 } },
    'ف': { label: 'فففف', synth: { kind: 'fricative', centerHz: 5200, q: 0.45, lowpassHz: 10000, durationMs: 1200 } },
    'م': { label: 'ممم', synth: { kind: 'hum', f0: 150, lowpassHz: 450, durationMs: 1400 } }
  };

  /** طريقة تقييم النطق الافتراضية حسب الحرف */
  const EVALUATOR = { 'ش': 'fricative', 'س': 'fricative', 'ز': 'voicedFricative', 'م': 'nasal', 'ن': 'nasal' };

  /** إعدادات التقييم الصوتي التقريبي للحروف التي يستطيع الجهاز تقديرها */
  const PROFILE = {
    'ش': { profile: { targetBandHz: [1700, 5200], competitorBandHz: [5200, 11000], minFricativeMs: 250, shortFricativeMs: 120 },
      tips: { short: 'أطِل الصوت هكذا: شـشـشـشـش.', competitor: 'صوتك يشبه «س». دوِّر شفتيك إلى الأمام وأرجع لسانك قليلًا.', voiced: 'ش صوت هواء هادئ بلا نغمة. ضع إصبعك على فمك كأنك تقول «اسكت»: شـشـشـش.' } },
    'س': { profile: { targetBandHz: [5200, 11000], competitorBandHz: [1700, 5200], minFricativeMs: 250, shortFricativeMs: 120 },
      tips: { short: 'أطِل الصوت هكذا: سسسسس.', competitor: 'صوتك يشبه «ش». ابتسم وقرّب أسنانك: سسسس.', voiced: 'س صوت هواء بلا نغمة: سسسس.' } },
    'ز': { profile: { targetBandHz: [4000, 11000], competitorBandHz: [1000, 4000], minFricativeMs: 250, shortFricativeMs: 120 },
      tips: { short: 'أطِل الصوت هكذا: زززززز.', voiceless: 'صوتك يشبه «س». ضع يدك على رقبتك وانطق: زززز — هل تشعر بالاهتزاز؟', noHiss: 'قرّب أسنانك من بعضها ودع الهواء يمرّ بينها: زززز.' } },
    'م': { profile: { targetBandHz: [1000, 3000], competitorBandHz: [3000, 8000], minHumMs: 300, shortHumMs: 120 },
      tips: { short: 'أطِل الصوت هكذا: ممممممم.', open: 'أغلق شفتيك جيدًا ودع الصوت يخرج من أنفك: ممممم.' } },
    'ن': { profile: { targetBandHz: [1000, 3000], competitorBandHz: [3000, 8000], minHumMs: 300, shortHumMs: 120 },
      tips: { short: 'أطِل الصوت هكذا: ننننن.', open: 'ضع لسانك خلف أسنانك العليا ودع الصوت يخرج من أنفك: ننننن.' } }
  };

  const NON_JOINING = 'اأإآدذرزوؤة';
  const byLetter = new Map(ROWS.map(([letter, name, cls, voiced, contrast, words]) => [letter, { letter, name, cls, voiced, contrast, words }]));

  /** صوت حرف: تسجيل ← توليد ← صوت آلي بالفتحة (بَ) */
  function soundOf(letter, audio = null) {
    const s = SYNTH[letter];
    const base = letter.replace('ـ', '');
    return s ? { audio, ...s } : { audio, label: `${base}َ`, tts: `${base}َ` };
  }

  /** أشكال الحرف في الكلمة: معزول · أول · وسط · آخر */
  function forms(letter) {
    const b = letter.replace('ـ', '');
    const joins = !NON_JOINING.includes(b);
    return { isolated: b, initial: joins ? `${b}ـ` : b, medial: joins ? `ـ${b}ـ` : `ـ${b}`, final: `ـ${b}` };
  }

  return {
    list: () => [...byLetter.values()],
    get: (letter) => byLetter.get(letter),
    soundOf,
    forms,
    evaluatorOf: (letter) => EVALUATOR[letter] || 'clarity',
    profileOf: (letter) => (PROFILE[letter] || {}).profile,
    tipsOf: (letter) => (PROFILE[letter] || {}).tips || {},
    joinsNext: (letter) => !NON_JOINING.includes(letter)
  };
})();
