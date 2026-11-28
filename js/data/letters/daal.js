/** حرف د — بيانات فقط؛ الأنشطة يولّدها قالب واحد (انظر registry.js) */
Kanaan.Letters.add({
  id: 'daal',
  letter: 'د',
  word: {
    text: 'دِيك',
    letters: ['د', 'ي', 'ك'],
    scene: 'rooster',
    alt: 'ديك ملوّن بعرف أحمر'
  },
  options: ['ت', 'د', 'ذ'],
  transfer: [
    ['تِين', false],
    ['دُبّ', true],
    ['بَاب', false]
  ],
  writing: {
    strokes: [
      'M100 76 C122 96 148 122 156 148 C160 162 150 168 134 168 L82 168'
    ],
    dots: []
  },
  revealHint: 'انظر: الحرف د بلا نقاط، ولا يتصل بالحرف الذي بعده.',
  shapes: [['دِيك', 'start'], ['بَدْر', 'middle'], ['وَلَد', 'end']]
});
