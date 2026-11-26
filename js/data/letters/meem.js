/** حرف م — بيانات فقط؛ الأنشطة يولّدها قالب واحد (انظر registry.js) */
Kanaan.Letters.add({
  id: 'meem',
  letter: 'م',
  word: {
    text: 'مَوْز',
    letters: ['م', 'و', 'ز'],
    scene: 'bananas',
    alt: 'عنقود من حبات الموز الصفراء'
  },
  options: ['ن', 'م', 'ب'],
  transfer: [
    ['نَار', false],
    ['بَاب', false],
    ['مَاء', true]
  ],
  revealHint: 'انظر: رأس الحرف م دائرة صغيرة، مثل فمك وهو مغلق.'
});
