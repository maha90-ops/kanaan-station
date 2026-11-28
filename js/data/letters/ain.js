/** حرف ع — بيانات فقط؛ الأنشطة يولّدها قالب واحد (انظر registry.js) */
Kanaan.Letters.add({
  id: 'ain',
  letter: 'ع',
  word: {
    text: 'عِنَب',
    letters: ['ع', 'ن', 'ب'],
    scene: 'grapes',
    alt: 'عنقود عنب بنفسجي وورقة عنب'
  },
  options: ['أ', 'ح', 'ع'],
  transfer: [
    ['أَرْنَب', false],
    ['دَار', false],
    ['عَيْن', true]
  ],
  revealHint: 'انظر: رأس الحرف ع مفتوح مثل فم صغير.',
  shapes: [['عِنَب', 'start'], ['شَمْعَة', 'middle'], ['إِصْبَع', 'end']]
});
