/** حرف ث — بيانات فقط؛ الأنشطة يولّدها قالب واحد (انظر registry.js) */
Kanaan.Letters.add({
  id: 'thaa',
  letter: 'ث',
  word: {
    text: 'ثَوْب',
    letters: ['ث', 'و', 'ب'],
    scene: 'thob',
    alt: 'ثوب فلسطيني مطرّز بالأحمر'
  },
  options: ['س', 'ث', 'ف'],
  contrast: 'س',
  transfer: [
    ['ثَلْج', true],
    ['سَمَك', false],
    ['قَمَر', false]
  ],
  writing: {
    strokes: [
      'M186 112 C190 150 170 168 120 168 C72 168 50 152 54 120'
    ],
    dots: [
      [120, 62],
      [104, 88],
      [136, 88]
    ]
  },
  revealHint: 'انظر: فوق الحرف ث ثلاث نقاط.',
  shapes: [['ثَوْب', 'start'], ['كَثِير', 'middle'], ['مُثَلَّث', 'end']]
});
