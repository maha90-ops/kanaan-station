/** حرف ا — بيانات فقط؛ الأنشطة يولّدها قالب واحد (انظر registry.js) */
Kanaan.Letters.add({
  id: 'alif',
  letter: 'ا',
  wordLetter: 'أ',
  letterName: 'الألف',
  word: {
    text: 'أَرْنَب',
    letters: ['أ', 'ر', 'ن', 'ب'],
    scene: 'rabbit',
    alt: 'أرنب أبيض صغير يجلس على العشب'
  },
  options: ['ع', 'أ', 'هـ'],
  contrast: 'ع',
  transfer: [
    ['عَيْن', false],
    ['أَسَد', true],
    ['وَلَد', false]
  ],
  writing: {
    strokes: [
      'M120 40 L120 196'
    ],
    dots: []
  },
  revealHint: 'الألف خط مستقيم من أعلى إلى أسفل، وقد تأتي معه همزة: أ.'
});
