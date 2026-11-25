/**
 * الشاشة ٨ — رسالة النجاح
 * لماذا؟ تأمّل بسيط فيما أنجزه الطفل (ما وراء المعرفة) بلغة «أنا فعلتُ» لا بالدرجات،
 * التفاصيل الرقمية للمعلم فقط وفي قسم مطويّ. بعدها: على الهواء ← الرسالة الغامضة.
 */
Kanaan.UI.registerScreen({
  id: 'success',
  stage: null,
  render({ ep, next }) {
    const { el, button, digits } = Kanaan.UI;
    Kanaan.Progress.complete(ep.id);
    const rec = Kanaan.Progress.get(ep.id).activities;

    const items = [
      { icon: '⭐', text: 'اكتشفتَ الحرف', done: !!rec.revealed?.success },
      { icon: '🎙️', text: 'نطقتَ الصوت', done: !!rec.pronunciation?.completed },
      { icon: '🧩', text: 'بنيتَ الكلمة', done: !!rec.wordBuilding?.success },
      { icon: '👂', text: 'ميّزتَ الصوت', done: !!rec.discrimination?.success && !!rec.transfer?.success }
    ];

    const levelAr = { excellent: 'واضح', clear: 'صوت مسموع (دون تقييم آلي للمخرج)', close: 'قريب', retry: 'يحتاج إعادة', 'self-report': 'تقرير ذاتي' };
    const yesNo = (v) => (v ? 'نعم' : 'لا');
    const row = (label, a, extra = '') => el('tr', null,
      el('th', { scope: 'row' }, label),
      el('td', null, a ? yesNo(a.success || a.completed) : '—'),
      el('td', null, a ? digits(a.attempts) : '—'),
      el('td', null, a && a.firstTry != null ? yesNo(a.firstTry) : '—'),
      el('td', null, extra));
    const p = rec.pronunciation;
    const teacher = el('details.teacher', null,
      el('summary', null, 'ملخّص للمعلّم'),
      el('table', null,
        el('thead', null, el('tr', null, ['النشاط', 'أنجز؟', 'المحاولات', 'من أول مرة؟', 'ملاحظة'].map((h) => el('th', { scope: 'col' }, h)))),
        el('tbody', null,
          row('التمييز السمعي', rec.discrimination),
          row('النطق', p, p ? `أفضل تقدير: ${levelAr[p.best] || '—'}${p.mode === 'self-report' ? ' (دون ميكروفون)' : ''}` : ''),
          row('تركيب الكلمة', rec.wordBuilding),
          row('المعنى', rec.meaning),
          row('نقل التعلم', rec.transfer, rec.transfer ? `قنوات مسموعة: ${digits(rec.transfer.channelsHeard || 0)}` : ''),
          rec.review ? row('مراجعة الأرشيف', rec.review, `الحرف ${rec.review.letter}`) : null)),
      el('p.footnote', null, 'البيانات محفوظة على هذا الجهاز فقط. تقدير النطق تقريبي.'));

    const node = el('section.screen.screen--success', { 'aria-labelledby': 'success-title' },
      el('div.success-host', null,
        el('img.success-avatar', { src: 'assets/images/kanaan.webp', alt: '', width: 140, height: 140 }),
        el('h2.screen-title', { id: 'success-title', tabindex: '-1' }, ep.script.success)),
      el('ul.achievements', { 'aria-label': 'ما أنجزتُه' },
        items.map((it) => el(`li.achievement${it.done ? '.is-done' : ''}`, null,
          el('span.achievement-icon', { 'aria-hidden': 'true' }, it.icon),
          el('span', null, it.text),
          el('span.achievement-check', { 'aria-label': it.done ? 'تم' : 'لم يكتمل' }, it.done ? '✔' : '…')))),
      el('div.row.row--center', null, button('إلى الاستوديو', { icon: '🎙️', big: true, onClick: next })),
      teacher);

    return {
      node,
      onEnter() {
        Kanaan.Sound.sfx('built');
        Kanaan.Sound.say(ep.script.success);
      }
    };
  }
});
