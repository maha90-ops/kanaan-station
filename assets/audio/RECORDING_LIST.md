# قائمة التسجيلات — محطة كنعان للحروف

يُولَّد تلقائيًا: `node tools/recording_list.js` — 254 تسجيلًا.

ضع كل ملف في `assets/audio/` بالمسار المكتوب هنا مع الامتداد (`.mp3` مثلًا)، ثم شغّل `python3 tools/build_audio_manifest.py`.
أي ملف غير موجود يُنطق بالصوت الآلي — يمكن التسجيل تدريجيًا.

## أصوات الحروف (phonemes/) — 21

| اسم الملف | النص |
|---|---|
| `phonemes/أ` | أَ |
| `phonemes/ب` | بَ |
| `phonemes/ت` | تَ |
| `phonemes/ث` | ثَ |
| `phonemes/ج` | جَ |
| `phonemes/ح` | حَ |
| `phonemes/خ` | خَ |
| `phonemes/د` | دَ |
| `phonemes/ذ` | ذَ |
| `phonemes/ر` | رَ |
| `phonemes/ز` | زززز |
| `phonemes/س` | سسس |
| `phonemes/ش` | ششش |
| `phonemes/ط` | طَ |
| `phonemes/ع` | عَ |
| `phonemes/غ` | غَ |
| `phonemes/ف` | فففف |
| `phonemes/ك` | كَ |
| `phonemes/م` | ممم |
| `phonemes/ن` | نَ |
| `phonemes/هـ` | هَ |

## نماذج الاستماع (listen/) — 12

| اسم الملف | النص |
|---|---|
| `listen/ب` | بَ بَ بَ |
| `listen/ت` | تَ تَ تَ |
| `listen/ث` | ثَ ثَ ثَ |
| `listen/ج` | جَ جَ جَ |
| `listen/ح` | حَ حَ حَ |
| `listen/خ` | خَ خَ خَ |
| `listen/د` | دَ دَ دَ |
| `listen/ذ` | ذَ ذَ ذَ |
| `listen/ز` | زززز زززز زززز |
| `listen/ش` | ششش ششش ششش |
| `listen/ع` | عَ عَ عَ |
| `listen/م` | ممم ممم ممم |

## الكلمات (words/) — 33

| اسم الملف | النص |
|---|---|
| `words/أرنب` | أَرْنَب |
| `words/باب` | بَاب |
| `words/بيت` | بَيْت |
| `words/تفاح` | تُفَّاح |
| `words/تين` | تِين |
| `words/ثلج` | ثَلْج |
| `words/ثوب` | ثَوْب |
| `words/جبل` | جَبَل |
| `words/جمل` | جَمَل |
| `words/حصان` | حِصَان |
| `words/حليب` | حَلِيب |
| `words/خبز` | خُبْز |
| `words/خروف` | خَرُوف |
| `words/دار` | دَار |
| `words/دب` | دُبّ |
| `words/ديك` | دِيك |
| `words/ذرة` | ذُرَة |
| `words/ذهب` | ذَهَب |
| `words/زهرة` | زَهْرَة |
| `words/زيت` | زَيْت |
| `words/سمك` | سَمَك |
| `words/شاي` | شَاي |
| `words/شمس` | شَمْس |
| `words/طير` | طَيْر |
| `words/عنب` | عِنَب |
| `words/عين` | عَيْن |
| `words/غيمة` | غَيْمَة |
| `words/قمر` | قَمَر |
| `words/كعك` | كَعْك |
| `words/ماء` | مَاء |
| `words/موز` | مَوْز |
| `words/نار` | نَار |
| `words/هلال` | هِلَال |

## جمل كنعان المشتركة (common/) — 20

| اسم الملف | النص |
|---|---|
| `common/feedback.discrimination.correct` | أحسنت! لقد ميّزت الصوت. |
| `common/feedback.discrimination.retry` | استمع مرة أخرى وحاول. |
| `common/feedback.pronunciation.clear` | سمعتُ صوتك بوضوح! استمع لصوتك وقارنه بالنموذج. |
| `common/feedback.pronunciation.close` | محاولة جميلة! استمع إلى النموذج وحاول مرة أخرى. |
| `common/feedback.pronunciation.excellent` | رائع! نطقك واضح. |
| `common/feedback.pronunciation.heard` | استمعتُ إلى نطقك. |
| `common/feedback.pronunciation.retry` | لنحاول معًا. استمع جيدًا ثم أعد النطق. |
| `common/feedback.transfer.retry` | هذه كلمة تبدأ بصوت آخر. استمع للقنوات مرة أخرى. |
| `common/feedback.writing.excellent` | ممتاز! لقد كتبت الحرف بنفسك. |
| `common/feedback.writing.retry` | محاولة جميلة، لنحاول مرة أخرى. |
| `common/feedback.writing.traced` | أحسنت! تتبّعت الحرف جيدًا. |
| `common/phonemeActivity.prompt` | أيُّ صوت سمعت؟ |
| `common/script.go` | هيا نستمع! |
| `common/script.listenAfter` | هل سمعته؟ لنكتشف أيّ صوت هو. |
| `common/script.listenIntro` | استمع جيدًا… هناك صوت يختبئ في محطة الحروف. |
| `common/script.reveal` | أحسنت! لقد اكتشفت الحرف. |
| `common/script.signal` | اضغط على كل صوت لتسمعه، ثم اختر الصوت الذي سمعته. |
| `common/script.welcome` | مرحبًا يا أصدقاء! أنا كنعان، مذيع محطة الحروف. وصلتني اليوم رسالة غامضة… لكن أحد الحروف اختفى منها! هل تساعدني في اكتشافه؟ |
| `common/script.write2` | الآن أكمل الحرف. النقاط أقل هذه المرة. |
| `common/script.write3` | والآن اكتب الحرف بنفسك. |

## جمل خاصة بكل حرف (letters/) — 168

| اسم الملف | النص |
|---|---|
| `letters/ain/feedback.build.correct` | رائع! لقد بنيت كلمة عِنَب. |
| `letters/ain/feedback.build.retry` | اقتربت! ابدأ بالحرف الذي صوته عَ. |
| `letters/ain/feedback.discriminationScaffold` | استمع إلى الفرق: هذا صوت «أ»… وهذا الصوت الذي سمعته. |
| `letters/ain/feedback.meaning.correct` | نعم! نسمع صوت ع في بداية كلمة عِنَب. |
| `letters/ain/feedback.meaning.retry` | استمع إلى الكلمة ببطء… أين تسمع صوت ع؟ |
| `letters/ain/feedback.transfer.correct` | أحسنت! «عَيْن» تبدأ بصوت ع. |
| `letters/ain/meaningActivity.prompt` | أين تسمع صوت ع في كلمة عِنَب؟ |
| `letters/ain/script.build` | لنَبْنِ كلمة! رتّب الحروف لتبدأ الكلمة بصوت ع. |
| `letters/ain/script.built` | رائع! لقد بنيت كلمة عِنَب. |
| `letters/ain/script.revealHint` | انظر: رأس الحرف ع مفتوح مثل فم صغير. |
| `letters/ain/script.speak` | الآن دورك! انطق صوت الحرف ع. |
| `letters/ain/script.success` | رائع يا مستكشف الحروف! لقد فككتَ الرسالة الثانية عشرة. |
| `letters/ain/script.transfer` | وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أيّ كلمة تبدأ بصوت ع. |
| `letters/ain/script.write` | لنكتب حرف ع! ابدأ من النقطة الخضراء واتبع السهم. |
| `letters/baa/feedback.build.correct` | رائع! لقد بنيت كلمة بَيْت. |
| `letters/baa/feedback.build.retry` | اقتربت! ابدأ بالحرف الذي صوته بَ. |
| `letters/baa/feedback.discriminationScaffold` | استمع إلى الفرق: هذا صوت «م»… وهذا الصوت الذي سمعته. |
| `letters/baa/feedback.meaning.correct` | نعم! نسمع صوت ب في بداية كلمة بَيْت. |
| `letters/baa/feedback.meaning.retry` | استمع إلى الكلمة ببطء… أين تسمع صوت ب؟ |
| `letters/baa/feedback.transfer.correct` | أحسنت! «بَاب» تبدأ بصوت ب. |
| `letters/baa/meaningActivity.prompt` | أين تسمع صوت ب في كلمة بَيْت؟ |
| `letters/baa/script.build` | لنَبْنِ كلمة! رتّب الحروف لتبدأ الكلمة بصوت ب. |
| `letters/baa/script.built` | رائع! لقد بنيت كلمة بَيْت. |
| `letters/baa/script.revealHint` | انظر: تحت الحرف ب نقطة واحدة. |
| `letters/baa/script.speak` | الآن دورك! انطق صوت الحرف ب. |
| `letters/baa/script.success` | رائع يا مستكشف الحروف! لقد فككتَ الرسالة الأولى. |
| `letters/baa/script.transfer` | وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أيّ كلمة تبدأ بصوت ب. |
| `letters/baa/script.write` | لنكتب حرف ب! ابدأ من النقطة الخضراء واتبع السهم. |
| `letters/daal/feedback.build.correct` | رائع! لقد بنيت كلمة دِيك. |
| `letters/daal/feedback.build.retry` | اقتربت! ابدأ بالحرف الذي صوته دَ. |
| `letters/daal/feedback.discriminationScaffold` | استمع إلى الفرق: هذا صوت «ت»… وهذا الصوت الذي سمعته. |
| `letters/daal/feedback.meaning.correct` | نعم! نسمع صوت د في بداية كلمة دِيك. |
| `letters/daal/feedback.meaning.retry` | استمع إلى الكلمة ببطء… أين تسمع صوت د؟ |
| `letters/daal/feedback.transfer.correct` | أحسنت! «دُبّ» تبدأ بصوت د. |
| `letters/daal/meaningActivity.prompt` | أين تسمع صوت د في كلمة دِيك؟ |
| `letters/daal/script.build` | لنَبْنِ كلمة! رتّب الحروف لتبدأ الكلمة بصوت د. |
| `letters/daal/script.built` | رائع! لقد بنيت كلمة دِيك. |
| `letters/daal/script.revealHint` | انظر: الحرف د بلا نقاط، ولا يتصل بالحرف الذي بعده. |
| `letters/daal/script.speak` | الآن دورك! انطق صوت الحرف د. |
| `letters/daal/script.success` | رائع يا مستكشف الحروف! لقد فككتَ الرسالة السابعة. |
| `letters/daal/script.transfer` | وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أيّ كلمة تبدأ بصوت د. |
| `letters/daal/script.write` | لنكتب حرف د! ابدأ من النقطة الخضراء واتبع السهم. |
| `letters/haa/feedback.build.correct` | رائع! لقد بنيت كلمة حِصَان. |
| `letters/haa/feedback.build.retry` | اقتربت! ابدأ بالحرف الذي صوته حَ. |
| `letters/haa/feedback.discriminationScaffold` | استمع إلى الفرق: هذا صوت «هـ»… وهذا الصوت الذي سمعته. |
| `letters/haa/feedback.meaning.correct` | نعم! نسمع صوت ح في بداية كلمة حِصَان. |
| `letters/haa/feedback.meaning.retry` | استمع إلى الكلمة ببطء… أين تسمع صوت ح؟ |
| `letters/haa/feedback.transfer.correct` | أحسنت! «حَلِيب» تبدأ بصوت ح. |
| `letters/haa/meaningActivity.prompt` | أين تسمع صوت ح في كلمة حِصَان؟ |
| `letters/haa/script.build` | لنَبْنِ كلمة! رتّب الحروف لتبدأ الكلمة بصوت ح. |
| `letters/haa/script.built` | رائع! لقد بنيت كلمة حِصَان. |
| `letters/haa/script.revealHint` | انظر: الحرف ح بلا نقاط. |
| `letters/haa/script.speak` | الآن دورك! انطق صوت الحرف ح. |
| `letters/haa/script.success` | رائع يا مستكشف الحروف! لقد فككتَ الرسالة الخامسة. |
| `letters/haa/script.transfer` | وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أيّ كلمة تبدأ بصوت ح. |
| `letters/haa/script.write` | لنكتب حرف ح! ابدأ من النقطة الخضراء واتبع السهم. |
| `letters/jeem/feedback.build.correct` | رائع! لقد بنيت كلمة جَمَل. |
| `letters/jeem/feedback.build.retry` | اقتربت! ابدأ بالحرف الذي صوته جَ. |
| `letters/jeem/feedback.discriminationScaffold` | استمع إلى الفرق: هذا صوت «ش»… وهذا الصوت الذي سمعته. |
| `letters/jeem/feedback.meaning.correct` | نعم! نسمع صوت ج في بداية كلمة جَمَل. |
| `letters/jeem/feedback.meaning.retry` | استمع إلى الكلمة ببطء… أين تسمع صوت ج؟ |
| `letters/jeem/feedback.transfer.correct` | أحسنت! «جَبَل» تبدأ بصوت ج. |
| `letters/jeem/meaningActivity.prompt` | أين تسمع صوت ج في كلمة جَمَل؟ |
| `letters/jeem/script.build` | لنَبْنِ كلمة! رتّب الحروف لتبدأ الكلمة بصوت ج. |
| `letters/jeem/script.built` | رائع! لقد بنيت كلمة جَمَل. |
| `letters/jeem/script.revealHint` | انظر: في بطن الحرف ج نقطة واحدة. |
| `letters/jeem/script.speak` | الآن دورك! انطق صوت الحرف ج. |
| `letters/jeem/script.success` | رائع يا مستكشف الحروف! لقد فككتَ الرسالة الرابعة. |
| `letters/jeem/script.transfer` | وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أيّ كلمة تبدأ بصوت ج. |
| `letters/jeem/script.write` | لنكتب حرف ج! ابدأ من النقطة الخضراء واتبع السهم. |
| `letters/khaa/feedback.build.correct` | رائع! لقد بنيت كلمة خُبْز. |
| `letters/khaa/feedback.build.retry` | اقتربت! ابدأ بالحرف الذي صوته خَ. |
| `letters/khaa/feedback.discriminationScaffold` | استمع إلى الفرق: هذا صوت «غ»… وهذا الصوت الذي سمعته. |
| `letters/khaa/feedback.meaning.correct` | نعم! نسمع صوت خ في بداية كلمة خُبْز. |
| `letters/khaa/feedback.meaning.retry` | استمع إلى الكلمة ببطء… أين تسمع صوت خ؟ |
| `letters/khaa/feedback.transfer.correct` | أحسنت! «خَرُوف» تبدأ بصوت خ. |
| `letters/khaa/meaningActivity.prompt` | أين تسمع صوت خ في كلمة خُبْز؟ |
| `letters/khaa/script.build` | لنَبْنِ كلمة! رتّب الحروف لتبدأ الكلمة بصوت خ. |
| `letters/khaa/script.built` | رائع! لقد بنيت كلمة خُبْز. |
| `letters/khaa/script.revealHint` | انظر: فوق الحرف خ نقطة واحدة. |
| `letters/khaa/script.speak` | الآن دورك! انطق صوت الحرف خ. |
| `letters/khaa/script.success` | رائع يا مستكشف الحروف! لقد فككتَ الرسالة السادسة. |
| `letters/khaa/script.transfer` | وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أيّ كلمة تبدأ بصوت خ. |
| `letters/khaa/script.write` | لنكتب حرف خ! ابدأ من النقطة الخضراء واتبع السهم. |
| `letters/meem/feedback.build.correct` | رائع! لقد بنيت كلمة مَوْز. |
| `letters/meem/feedback.build.retry` | اقتربت! ابدأ بالحرف الذي صوته ممم. |
| `letters/meem/feedback.discriminationScaffold` | استمع إلى الفرق: هذا صوت «ن»… وهذا الصوت الذي سمعته. |
| `letters/meem/feedback.meaning.correct` | نعم! نسمع صوت م في بداية كلمة مَوْز. |
| `letters/meem/feedback.meaning.retry` | استمع إلى الكلمة ببطء… أين تسمع صوت م؟ |
| `letters/meem/feedback.transfer.correct` | أحسنت! «مَاء» تبدأ بصوت م. |
| `letters/meem/meaningActivity.prompt` | أين تسمع صوت م في كلمة مَوْز؟ |
| `letters/meem/script.build` | لنَبْنِ كلمة! رتّب الحروف لتبدأ الكلمة بصوت م. |
| `letters/meem/script.built` | رائع! لقد بنيت كلمة مَوْز. |
| `letters/meem/script.revealHint` | انظر: رأس الحرف م دائرة صغيرة، مثل فمك وهو مغلق. |
| `letters/meem/script.speak` | الآن دورك! انطق صوت الحرف م. |
| `letters/meem/script.success` | رائع يا مستكشف الحروف! لقد فككتَ الرسالة العاشرة. |
| `letters/meem/script.transfer` | وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أيّ كلمة تبدأ بصوت م. |
| `letters/meem/script.write` | لنكتب حرف م! ابدأ من النقطة الخضراء واتبع السهم. |
| `letters/sheen/feedback.build.correct` | رائع! لقد بنيت كلمة شَمْس. |
| `letters/sheen/feedback.build.retry` | اقتربت! ابدأ بالحرف الذي صوته ششش. |
| `letters/sheen/feedback.discriminationScaffold` | استمع إلى الفرق: هذا صوت «س»… وهذا الصوت الذي سمعته. |
| `letters/sheen/feedback.meaning.correct` | نعم! نسمع صوت ش في بداية كلمة شَمْس. |
| `letters/sheen/feedback.meaning.retry` | استمع إلى الكلمة ببطء… أين تسمع صوت ش؟ |
| `letters/sheen/feedback.transfer.correct` | أحسنت! «شَاي» تبدأ بصوت ش. |
| `letters/sheen/meaningActivity.prompt` | أين تسمع صوت ش في كلمة شَمْس؟ |
| `letters/sheen/script.build` | لنَبْنِ كلمة! رتّب الحروف لتبدأ الكلمة بصوت ش. |
| `letters/sheen/script.built` | رائع! لقد بنيت كلمة شَمْس. |
| `letters/sheen/script.revealHint` | انظر: فوق الحرف ش ثلاث نقاط. |
| `letters/sheen/script.speak` | الآن دورك! انطق صوت الحرف ش. |
| `letters/sheen/script.success` | رائع يا مستكشف الحروف! لقد فككتَ الرسالة التاسعة. |
| `letters/sheen/script.transfer` | وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أيّ كلمة تبدأ بصوت ش. |
| `letters/sheen/script.write` | لنكتب حرف ش! ابدأ من النقطة الخضراء واتبع السهم. |
| `letters/taa/feedback.build.correct` | رائع! لقد بنيت كلمة تِين. |
| `letters/taa/feedback.build.retry` | اقتربت! ابدأ بالحرف الذي صوته تَ. |
| `letters/taa/feedback.discriminationScaffold` | استمع إلى الفرق: هذا صوت «د»… وهذا الصوت الذي سمعته. |
| `letters/taa/feedback.meaning.correct` | نعم! نسمع صوت ت في بداية كلمة تِين. |
| `letters/taa/feedback.meaning.retry` | استمع إلى الكلمة ببطء… أين تسمع صوت ت؟ |
| `letters/taa/feedback.transfer.correct` | أحسنت! «تُفَّاح» تبدأ بصوت ت. |
| `letters/taa/meaningActivity.prompt` | أين تسمع صوت ت في كلمة تِين؟ |
| `letters/taa/script.build` | لنَبْنِ كلمة! رتّب الحروف لتبدأ الكلمة بصوت ت. |
| `letters/taa/script.built` | رائع! لقد بنيت كلمة تِين. |
| `letters/taa/script.revealHint` | انظر: فوق الحرف ت نقطتان. |
| `letters/taa/script.speak` | الآن دورك! انطق صوت الحرف ت. |
| `letters/taa/script.success` | رائع يا مستكشف الحروف! لقد فككتَ الرسالة الثانية. |
| `letters/taa/script.transfer` | وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أيّ كلمة تبدأ بصوت ت. |
| `letters/taa/script.write` | لنكتب حرف ت! ابدأ من النقطة الخضراء واتبع السهم. |
| `letters/thaa/feedback.build.correct` | رائع! لقد بنيت كلمة ثَوْب. |
| `letters/thaa/feedback.build.retry` | اقتربت! ابدأ بالحرف الذي صوته ثَ. |
| `letters/thaa/feedback.discriminationScaffold` | استمع إلى الفرق: هذا صوت «س»… وهذا الصوت الذي سمعته. |
| `letters/thaa/feedback.meaning.correct` | نعم! نسمع صوت ث في بداية كلمة ثَوْب. |
| `letters/thaa/feedback.meaning.retry` | استمع إلى الكلمة ببطء… أين تسمع صوت ث؟ |
| `letters/thaa/feedback.transfer.correct` | أحسنت! «ثَلْج» تبدأ بصوت ث. |
| `letters/thaa/meaningActivity.prompt` | أين تسمع صوت ث في كلمة ثَوْب؟ |
| `letters/thaa/script.build` | لنَبْنِ كلمة! رتّب الحروف لتبدأ الكلمة بصوت ث. |
| `letters/thaa/script.built` | رائع! لقد بنيت كلمة ثَوْب. |
| `letters/thaa/script.revealHint` | انظر: فوق الحرف ث ثلاث نقاط. |
| `letters/thaa/script.speak` | الآن دورك! انطق صوت الحرف ث. |
| `letters/thaa/script.success` | رائع يا مستكشف الحروف! لقد فككتَ الرسالة الثالثة. |
| `letters/thaa/script.transfer` | وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أيّ كلمة تبدأ بصوت ث. |
| `letters/thaa/script.write` | لنكتب حرف ث! ابدأ من النقطة الخضراء واتبع السهم. |
| `letters/thaal/feedback.build.correct` | رائع! لقد بنيت كلمة ذُرَة. |
| `letters/thaal/feedback.build.retry` | اقتربت! ابدأ بالحرف الذي صوته ذَ. |
| `letters/thaal/feedback.discriminationScaffold` | استمع إلى الفرق: هذا صوت «ز»… وهذا الصوت الذي سمعته. |
| `letters/thaal/feedback.meaning.correct` | نعم! نسمع صوت ذ في بداية كلمة ذُرَة. |
| `letters/thaal/feedback.meaning.retry` | استمع إلى الكلمة ببطء… أين تسمع صوت ذ؟ |
| `letters/thaal/feedback.transfer.correct` | أحسنت! «ذَهَب» تبدأ بصوت ذ. |
| `letters/thaal/meaningActivity.prompt` | أين تسمع صوت ذ في كلمة ذُرَة؟ |
| `letters/thaal/script.build` | لنَبْنِ كلمة! رتّب الحروف لتبدأ الكلمة بصوت ذ. |
| `letters/thaal/script.built` | رائع! لقد بنيت كلمة ذُرَة. |
| `letters/thaal/script.revealHint` | انظر: فوق الحرف ذ نقطة واحدة. |
| `letters/thaal/script.speak` | الآن دورك! انطق صوت الحرف ذ. |
| `letters/thaal/script.success` | رائع يا مستكشف الحروف! لقد فككتَ الرسالة الثامنة. |
| `letters/thaal/script.transfer` | وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أيّ كلمة تبدأ بصوت ذ. |
| `letters/thaal/script.write` | لنكتب حرف ذ! ابدأ من النقطة الخضراء واتبع السهم. |
| `letters/zay/feedback.build.correct` | رائع! لقد بنيت كلمة زَيْت. |
| `letters/zay/feedback.build.retry` | اقتربت! ابدأ بالحرف الذي صوته زززز. |
| `letters/zay/feedback.discriminationScaffold` | استمع إلى الفرق: هذا صوت «س»… وهذا الصوت الذي سمعته. |
| `letters/zay/feedback.meaning.correct` | نعم! نسمع صوت ز في بداية كلمة زَيْت. |
| `letters/zay/feedback.meaning.retry` | استمع إلى الكلمة ببطء… أين تسمع صوت ز؟ |
| `letters/zay/feedback.transfer.correct` | أحسنت! «زَهْرَة» تبدأ بصوت ز. |
| `letters/zay/meaningActivity.prompt` | أين تسمع صوت ز في كلمة زَيْت؟ |
| `letters/zay/script.build` | لنَبْنِ كلمة! رتّب الحروف لتبدأ الكلمة بصوت ز. |
| `letters/zay/script.built` | رائع! لقد بنيت كلمة زَيْت. |
| `letters/zay/script.revealHint` | انظر: فوق الحرف ز نقطة واحدة. بدونها يصبح ر. |
| `letters/zay/script.speak` | الآن دورك! انطق صوت الحرف ز. |
| `letters/zay/script.success` | رائع يا مستكشف الحروف! لقد فككتَ الرسالة الحادية عشرة. |
| `letters/zay/script.transfer` | وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أيّ كلمة تبدأ بصوت ز. |
| `letters/zay/script.write` | لنكتب حرف ز! ابدأ من النقطة الخضراء واتبع السهم. |

