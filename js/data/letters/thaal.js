/** حرف ذ — بيانات فقط؛ الأنشطة يولّدها قالب واحد (انظر registry.js) */
Kanaan.Letters.add({
  id: 'thaal',
  letter: 'ذ',
  word: {
    text: 'ذُرَة',
    letters: ['ذ', 'ر', 'ة'],
    scene: 'corn',
    alt: 'كوز ذرة أصفر بأوراق خضراء'
  },
  options: ['ز', 'ذ', 'د'],
  contrast: 'ز',
  transfer: [
    ['زَيْت', false],
    ['ثَوْب', false],
    ['ذَهَب', true]
  ],
  writing: {
    strokes: [
      'M100 76 C122 96 148 122 156 148 C160 162 150 168 134 168 L82 168'
    ],
    dots: [
      [100, 46]
    ]
  },
  revealHint: 'انظر: فوق الحرف ذ نقطة واحدة.'
});
