/**
 * الشاشة ١ — استقبال الرسالة (الاستوديو الحيّ)
 * لماذا؟ تهيئة دافعية: كنعان يرحّب بصوته، والراديو «يستقبل» الكلام أمام الطفل،
 * فيرتبط الصوت بالمحطة منذ اللحظة الأولى. لا يظهر الحرف هنا: المعرفة ستأتي من الأذن أولًا.
 * الانتباه يُوجَّه إلى زر «ابدأ الاستماع» بعد انتهاء الترحيب فقط (لا منافسة مع صوت كنعان).
 */
Kanaan.UI.registerScreen({
  id: 'welcome',
  stage: null,
  render({ ep, next, alive }) {
    const { el } = Kanaan.UI;
    const studio = Kanaan.Studio.create({
      ep,
      onStart() {
        Kanaan.Sound.unlock();
        Kanaan.Sound.stop();
        Kanaan.Sound.sfx('tune');
        next();
      }
    });
    const node = el('section.screen.screen--welcome', { 'aria-labelledby': 'welcome-title' },
      el('p.sr-only', null, 'استوديو إذاعي صغير: كنعان، طفل فلسطيني يرتدي سماعات وكوفية، يجلس أمام ميكروفون وراديو قديم، ومن النافذة تظهر القدس.'),
      studio.node);

    return {
      node,
      focus: '#welcome-title',
      async onEnter() {
        studio.mounted();
        await Kanaan.UI.wait(900); // يظهر كنعان أولًا، ثم يتكلم
        if (alive()) studio.greet();
      },
      cleanup() { studio.destroy(); }
    };
  }
});
