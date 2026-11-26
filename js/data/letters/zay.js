/** حرف ز — بيانات فقط؛ الأنشطة يولّدها قالب واحد (انظر registry.js) */
Kanaan.Letters.add({
  id: 'zay',
  letter: 'ز',
  word: {
    text: 'زَيْت',
    letters: ['ز', 'ي', 'ت'],
    scene: 'olive-oil',
    alt: 'جرّة زيت زيتون وغصن زيتون'
  },
  options: ['ر', 'س', 'ز'],
  transfer: [
    ['سَمَك', false],
    ['زَهْرَة', true],
    ['طَيْر', false]
  ],
  revealHint: 'انظر: فوق الحرف ز نقطة واحدة. بدونها يصبح ر.'
});
