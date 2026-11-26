/** حرف ح — بيانات فقط؛ الأنشطة يولّدها قالب واحد (انظر registry.js) */
Kanaan.Letters.add({
  id: 'haa',
  letter: 'ح',
  word: {
    text: 'حِصَان',
    letters: ['ح', 'ص', 'ا', 'ن'],
    scene: 'horse',
    alt: 'حصان بنيّ يقف في الحقل'
  },
  options: ['هـ', 'ح', 'خ'],
  transfer: [
    ['هِلَال', false],
    ['حَلِيب', true],
    ['خُبْز', false]
  ],
  writing: {
    strokes: [
      'M70 88 C100 72 150 74 182 88 C130 98 86 122 84 158 C82 196 130 212 184 196'
    ],
    dots: []
  },
  revealHint: 'انظر: الحرف ح بلا نقاط.'
});
