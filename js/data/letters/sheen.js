/** حرف ش — بيانات فقط؛ الأنشطة يولّدها قالب واحد (انظر registry.js) */
Kanaan.Letters.add({
  id: 'sheen',
  letter: 'ش',
  word: {
    text: 'شَمْس',
    letters: ['ش', 'م', 'س'],
    scene: 'sun-hills',
    alt: 'شمس دافئة فوق تلال فيها شجرة زيتون'
  },
  options: ['س', 'ش', 'ز'],
  transfer: [
    ['تِين', false],
    ['سَمَك', false],
    ['شَاي', true]
  ],
  revealHint: 'انظر: فوق الحرف ش ثلاث نقاط.'
});
