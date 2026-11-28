# قائمة التسجيلات — محطة كنعان للحروف

يُولَّد تلقائيًا: `node tools/recording_list.js` — 388 تسجيلًا.

ضع كل ملف في `assets/audio/` بالمسار المكتوب هنا مع الامتداد (`.mp3` مثلًا)، ثم شغّل `python3 tools/build_audio_manifest.py`.
أي ملف غير موجود يُنطق بالصوت الآلي — يمكن التسجيل تدريجيًا.

## أصوات الحروف (phonemes/) — 21

| اسم الملف | النص |
|---|---|
| `phonemes/a2` | أَ |
| `phonemes/b` | بَ |
| `phonemes/t` | تَ |
| `phonemes/th` | ثَ |
| `phonemes/j` | جَ |
| `phonemes/h7` | حَ |
| `phonemes/kh` | خَ |
| `phonemes/d` | دَ |
| `phonemes/dh` | ذَ |
| `phonemes/r` | رَ |
| `phonemes/z` | زززز |
| `phonemes/s` | سسس |
| `phonemes/sh` | ششش |
| `phonemes/t6` | طَ |
| `phonemes/e3` | عَ |
| `phonemes/gh` | غَ |
| `phonemes/f` | فففف |
| `phonemes/k` | كَ |
| `phonemes/m` | ممم |
| `phonemes/n` | نَ |
| `phonemes/h` | هَ |

## نماذج الاستماع (listen/) — 12

| اسم الملف | النص |
|---|---|
| `listen/b` | بَ بَ بَ |
| `listen/t` | تَ تَ تَ |
| `listen/th` | ثَ ثَ ثَ |
| `listen/j` | جَ جَ جَ |
| `listen/h7` | حَ حَ حَ |
| `listen/kh` | خَ خَ خَ |
| `listen/d` | دَ دَ دَ |
| `listen/dh` | ذَ ذَ ذَ |
| `listen/z` | زززز زززز زززز |
| `listen/sh` | ششش ششش ششش |
| `listen/e3` | عَ عَ عَ |
| `listen/m` | ممم ممم ممم |

## الكلمات (words/) — 33

| اسم الملف | النص |
|---|---|
| `words/a2rnb` | أَرْنَب |
| `words/bab` | بَاب |
| `words/byt` | بَيْت |
| `words/tfah7` | تُفَّاح |
| `words/tyn` | تِين |
| `words/thlj` | ثَلْج |
| `words/thwb` | ثَوْب |
| `words/jbl` | جَبَل |
| `words/jml` | جَمَل |
| `words/h7s9an` | حِصَان |
| `words/h7lyb` | حَلِيب |
| `words/khbz` | خُبْز |
| `words/khrwf` | خَرُوف |
| `words/dar` | دَار |
| `words/db` | دُبّ |
| `words/dyk` | دِيك |
| `words/dhrh0` | ذُرَة |
| `words/dhhb` | ذَهَب |
| `words/zhrh0` | زَهْرَة |
| `words/zyt` | زَيْت |
| `words/smk` | سَمَك |
| `words/shay` | شَاي |
| `words/shms` | شَمْس |
| `words/t6yr` | طَيْر |
| `words/e3nb` | عِنَب |
| `words/e3yn` | عَيْن |
| `words/ghymh0` | غَيْمَة |
| `words/qmr` | قَمَر |
| `words/ke3k` | كَعْك |
| `words/mae2` | مَاء |
| `words/mwz` | مَوْز |
| `words/nar` | نَار |
| `words/hlal` | هِلَال |

## جمل كنعان المشتركة (common/) — 34

| اسم الملف | النص |
|---|---|
| `common/feedback.discrimination.correct` | أحسنت! لقد ميّزت الصوت. |
| `common/feedback.discrimination.retry` | استمع مرة أخرى وحاول. |
| `common/feedback.forms.end` | صحيح! هذا شكله في آخر الكلمة. |
| `common/feedback.forms.middle` | صحيح! هذا شكله في وسط الكلمة. |
| `common/feedback.forms.retry` | انظر جيدًا: هل يتصل الحرف الملوّن بما قبله؟ وهل يتصل بما بعده؟ |
| `common/feedback.forms.start` | صحيح! هذا شكله في أول الكلمة. |
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
| `common/script.allDone` | أنهيتَ كل رسائل المحطة! أحسنت يا بطل. |
| `common/script.discoverAsk` | هذا الصوت يُكتب بأحد هذه الحروف. استمع إلى التلميح، واختر الحرف. |
| `common/script.discoverRetry` | انظر جيدًا إلى شكل الحرف ونقاطه، وحاول مرة أخرى. |
| `common/script.formsDone` | رائع! عرفتَ أشكال الحرف في أول الكلمة ووسطها وآخرها. |
| `common/script.formsIntro` | الحرف يغيّر شكله حسب مكانه في الكلمة. انظر إلى الحرف الملوّن، واختر شكله. |
| `common/script.formsNonJoining` | لاحظ: هذا الحرف لا يتصل بما بعده، لذلك شكله في وسط الكلمة وآخرها واحد. |
| `common/script.go` | هيا نستمع! |
| `common/script.listenAfter` | هل سمعته؟ لنكتشف أيّ صوت هو. |
| `common/script.listenIntro` | استمع جيدًا… هناك صوت يختبئ في محطة الحروف. |
| `common/script.missionLater` | لا بأس! الأصوات حولنا في كل مكان، ستجدها. |
| `common/script.nextAsk` | هل أنت مستعد للرسالة التالية؟ |
| `common/script.onairStart` | حان وقت البث! سيسمع الجميع صوتك على محطة كنعان. |
| `common/script.reveal` | أحسنت! لقد اكتشفت الحرف. |
| `common/script.reviewAsk` | وصلتنا إشارة قديمة من أرشيف المحطة… أيّ حرف هذا؟ |
| `common/script.signal` | اضغط على كل صوت لتسمعه، ثم اختر الصوت الذي سمعته. |
| `common/script.welcome` | مرحبًا يا أصدقاء! أنا كنعان، مذيع محطة الحروف. وصلتني اليوم رسالة غامضة… لكن أحد الحروف اختفى منها! هل تساعدني في اكتشافه؟ |
| `common/script.write2` | الآن أكمل الحرف. النقاط أقل هذه المرة. |
| `common/script.write3` | والآن اكتب الحرف بنفسك. |

## جمل خاصة بكل حرف (letters/) — 288

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
| `letters/ain/script.messageBack` | عاد الحرف ع إلى مكانه في الرسالة! |
| `letters/ain/script.messageComplete` | عاد الحرف ع إلى الرسالة… واكتملت الرسالة كلها! استمع إليها: |
| `letters/ain/script.mission` | مهمتك حتى الرسالة القادمة: ابحث في بيتك عن شيء يبدأ بصوت ع. |
| `letters/ain/script.missionAsk` | أهلًا بعودتك! في الرسالة السابقة كانت مهمتك أن تبحث عن شيء يبدأ بصوت ع. هل وجدتَ شيئًا؟ قل اسمه! |
| `letters/ain/script.missionSaved` | رائع! حفظتُ اكتشافك في أرشيف المحطة. هل يبدأ بصوت ع؟ استمع وتأكّد. |
| `letters/ain/script.onairIntro` | معنا اليوم مذيع جديد في محطة كنعان! استمعوا إلى صوت الحرف ع: |
| `letters/ain/script.onairNoVoice` | نطق مذيعنا الصغير صوت ع بصوت واضح! |
| `letters/ain/script.onairWord` | وهذه كلمة اليوم: عِنَب |
| `letters/ain/script.revealHint` | انظر: رأس الحرف ع مفتوح مثل فم صغير. |
| `letters/ain/script.reviewCorrect` | أحسنت! ما زلتَ تتذكّر صوت ع. |
| `letters/ain/script.reviewRetry` | هذه إشارة الحرف ع. استمع إليها مرة أخرى. |
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
| `letters/baa/script.messageBack` | عاد الحرف ب إلى مكانه في الرسالة! |
| `letters/baa/script.messageComplete` | عاد الحرف ب إلى الرسالة… واكتملت الرسالة كلها! استمع إليها: |
| `letters/baa/script.mission` | مهمتك حتى الرسالة القادمة: ابحث في بيتك عن شيء يبدأ بصوت ب. |
| `letters/baa/script.missionAsk` | أهلًا بعودتك! في الرسالة السابقة كانت مهمتك أن تبحث عن شيء يبدأ بصوت ب. هل وجدتَ شيئًا؟ قل اسمه! |
| `letters/baa/script.missionSaved` | رائع! حفظتُ اكتشافك في أرشيف المحطة. هل يبدأ بصوت ب؟ استمع وتأكّد. |
| `letters/baa/script.onairIntro` | معنا اليوم مذيع جديد في محطة كنعان! استمعوا إلى صوت الحرف ب: |
| `letters/baa/script.onairNoVoice` | نطق مذيعنا الصغير صوت ب بصوت واضح! |
| `letters/baa/script.onairWord` | وهذه كلمة اليوم: بَيْت |
| `letters/baa/script.revealHint` | انظر: تحت الحرف ب نقطة واحدة. |
| `letters/baa/script.reviewCorrect` | أحسنت! ما زلتَ تتذكّر صوت ب. |
| `letters/baa/script.reviewRetry` | هذه إشارة الحرف ب. استمع إليها مرة أخرى. |
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
| `letters/daal/script.messageBack` | عاد الحرف د إلى مكانه في الرسالة! |
| `letters/daal/script.messageComplete` | عاد الحرف د إلى الرسالة… واكتملت الرسالة كلها! استمع إليها: |
| `letters/daal/script.mission` | مهمتك حتى الرسالة القادمة: ابحث في بيتك عن شيء يبدأ بصوت د. |
| `letters/daal/script.missionAsk` | أهلًا بعودتك! في الرسالة السابقة كانت مهمتك أن تبحث عن شيء يبدأ بصوت د. هل وجدتَ شيئًا؟ قل اسمه! |
| `letters/daal/script.missionSaved` | رائع! حفظتُ اكتشافك في أرشيف المحطة. هل يبدأ بصوت د؟ استمع وتأكّد. |
| `letters/daal/script.onairIntro` | معنا اليوم مذيع جديد في محطة كنعان! استمعوا إلى صوت الحرف د: |
| `letters/daal/script.onairNoVoice` | نطق مذيعنا الصغير صوت د بصوت واضح! |
| `letters/daal/script.onairWord` | وهذه كلمة اليوم: دِيك |
| `letters/daal/script.revealHint` | انظر: الحرف د بلا نقاط، ولا يتصل بالحرف الذي بعده. |
| `letters/daal/script.reviewCorrect` | أحسنت! ما زلتَ تتذكّر صوت د. |
| `letters/daal/script.reviewRetry` | هذه إشارة الحرف د. استمع إليها مرة أخرى. |
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
| `letters/haa/script.messageBack` | عاد الحرف ح إلى مكانه في الرسالة! |
| `letters/haa/script.messageComplete` | عاد الحرف ح إلى الرسالة… واكتملت الرسالة كلها! استمع إليها: |
| `letters/haa/script.mission` | مهمتك حتى الرسالة القادمة: ابحث في بيتك عن شيء يبدأ بصوت ح. |
| `letters/haa/script.missionAsk` | أهلًا بعودتك! في الرسالة السابقة كانت مهمتك أن تبحث عن شيء يبدأ بصوت ح. هل وجدتَ شيئًا؟ قل اسمه! |
| `letters/haa/script.missionSaved` | رائع! حفظتُ اكتشافك في أرشيف المحطة. هل يبدأ بصوت ح؟ استمع وتأكّد. |
| `letters/haa/script.onairIntro` | معنا اليوم مذيع جديد في محطة كنعان! استمعوا إلى صوت الحرف ح: |
| `letters/haa/script.onairNoVoice` | نطق مذيعنا الصغير صوت ح بصوت واضح! |
| `letters/haa/script.onairWord` | وهذه كلمة اليوم: حِصَان |
| `letters/haa/script.revealHint` | انظر: الحرف ح بلا نقاط. |
| `letters/haa/script.reviewCorrect` | أحسنت! ما زلتَ تتذكّر صوت ح. |
| `letters/haa/script.reviewRetry` | هذه إشارة الحرف ح. استمع إليها مرة أخرى. |
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
| `letters/jeem/script.messageBack` | عاد الحرف ج إلى مكانه في الرسالة! |
| `letters/jeem/script.messageComplete` | عاد الحرف ج إلى الرسالة… واكتملت الرسالة كلها! استمع إليها: |
| `letters/jeem/script.mission` | مهمتك حتى الرسالة القادمة: ابحث في بيتك عن شيء يبدأ بصوت ج. |
| `letters/jeem/script.missionAsk` | أهلًا بعودتك! في الرسالة السابقة كانت مهمتك أن تبحث عن شيء يبدأ بصوت ج. هل وجدتَ شيئًا؟ قل اسمه! |
| `letters/jeem/script.missionSaved` | رائع! حفظتُ اكتشافك في أرشيف المحطة. هل يبدأ بصوت ج؟ استمع وتأكّد. |
| `letters/jeem/script.onairIntro` | معنا اليوم مذيع جديد في محطة كنعان! استمعوا إلى صوت الحرف ج: |
| `letters/jeem/script.onairNoVoice` | نطق مذيعنا الصغير صوت ج بصوت واضح! |
| `letters/jeem/script.onairWord` | وهذه كلمة اليوم: جَمَل |
| `letters/jeem/script.revealHint` | انظر: في بطن الحرف ج نقطة واحدة. |
| `letters/jeem/script.reviewCorrect` | أحسنت! ما زلتَ تتذكّر صوت ج. |
| `letters/jeem/script.reviewRetry` | هذه إشارة الحرف ج. استمع إليها مرة أخرى. |
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
| `letters/khaa/script.messageBack` | عاد الحرف خ إلى مكانه في الرسالة! |
| `letters/khaa/script.messageComplete` | عاد الحرف خ إلى الرسالة… واكتملت الرسالة كلها! استمع إليها: |
| `letters/khaa/script.mission` | مهمتك حتى الرسالة القادمة: ابحث في بيتك عن شيء يبدأ بصوت خ. |
| `letters/khaa/script.missionAsk` | أهلًا بعودتك! في الرسالة السابقة كانت مهمتك أن تبحث عن شيء يبدأ بصوت خ. هل وجدتَ شيئًا؟ قل اسمه! |
| `letters/khaa/script.missionSaved` | رائع! حفظتُ اكتشافك في أرشيف المحطة. هل يبدأ بصوت خ؟ استمع وتأكّد. |
| `letters/khaa/script.onairIntro` | معنا اليوم مذيع جديد في محطة كنعان! استمعوا إلى صوت الحرف خ: |
| `letters/khaa/script.onairNoVoice` | نطق مذيعنا الصغير صوت خ بصوت واضح! |
| `letters/khaa/script.onairWord` | وهذه كلمة اليوم: خُبْز |
| `letters/khaa/script.revealHint` | انظر: فوق الحرف خ نقطة واحدة. |
| `letters/khaa/script.reviewCorrect` | أحسنت! ما زلتَ تتذكّر صوت خ. |
| `letters/khaa/script.reviewRetry` | هذه إشارة الحرف خ. استمع إليها مرة أخرى. |
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
| `letters/meem/script.messageBack` | عاد الحرف م إلى مكانه في الرسالة! |
| `letters/meem/script.messageComplete` | عاد الحرف م إلى الرسالة… واكتملت الرسالة كلها! استمع إليها: |
| `letters/meem/script.mission` | مهمتك حتى الرسالة القادمة: ابحث في بيتك عن شيء يبدأ بصوت م. |
| `letters/meem/script.missionAsk` | أهلًا بعودتك! في الرسالة السابقة كانت مهمتك أن تبحث عن شيء يبدأ بصوت م. هل وجدتَ شيئًا؟ قل اسمه! |
| `letters/meem/script.missionSaved` | رائع! حفظتُ اكتشافك في أرشيف المحطة. هل يبدأ بصوت م؟ استمع وتأكّد. |
| `letters/meem/script.onairIntro` | معنا اليوم مذيع جديد في محطة كنعان! استمعوا إلى صوت الحرف م: |
| `letters/meem/script.onairNoVoice` | نطق مذيعنا الصغير صوت م بصوت واضح! |
| `letters/meem/script.onairWord` | وهذه كلمة اليوم: مَوْز |
| `letters/meem/script.revealHint` | انظر: رأس الحرف م دائرة صغيرة، مثل فمك وهو مغلق. |
| `letters/meem/script.reviewCorrect` | أحسنت! ما زلتَ تتذكّر صوت م. |
| `letters/meem/script.reviewRetry` | هذه إشارة الحرف م. استمع إليها مرة أخرى. |
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
| `letters/sheen/script.messageBack` | عاد الحرف ش إلى مكانه في الرسالة! |
| `letters/sheen/script.messageComplete` | عاد الحرف ش إلى الرسالة… واكتملت الرسالة كلها! استمع إليها: |
| `letters/sheen/script.mission` | مهمتك حتى الرسالة القادمة: ابحث في بيتك عن شيء يبدأ بصوت ش. |
| `letters/sheen/script.missionAsk` | أهلًا بعودتك! في الرسالة السابقة كانت مهمتك أن تبحث عن شيء يبدأ بصوت ش. هل وجدتَ شيئًا؟ قل اسمه! |
| `letters/sheen/script.missionSaved` | رائع! حفظتُ اكتشافك في أرشيف المحطة. هل يبدأ بصوت ش؟ استمع وتأكّد. |
| `letters/sheen/script.onairIntro` | معنا اليوم مذيع جديد في محطة كنعان! استمعوا إلى صوت الحرف ش: |
| `letters/sheen/script.onairNoVoice` | نطق مذيعنا الصغير صوت ش بصوت واضح! |
| `letters/sheen/script.onairWord` | وهذه كلمة اليوم: شَمْس |
| `letters/sheen/script.revealHint` | انظر: فوق الحرف ش ثلاث نقاط. |
| `letters/sheen/script.reviewCorrect` | أحسنت! ما زلتَ تتذكّر صوت ش. |
| `letters/sheen/script.reviewRetry` | هذه إشارة الحرف ش. استمع إليها مرة أخرى. |
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
| `letters/taa/script.messageBack` | عاد الحرف ت إلى مكانه في الرسالة! |
| `letters/taa/script.messageComplete` | عاد الحرف ت إلى الرسالة… واكتملت الرسالة كلها! استمع إليها: |
| `letters/taa/script.mission` | مهمتك حتى الرسالة القادمة: ابحث في بيتك عن شيء يبدأ بصوت ت. |
| `letters/taa/script.missionAsk` | أهلًا بعودتك! في الرسالة السابقة كانت مهمتك أن تبحث عن شيء يبدأ بصوت ت. هل وجدتَ شيئًا؟ قل اسمه! |
| `letters/taa/script.missionSaved` | رائع! حفظتُ اكتشافك في أرشيف المحطة. هل يبدأ بصوت ت؟ استمع وتأكّد. |
| `letters/taa/script.onairIntro` | معنا اليوم مذيع جديد في محطة كنعان! استمعوا إلى صوت الحرف ت: |
| `letters/taa/script.onairNoVoice` | نطق مذيعنا الصغير صوت ت بصوت واضح! |
| `letters/taa/script.onairWord` | وهذه كلمة اليوم: تِين |
| `letters/taa/script.revealHint` | انظر: فوق الحرف ت نقطتان. |
| `letters/taa/script.reviewCorrect` | أحسنت! ما زلتَ تتذكّر صوت ت. |
| `letters/taa/script.reviewRetry` | هذه إشارة الحرف ت. استمع إليها مرة أخرى. |
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
| `letters/thaa/script.messageBack` | عاد الحرف ث إلى مكانه في الرسالة! |
| `letters/thaa/script.messageComplete` | عاد الحرف ث إلى الرسالة… واكتملت الرسالة كلها! استمع إليها: |
| `letters/thaa/script.mission` | مهمتك حتى الرسالة القادمة: ابحث في بيتك عن شيء يبدأ بصوت ث. |
| `letters/thaa/script.missionAsk` | أهلًا بعودتك! في الرسالة السابقة كانت مهمتك أن تبحث عن شيء يبدأ بصوت ث. هل وجدتَ شيئًا؟ قل اسمه! |
| `letters/thaa/script.missionSaved` | رائع! حفظتُ اكتشافك في أرشيف المحطة. هل يبدأ بصوت ث؟ استمع وتأكّد. |
| `letters/thaa/script.onairIntro` | معنا اليوم مذيع جديد في محطة كنعان! استمعوا إلى صوت الحرف ث: |
| `letters/thaa/script.onairNoVoice` | نطق مذيعنا الصغير صوت ث بصوت واضح! |
| `letters/thaa/script.onairWord` | وهذه كلمة اليوم: ثَوْب |
| `letters/thaa/script.revealHint` | انظر: فوق الحرف ث ثلاث نقاط. |
| `letters/thaa/script.reviewCorrect` | أحسنت! ما زلتَ تتذكّر صوت ث. |
| `letters/thaa/script.reviewRetry` | هذه إشارة الحرف ث. استمع إليها مرة أخرى. |
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
| `letters/thaal/script.messageBack` | عاد الحرف ذ إلى مكانه في الرسالة! |
| `letters/thaal/script.messageComplete` | عاد الحرف ذ إلى الرسالة… واكتملت الرسالة كلها! استمع إليها: |
| `letters/thaal/script.mission` | مهمتك حتى الرسالة القادمة: ابحث في بيتك عن شيء يبدأ بصوت ذ. |
| `letters/thaal/script.missionAsk` | أهلًا بعودتك! في الرسالة السابقة كانت مهمتك أن تبحث عن شيء يبدأ بصوت ذ. هل وجدتَ شيئًا؟ قل اسمه! |
| `letters/thaal/script.missionSaved` | رائع! حفظتُ اكتشافك في أرشيف المحطة. هل يبدأ بصوت ذ؟ استمع وتأكّد. |
| `letters/thaal/script.onairIntro` | معنا اليوم مذيع جديد في محطة كنعان! استمعوا إلى صوت الحرف ذ: |
| `letters/thaal/script.onairNoVoice` | نطق مذيعنا الصغير صوت ذ بصوت واضح! |
| `letters/thaal/script.onairWord` | وهذه كلمة اليوم: ذُرَة |
| `letters/thaal/script.revealHint` | انظر: فوق الحرف ذ نقطة واحدة. |
| `letters/thaal/script.reviewCorrect` | أحسنت! ما زلتَ تتذكّر صوت ذ. |
| `letters/thaal/script.reviewRetry` | هذه إشارة الحرف ذ. استمع إليها مرة أخرى. |
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
| `letters/zay/script.messageBack` | عاد الحرف ز إلى مكانه في الرسالة! |
| `letters/zay/script.messageComplete` | عاد الحرف ز إلى الرسالة… واكتملت الرسالة كلها! استمع إليها: |
| `letters/zay/script.mission` | مهمتك حتى الرسالة القادمة: ابحث في بيتك عن شيء يبدأ بصوت ز. |
| `letters/zay/script.missionAsk` | أهلًا بعودتك! في الرسالة السابقة كانت مهمتك أن تبحث عن شيء يبدأ بصوت ز. هل وجدتَ شيئًا؟ قل اسمه! |
| `letters/zay/script.missionSaved` | رائع! حفظتُ اكتشافك في أرشيف المحطة. هل يبدأ بصوت ز؟ استمع وتأكّد. |
| `letters/zay/script.onairIntro` | معنا اليوم مذيع جديد في محطة كنعان! استمعوا إلى صوت الحرف ز: |
| `letters/zay/script.onairNoVoice` | نطق مذيعنا الصغير صوت ز بصوت واضح! |
| `letters/zay/script.onairWord` | وهذه كلمة اليوم: زَيْت |
| `letters/zay/script.revealHint` | انظر: فوق الحرف ز نقطة واحدة. بدونها يصبح ر. |
| `letters/zay/script.reviewCorrect` | أحسنت! ما زلتَ تتذكّر صوت ز. |
| `letters/zay/script.reviewRetry` | هذه إشارة الحرف ز. استمع إليها مرة أخرى. |
| `letters/zay/script.speak` | الآن دورك! انطق صوت الحرف ز. |
| `letters/zay/script.success` | رائع يا مستكشف الحروف! لقد فككتَ الرسالة الحادية عشرة. |
| `letters/zay/script.transfer` | وصلتنا ثلاث قنوات جديدة! استمع إليها، واكتشف أيّ كلمة تبدأ بصوت ز. |
| `letters/zay/script.write` | لنكتب حرف ز! ابدأ من النقطة الخضراء واتبع السهم. |

