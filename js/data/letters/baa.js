/** حرف ب — بيانات فقط؛ الأنشطة يولّدها قالب واحد (انظر registry.js) */
Kanaan.Letters.add({
  id: 'baa',
  letter: 'ب',
  word: {
    text: 'بَيْت',
    letters: ['ب', 'ي', 'ت'],
    scene: 'stone-house',
    image: 'assets/images/words/bayt.webp',   // صورة حقيقية (تتقدّم على الرسمة)
    alt: 'بيت فلسطيني من حجر بباب أزرق مقوّس ونافذة فيها زهور، وبجانبه شجرة زيتون'
  },
  options: ['ت', 'ب', 'م'],
  transfer: [
    ['مَاء', false],
    ['بَاب', true],
    ['دَار', false]
  ],
  writing: {
    strokes: [
      'M186 112 C190 150 170 168 120 168 C72 168 50 152 54 120'
    ],
    dots: [
      [120, 204]
    ]
  },
  revealHint: 'انظر: تحت الحرف ب نقطة واحدة.',
  shapes: [['بَيْت', 'start'], ['حَبْل', 'middle'], ['كَلْب', 'end']]
});
