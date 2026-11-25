/**
 * سجل الحلقات (Episodes registry)
 * ---------------------------------
 * كل حرف = حلقة إذاعية مستقلة في ملف خاص داخل js/data/episodes/.
 * لإضافة حرف جديد: انسخ أي ملف حلقة، غيّر البيانات، وأضف وسم <script> في index.html.
 *
 * العبارات المشتركة (كلام كنعان والتغذية الراجعة) تُولَّد هنا تلقائيًا من الحرف والكلمة،
 * فملف الحلقة يحتوي فقط ما يخصّها. أي عبارة في ملف الحلقة تتغلّب على الافتراضي.
 */
window.Kanaan = window.Kanaan || {};

Kanaan.Episodes = (function () {
  const store = new Map();

  const REQUIRED = [
    'id', 'letter', 'sound', 'exampleWord', 'phonemeActivity',
    'pronunciationActivity', 'wordBuildingActivity', 'meaningActivity',
    'transferActivity', 'feedback', 'script', 'flow'
  ];

  // تُضاف شاشتا «تقرير المهمة» و«الأرشيف» تلقائيًا بعد welcome عند توفّر حروف سابقة (app.js)
  const FLOW = ['welcome', 'signal', 'reveal', 'speak', 'build', 'meaning', 'transfer', 'success', 'onair', 'message'];

  const POS_AR = { start: 'بداية', middle: 'وسط', end: 'نهاية' };

  /** العبارات الافتراضية — تُبنى من بيانات الحلقة نفسها */
  function defaults(ep) {
    const L = ep.letter;
    const S = ep.sound.label;
    const W = ep.exampleWord;
    const correctChannel = (ep.transferActivity.channels || []).find((c) => c.startsWithTarget) || {};
    return {
      script: {
        welcome: 'مرحبًا يا أصدقاء! أنا كنعان، مذيع محطة الحروف. وصلتني اليوم رسالة غامضة… لكن أحد الحروف اختفى منها! هل تساعدني في اكتشافه؟',
        signal: 'اسمع الإشارة جيدًا.',
        reveal: `لقد اكتشفنا الحرف السري: ${L}`,
        speak: `والآن أريد أن أسمع صوتك! انطق صوت الحرف ${L}.`,
        build: `الحرف ${L} يريد أن يجد أصدقاءه. ساعده في بناء كلمة.`,
        meaning: `${W.text}! أحسنت، بنيتَ كلمة ${W.plain}.`,
        transfer: `وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أي كلمة تبدأ بصوت ${L}.`,
        success: `رائع يا مستكشف الحروف! لقد فككتَ ${ep.title}.`
      },
      feedback: {
        discrimination: { correct: 'أحسنت! التقطتَ الإشارة الصحيحة.', retry: 'اقتربت! استمع مرة أخرى.' },
        discriminationScaffold: ep.phonemeActivity.contrast
          ? `استمع إلى الفرق: هذا صوت «${ep.phonemeActivity.contrast.letter}»… وهذا صوت الإشارة.` : '',
        pronunciation: {
          heard: 'استمعتُ إلى نطقك.',
          excellent: 'رائع! نطقك واضح 👏',
          close: 'محاولة جميلة! استمع إلى النموذج وحاول مرة أخرى.',
          retry: 'لنحاول معًا. استمع جيدًا ثم أعد النطق.',
          // للحروف التي لا يقيّمها الجهاز صوتيًا (ب، ت، ع): لا ندّعي حكمًا
          clear: 'سمعتُ صوتك بوضوح! استمع لصوتك وقارنه بالنموذج.'
        },
        build: { correct: 'رائع! بنيتَ كلمة.', retry: `اقتربت! ابدأ بالحرف الذي صوته ${S}.` },
        meaning: { correct: `نعم! نسمع صوت ${L} في ${POS_AR[W.position]} كلمة ${W.text}.`, retry: `استمع إلى الكلمة ببطء… أين تسمع صوت ${L}؟` },
        transfer: {
          correct: `أحسنت! «${correctChannel.word}» تبدأ بصوت ${L}.`,
          retry: 'هذه كلمة تبدأ بصوت آخر. استمع للقنوات مرة أخرى.'
        }
      },
      prompts: {
        phoneme: 'استمع جيدًا… أيُّ صوت سمعت؟',
        pronunciation: `انطق صوت الحرف ${L}`,
        build: `رتّب الحروف لتبني كلمة تبدأ بصوت ${L}.`,
        meaning: `أين تسمع صوت ${L} في كلمة ${W.text}؟`,
        transfer: `أيّ قناة تبدأ كلمتها بصوت ${L}؟`
      }
    };
  }

  /** دمج الافتراضي مع ما في الحلقة (ما في الحلقة يتغلّب) */
  function complete(src) {
    // ما لا تحدده الحلقة يُؤخذ من فهرس الحروف (js/data/alphabet.js)
    const A = Kanaan.Alphabet.get(src.letter) || {};
    const sound = src.sound || Kanaan.Alphabet.soundOf(src.letter);
    const W = src.exampleWord;
    const i = W.letters.indexOf(src.letter);
    const position = W.position || (i <= 0 ? 'start' : i === W.letters.length - 1 ? 'end' : 'middle');
    const pa = src.phonemeActivity || {};
    const contrast = pa.contrast || (A.contrast ? { letter: A.contrast, ...Kanaan.Alphabet.soundOf(A.contrast) } : null);
    // صوت كل خيار في نشاط التمييز (يُختار بالأذن لا بالعين)
    const sounds = {};
    (pa.options || []).forEach((l) => {
      sounds[l] = (pa.sounds && pa.sounds[l]) || (l === src.letter ? sound : contrast && contrast.letter === l ? contrast : Kanaan.Alphabet.soundOf(l));
    });
    const raw = {
      ...src,
      letterName: src.letterName || A.name,
      sound,
      forms: src.forms || Kanaan.Alphabet.forms(src.letter),
      exampleWord: { ...W, position },
      phonemeActivity: { ...pa, contrast, sounds }
    };
    const d = defaults(raw);
    const ep = { flow: FLOW, ...raw };
    ep.script = { ...d.script, ...(raw.script || {}) };
    const fb = raw.feedback || {};
    ep.feedback = { ...d.feedback, ...fb };
    ['discrimination', 'pronunciation', 'build', 'meaning', 'transfer'].forEach((k) => {
      ep.feedback[k] = { ...d.feedback[k], ...(fb[k] || {}) };
    });
    const withPrompt = (key, p) => ({ prompt: d.prompts[p], ...raw[key] });
    ep.phonemeActivity = withPrompt('phonemeActivity', 'phoneme');
    ep.pronunciationActivity = { maxRecordMs: 4000, evaluator: Kanaan.Alphabet.evaluatorOf(raw.letter), tips: {}, ...withPrompt('pronunciationActivity', 'pronunciation') };
    ep.wordBuildingActivity = withPrompt('wordBuildingActivity', 'build');
    ep.meaningActivity = withPrompt('meaningActivity', 'meaning');
    ep.transferActivity = withPrompt('transferActivity', 'transfer');
    return ep;
  }

  function register(raw) {
    const ep = complete(raw);
    const missing = REQUIRED.filter((k) => !(k in ep));
    if (missing.length) {
      console.error('[Kanaan] حلقة ناقصة:', ep.id, missing);
      return;
    }
    const w = ep.wordBuildingActivity;
    if ([...w.tiles].sort().join() !== [...w.target].sort().join()) {
      console.error('[Kanaan] حروف البناء لا تطابق الكلمة:', ep.id);
    }
    store.set(ep.id, Object.freeze(ep));
  }

  return {
    register,
    get: (id) => store.get(id),
    list: () => [...store.values()].sort((a, b) => (a.order || 0) - (b.order || 0)),
    next(id) {
      const all = this.list();
      const i = all.findIndex((e) => e.id === id);
      return i >= 0 ? all[i + 1] || null : null;
    }
  };
})();
