/** حرف ت — بيانات فقط؛ الأنشطة يولّدها قالب واحد (انظر registry.js) */
Kanaan.Letters.add({
  id: 'taa',
  letter: 'ت',
  word: {
    text: 'تِين',
    letters: ['ت', 'ي', 'ن'],
    scene: 'figs',
    alt: 'طبق فيه ثمار تين بنفسجية'
  },
  options: ['د', 'ت', 'ط'],
  transfer: [
    ['دَار', false],
    ['كَعْك', false],
    ['تُفَّاح', true]
  ],
  writing: {
    strokes: [
      'M186 112 C190 150 170 168 120 168 C72 168 50 152 54 120'
    ],
    dots: [
      [104, 86],
      [136, 86]
    ]
  },
  revealHint: 'انظر: فوق الحرف ت نقطتان.'
});
