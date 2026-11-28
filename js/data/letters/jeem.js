/** حرف ج — بيانات فقط؛ الأنشطة يولّدها قالب واحد (انظر registry.js) */
Kanaan.Letters.add({
  id: 'jeem',
  letter: 'ج',
  word: {
    text: 'جَمَل',
    letters: ['ج', 'م', 'ل'],
    scene: 'camel',
    alt: 'جمل بنيّ بسنام واحد'
  },
  options: ['ش', 'ج', 'ك'],
  transfer: [
    ['شَمْس', false],
    ['نَار', false],
    ['جَبَل', true]
  ],
  writing: {
    strokes: [
      'M70 88 C100 72 150 74 182 88 C130 98 86 122 84 158 C82 196 130 212 184 196'
    ],
    dots: [
      [128, 150]
    ]
  },
  revealHint: 'انظر: في بطن الحرف ج نقطة واحدة.',
  shapes: [['جَمَل', 'start'], ['نَجْمَة', 'middle'], ['ثَلْج', 'end']]
});
