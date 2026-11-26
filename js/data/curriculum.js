/**
 * المنهج — ترتيب الحروف ومجموعاتها. غيّر الترتيب هنا فقط؛ ملفات الحروف لا تتغير.
 * كل مجموعة لها «رسالة غامضة» تعود إليها حروفها واحدًا بعد الآخر.
 *
 * لإضافة حرف: أنشئ js/data/letters/<id>.js، وأضف وسم <script> له في index.html،
 * ثم ضع معرّفه في مجموعة هنا.
 */
Kanaan.Curriculum = (function () {
  const groups = [
    {
      id: 'g1',
      title: 'المجموعة الأولى',
      letters: ['alif', 'baa', 'taa', 'thaa', 'jeem', 'haa', 'khaa', 'daal', 'thaal'],
      message: {
        title: 'رسالة من قرية فلسطينية',
        // كل خانة: كلمة يختفي حرفها الأول حتى يُكتشف حرفها
        parts: [
          'فِي قَرْيَتِنَا: ',
          { ep: 'baa', word: 'بَيْت' }, '، ',
          { ep: 'alif', word: 'أَرْنَب' }, '، ',
          { ep: 'taa', word: 'تِين' }, '، ',
          { ep: 'thaa', word: 'ثَوْب' }, '، ',
          { ep: 'jeem', word: 'جَمَل' }, '، ',
          { ep: 'haa', word: 'حِصَان' }, '، ',
          { ep: 'khaa', word: 'خُبْز' }, '، ',
          { ep: 'daal', word: 'دِيك' }, '، وَ',
          { ep: 'thaal', word: 'ذُرَة' }, '.'
        ]
      }
    },
    {
      id: 'g2',
      title: 'المجموعة الثانية',
      letters: ['sheen', 'meem', 'zay', 'ain'],
      message: {
        title: 'رسالة من بيتٍ في فلسطين',
        parts: [
          'مِنْ فِلَسْطِين: ',
          { ep: 'sheen', word: 'شَمْس' }, '، ',
          { ep: 'meem', word: 'مَوْز' }, '، ',
          { ep: 'ain', word: 'عِنَب' }, '، وَ',
          { ep: 'zay', word: 'زَيْت' }, '.'
        ]
      }
    }
  ];

  return {
    groups,
    order: () => groups.flatMap((g) => g.letters),
    groupOf: (id) => groups.find((g) => g.letters.includes(id)) || groups[0]
  };
})();
