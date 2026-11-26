/** حرف خ — بيانات فقط؛ الأنشطة يولّدها قالب واحد (انظر registry.js) */
Kanaan.Letters.add({
  id: 'khaa',
  letter: 'خ',
  word: {
    text: 'خُبْز',
    letters: ['خ', 'ب', 'ز'],
    scene: 'bread',
    alt: 'أرغفة خبز طابون على سلة'
  },
  options: ['غ', 'خ', 'ح'],
  transfer: [
    ['خَرُوف', true],
    ['غَيْمَة', false],
    ['حِصَان', false]
  ],
  writing: {
    strokes: [
      'M70 88 C100 72 150 74 182 88 C130 98 86 122 84 158 C82 196 130 212 184 196'
    ],
    dots: [
      [126, 48]
    ]
  },
  revealHint: 'انظر: فوق الحرف خ نقطة واحدة.'
});
