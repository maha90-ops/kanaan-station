/**
 * الشاشة ١ — استقبال الرسالة
 * لماذا؟ تهيئة دافعية: «رسالة غامضة اختفى منها حرف» تحوّل التعلم إلى مهمة استكشاف.
 * لا يظهر الحرف هنا عمدًا: المعرفة ستأتي من الأذن أولًا.
 */
Kanaan.UI.registerScreen({
  id: 'welcome',
  stage: null,
  render({ ep, next }) {
    const { el, button } = Kanaan.UI;

    const start = el('button.hero-start', {
      type: 'button',
      'aria-label': 'ابدأ الاستماع',
      onclick: () => {
        Kanaan.Sound.unlock();
        Kanaan.Sound.stop();
        Kanaan.Sound.sfx('tune');
        next();
      }
    });

    const listen = button('اسمع كنعان', {
      variant: 'ghost', icon: '🔊',
      onClick: () => { Kanaan.Sound.unlock(); Kanaan.Sound.say(ep.script.welcome); }
    });

    const node = el('section.screen.screen--welcome', { 'aria-labelledby': 'welcome-title' },
      el('h1.sr-only', { id: 'welcome-title', tabindex: '-1' }, 'محطة كنعان للحروف — اسمع، اكتشف، انطق، ابنِ الكلمة'),
      el('div.hero', null,
        el('picture', null,
          el('source', { srcset: 'assets/images/hero.webp', type: 'image/webp' }),
          el('img.hero-img', {
            src: 'assets/images/hero.jpg', width: 1672, height: 941,
            alt: 'كنعان، طفل فلسطيني يرتدي سماعات وكوفية، يجلس في استوديو إذاعي صغير أمام ميكروفون وراديو قديم، ومن النافذة تظهر القدس.'
          })),
        start),
      el('div.hero-caption', null,
        el('p.hero-text', null, ep.script.welcome),
        listen,
        el('button.btn.btn--primary.hero-start-fallback', { type: 'button', onclick: () => start.click() },
          el('span.btn-icon', { 'aria-hidden': 'true' }, '▶'), el('span', null, 'ابدأ الاستماع'))));

    return { node, focus: '#welcome-title' };
  }
});
