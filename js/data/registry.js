/**
 * سجل الحروف (Letters registry)
 * --------------------------------
 * كل حرف = ملف بيانات صغير في js/data/letters/ (لا أنشطة مكتوبة يدويًا لكل حرف).
 * هذا الملف يحوّل بيانات الحرف إلى «حلقة» كاملة يقرؤها قالب الأنشطة الواحد:
 *   أستمع → أميّز → أكتشف → أنطق → أبني → أكتب → أوظّف
 *
 * ما لا يحدده ملف الحرف يُؤخذ من فهرس الحروف (alphabet.js) أو يُولَّد هنا:
 * الاسم، الصوت، أصوات الخيارات، طريقة تقييم النطق، ترتيب البطاقات المبعثرة،
 * الحرف الأول من كلمات النقل، وكل عبارات كنعان والتغذية الراجعة.
 * ترتيب الحروف ومجموعاتها في js/data/curriculum.js (يُعدَّل دون لمس الحروف).
 *
 * شكل ملف الحرف:
 *   Kanaan.Letters.add({
 *     id: 'baa', letter: 'ب',
 *     word: { text: 'بَيْت', letters: ['ب','ي','ت'], scene: 'stone-house', alt: '…' },
 *     options: ['ت','ب','م'],                       // تمييز سمعي (أصوات)
 *     transfer: [['بَاب', true], ['مَاء', false], ['دَار', false]],
 *     writing: { strokes: ['M…'], dots: [[x,y]] },   // اختياري: بدونه يُتتبَّع شكل الخط نفسه
 *     revealHint: 'انظر: تحت الحرف ب نقطة واحدة.'
 *   });
 */
window.Kanaan = window.Kanaan || {};

Kanaan.Episodes = (function () {
  const store = new Map();

  const FLOW = ['welcome', 'listen', 'signal', 'reveal', 'speak', 'build', 'write', 'position', 'transfer', 'success', 'onair', 'message'];
  const POS_AR = { start: 'بداية', middle: 'وسط', end: 'نهاية' };
  const ORD = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة', 'السابعة', 'الثامنة', 'التاسعة', 'العاشرة',
    'الحادية عشرة', 'الثانية عشرة', 'الثالثة عشرة', 'الرابعة عشرة', 'الخامسة عشرة', 'السادسة عشرة', 'السابعة عشرة',
    'الثامنة عشرة', 'التاسعة عشرة', 'العشرون', 'الحادية والعشرون', 'الثانية والعشرون', 'الثالثة والعشرون',
    'الرابعة والعشرون', 'الخامسة والعشرون', 'السادسة والعشرون', 'السابعة والعشرون', 'الثامنة والعشرون'];

  const strip = (t) => String(t).replace(/[ً-ْٰ]/g, '');

  /** بطاقات مبعثرة: إزاحة دائرية لا تترك أي حرف في مكانه الصحيح */
  function scramble(letters) {
    if (letters.length < 2) return letters.slice();
    for (let k = 1; k < letters.length; k++) {
      const t = letters.map((_, i) => letters[(i + k) % letters.length]);
      if (t.every((l, i) => l !== letters[i])) return t;
    }
    return letters.slice().reverse();
  }

  /** عبارات كنعان والتغذية الراجعة — كلها مبنية من بيانات الحرف */
  function defaults(ep) {
    const L = ep.letter, W = ep.exampleWord, S = ep.sound.label;
    const correct = ep.transferActivity.channels.find((c) => c.startsWithTarget) || {};
    return {
      script: {
        welcome: 'مرحبًا يا أصدقاء! أنا كنعان، مذيع محطة الحروف. وصلتني اليوم رسالة غامضة… لكن أحد الحروف اختفى منها! هل تساعدني في اكتشافه؟',
        go: 'هيا نستمع!',
        listenIntro: 'استمع جيدًا… هناك صوت يختبئ في محطة الحروف.',
        listenAfter: 'هل سمعته؟ لنكتشف أيّ صوت هو.',
        signal: 'اضغط على كل صوت لتسمعه، ثم اختر الصوت الذي سمعته.',
        reveal: 'أحسنت! لقد اكتشفت الحرف.',
        speak: `الآن دورك! انطق صوت الحرف ${L}.`,
        build: 'لنَبْنِ كلمة! رتّب الحروف لتبدأ الكلمة بصوت ' + L + '.',
        built: `رائع! لقد بنيت كلمة ${W.text}.`,
        write: `لنكتب حرف ${L}! ابدأ من النقطة الخضراء واتبع السهم.`,
        write2: 'الآن أكمل الحرف. النقاط أقل هذه المرة.',
        write3: 'والآن اكتب الحرف بنفسك.',
        transfer: `وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أيّ كلمة تبدأ بصوت ${L}.`,
        success: `رائع يا مستكشف الحروف! لقد فككتَ ${ep.title}.`
      },
      feedback: {
        discrimination: { correct: 'أحسنت! لقد ميّزت الصوت.', retry: 'استمع مرة أخرى وحاول.' },
        discriminationScaffold: ep.phonemeActivity.contrast
          ? `استمع إلى الفرق: هذا صوت «${ep.phonemeActivity.contrast.letter}»… وهذا الصوت الذي سمعته.` : '',
        pronunciation: {
          heard: 'استمعتُ إلى نطقك.',
          excellent: 'رائع! نطقك واضح.',
          close: 'محاولة جميلة! استمع إلى النموذج وحاول مرة أخرى.',
          retry: 'لنحاول معًا. استمع جيدًا ثم أعد النطق.',
          clear: 'سمعتُ صوتك بوضوح! استمع لصوتك وقارنه بالنموذج.'
        },
        build: { correct: `رائع! لقد بنيت كلمة ${W.text}.`, retry: `اقتربت! ابدأ بالحرف الذي صوته ${S}.` },
        writing: { excellent: 'ممتاز! لقد كتبت الحرف بنفسك.', traced: 'أحسنت! تتبّعت الحرف جيدًا.', retry: 'محاولة جميلة، لنحاول مرة أخرى.' },
        meaning: { correct: `نعم! نسمع صوت ${L} في ${POS_AR[W.position]} كلمة ${W.text}.`, retry: `استمع إلى الكلمة ببطء… أين تسمع صوت ${L}؟` },
        transfer: { correct: `أحسنت! «${correct.word}» تبدأ بصوت ${L}.`, retry: 'هذه كلمة تبدأ بصوت آخر. استمع للقنوات مرة أخرى.' }
      },
      prompts: {
        phoneme: 'أيُّ صوت سمعت؟',
        pronunciation: `انطق صوت الحرف ${L}`,
        build: `رتّب الحروف لتبني كلمة تبدأ بصوت ${L}.`,
        meaning: `أين تسمع صوت ${L} في كلمة ${W.text}؟`,
        transfer: `أيّ قناة تبدأ كلمتها بصوت ${L}؟`
      }
    };
  }

  /** بيانات الحرف المختصرة → حلقة كاملة */
  function build(src, index) {
    const A = Kanaan.Alphabet.get(src.letter) || {};
    const wordLetter = src.wordLetter || src.letter;          // الألف: الحرف «ا» وفي الكلمة «أ»
    const phon = (l) => ({ ...Kanaan.Alphabet.soundOf(l), cue: `phonemes/${l}` });
    const sound = { ...phon(wordLetter), ...(src.sound || {}), cue: `phonemes/${wordLetter}`, listenCue: `listen/${wordLetter}` };
    const W = src.word;
    const i = W.letters.indexOf(wordLetter);
    const position = W.position || (i <= 0 ? 'start' : i === W.letters.length - 1 ? 'end' : 'middle');
    const contrastLetter = src.contrast || A.contrast;
    const contrast = contrastLetter ? { letter: contrastLetter, ...phon(contrastLetter) } : null;
    const options = src.options;
    const sounds = {};
    options.forEach((l) => { sounds[l] = l === wordLetter ? sound : phon(l); });

    const ep = {
      id: src.id,
      order: index + 1,
      title: `الرسالة ${ORD[index] || index + 1}`,
      letter: src.letter,
      wordLetter,
      letterName: src.letterName || A.name,
      forms: Kanaan.Alphabet.forms(src.letter),
      sound,
      exampleWord: {
        text: W.text, plain: strip(W.text), letters: W.letters, position,
        cue: `words/${strip(W.text)}`,
        image: { scene: W.scene, src: W.image || null, alt: W.alt }
      },
      phonemeActivity: { options, correct: wordLetter, contrast, sounds },
      pronunciationActivity: {
        maxRecordMs: 4000,
        evaluator: src.evaluator || Kanaan.Alphabet.evaluatorOf(wordLetter),
        profile: src.profile || Kanaan.Alphabet.profileOf(wordLetter),
        tips: { silent: `لم يصلني صوت واضح. اقترب من الميكروفون وانطق: ${sound.label}`, ...Kanaan.Alphabet.tipsOf(wordLetter), ...(src.tips || {}) }
      },
      wordBuildingActivity: { target: W.letters, tiles: src.tiles || scramble(W.letters) },
      writingActivity: { ...(src.writing || {}) },
      meaningActivity: {},
      transferActivity: {
        channels: src.transfer.map(([word, starts]) => ({ word, startsWithTarget: starts, startSound: strip(word)[0], cue: `words/${strip(word)}` }))
      },
      flow: FLOW
    };
    const d = defaults(ep);
    ep.script = { ...d.script, revealHint: src.revealHint || '', ...(src.script || {}) };
    ep.feedback = d.feedback;
    ep.phonemeActivity.prompt = d.prompts.phoneme;
    ep.pronunciationActivity.prompt = d.prompts.pronunciation;
    ep.wordBuildingActivity.prompt = d.prompts.build;
    ep.meaningActivity.prompt = d.prompts.meaning;
    ep.transferActivity.prompt = d.prompts.transfer;
    return ep;
  }

  const pending = [];
  /** يسجّل ملف حرف؛ تُبنى الحلقات بترتيب المنهج عند أول استخدام */
  function add(src) {
    const okWord = src.word && src.word.letters.join('') === strip(src.word.text);
    if (!okWord) console.error('[Kanaan] حروف الكلمة لا تطابق نصها:', src.id, src.word && src.word.text);
    pending.push(src);
    store.clear();
  }

  function ensure() {
    if (store.size || !pending.length) return;
    const order = Kanaan.Curriculum.order();
    const sorted = pending.slice().sort((a, b) => {
      const ia = order.indexOf(a.id), ib = order.indexOf(b.id);
      return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
    }).filter((s) => order.includes(s.id));
    sorted.forEach((src, i) => store.set(src.id, Object.freeze(build(src, i))));
  }

  return {
    add,
    register: add,
    get(id) { ensure(); return store.get(id); },
    list() { ensure(); return [...store.values()]; },
    next(id) {
      const all = this.list();
      const i = all.findIndex((e) => e.id === id);
      return i >= 0 ? all[i + 1] || null : null;
    }
  };
})();
Kanaan.Letters = Kanaan.Episodes;
