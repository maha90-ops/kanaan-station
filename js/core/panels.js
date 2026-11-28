/**
 * لوحات الاستوديو (أزرار المكتب الأربعة) — نوافذ حوار بسيطة:
 *   إنجازاتي ..... لوحة الترددات: كل حرف مكتشف محطة يستمع إليها الطفل مع صوته
 *   تقدمي ........ الحروف وما أُنجز في كل منها + الرسالة الغامضة
 *   دليل المعلم ... المنطق التربوي، طريقة الاستخدام، بيانات الطلبة على هذا الجهاز
 *   عن المحطة .... فكرة المشروع
 */
Kanaan.Panels = (function () {
  const { el, digits } = Kanaan.UI;

  function open(id, title, ...content) {
    let d = document.getElementById('panel-dialog');
    if (!d) {
      d = el('dialog.dial-dialog.panel', { id: 'panel-dialog', 'aria-labelledby': 'panel-title' });
      document.body.append(d);
      d.addEventListener('close', () => Kanaan.Sound.stop());
      d.addEventListener('click', (e) => { if (e.target === d) d.close(); }); // نقرة خارج النافذة
    }
    Kanaan.Sound.stop();
    Kanaan.Host.hide();
    d.dataset.panel = id;
    d.replaceChildren(
      el('h2.screen-title', { id: 'panel-title' }, title),
      ...content,
      el('form', { method: 'dialog' }, el('button.btn.btn--secondary', { type: 'submit' }, 'إغلاق')));
    d.showModal();
    return d;
  }

  const STAGE_ICONS = Kanaan.UI.STAGES.map((s) => [s.key, s.icon, s.label]);

  function achievements() {
    const eps = Kanaan.Episodes.list();
    const n = eps.filter((e) => Kanaan.Progress.isDone(e.id)).length;
    open('achievements', '🏆 إنجازاتي',
      el('p.instruction', null, n ? `اكتشفتَ ${digits(n)} من ${digits(eps.length)} حروف. كل حرف صار محطة: استمع إليه، وإلى صوتك، وإلى الكلمة التي اكتشفتَها.` : 'لم تكتشف أي حرف بعد. ابدأ الاستماع، وكل حرف تكتشفه يصير محطة هنا!'),
      Kanaan.Dial.create().node);
  }

  function progress() {
    const eps = Kanaan.Episodes.list();
    const firstOpen = eps.find((e) => !Kanaan.Progress.isDone(e.id));
    const rows = eps.map((ep, i) => {
      const done = Kanaan.Progress.isDone(ep.id);
      const stages = Kanaan.Progress.stagesDone(ep.id);
      const isNext = firstOpen && firstOpen.id === ep.id;
      return el(`li.prog-row${done ? '.is-done' : ''}${isNext ? '.is-next' : ''}`, null,
        el('span.prog-letter', { 'aria-hidden': 'true' }, done || isNext ? ep.letter : '؟'),
        el('span.prog-name', null, `الرسالة ${digits(i + 1)}`, done ? ` — حرف ${ep.letterName}` : isNext ? ' — التالية' : ''),
        el('span.prog-stages', { 'aria-label': done ? 'مكتملة' : `${digits(stages.length)} من ${digits(STAGE_ICONS.length)} مراحل` },
          STAGE_ICONS.map(([k, icon, label]) => el(`span.prog-stage${done || stages.includes(k) ? '.on' : ''}`, { title: label, 'aria-hidden': 'true' }, icon))));
    });
    // مقسّمة حسب مجموعات المنهج، داخل منطقة تمرير
    const byGroup = Kanaan.Curriculum.groups.map((g) => el('section.prog-group', null,
      el('h3.prog-group-title', null, g.title),
      el('ol.prog-list', null, rows.filter((_, i) => g.letters.includes(eps[i].id)))));
    open('progress', '📊 تقدمي',
      el('div.prog-scroll', null, byGroup),
      firstOpen ? el('p.footnote', null, `ستبدأ المحطة من الرسالة ${digits(eps.indexOf(firstOpen) + 1)}.`) : el('p.footnote', null, 'أنهيتَ كل الرسائل! 🎉'));
  }

  function teacher() {
    const eps = Kanaan.Episodes.list();
    const levelAr = { excellent: 'واضح', clear: 'مسموع', close: 'قريب', retry: 'إعادة', 'self-report': 'ذاتي' };
    const yes = (a) => (a ? (a.success || a.completed ? '✔' : '…') : '—');
    const tries = (a) => (a ? digits(a.attempts) : '—');
    const table = el('table', null,
      el('thead', null, el('tr', null, ['الحرف', 'تمييز', 'نطق', 'بناء', 'نقل', 'أفضل نطق'].map((h) => el('th', { scope: 'col' }, h)))),
      el('tbody', null, eps.map((ep) => {
        const a = Kanaan.Progress.get(ep.id).activities;
        const cell = (x) => el('td', null, `${yes(x)} ${x ? `(${tries(x)})` : ''}`);
        return el('tr', null, el('th', { scope: 'row' }, ep.letter),
          cell(a.discrimination), cell(a.pronunciation), cell(a.wordBuilding), cell(a.transfer),
          el('td', null, a.pronunciation ? levelAr[a.pronunciation.best] || '—' : '—'));
      })));

    const exportBtn = Kanaan.UI.button('تنزيل البيانات (JSON)', {
      variant: 'secondary', icon: '⬇',
      onClick() {
        const blob = new Blob([JSON.stringify(Kanaan.Progress.export(), null, 2)], { type: 'application/json' });
        const a = el('a', { href: URL.createObjectURL(blob), download: 'kanaan-progress.json' });
        document.body.append(a); a.click(); a.remove();
      }
    });
    const resetBtn = Kanaan.UI.button('مسح تقدّم هذا الجهاز', {
      variant: 'ghost', icon: '🗑',
      onClick() {
        if (confirm('سيُمسح التقدّم وتسجيلات الطفل من هذا الجهاز. هل أنت متأكد؟')) { Kanaan.Progress.reset(); location.reload(); }
      }
    });

    open('teacher', '📖 دليل المعلم',
      el('div.guide', null,
        el('h3', null, 'مسار كل رسالة (٧ مراحل)'),
        el('ol', null,
          el('li', null, el('b', null, 'أستمع: '), 'يسمع الطفل الصوت المختبئ («بَ بَ بَ») قبل أي رمز أو صورة.'),
          el('li', null, el('b', null, 'أميّز: '), 'يستمع إلى أصوات متقاربة (دون حروف) ويختار الصوت الذي سمعه.'),
          el('li', null, el('b', null, 'أكتشف: '), 'يظهر الحرف تدريجيًا من الراديو: الصوت أولًا ثم الرمز.'),
          el('li', null, el('b', null, 'أنطق: '), 'يسجّل صوته ويسمعه ويقارنه بالنموذج. التقييم تقريبي، ولا يمنع التقدّم أبدًا.'),
          el('li', null, el('b', null, 'أبني: '), 'يركّب الكلمة من حروفها، ثم تظهر صورتها (الصورة مكافأة معنى، لا تلميح).'),
          el('li', null, el('b', null, 'أكتب: '), 'ثلاثة مستويات: أتتبّع (مسار منقّط ونقطة بداية وسهم) ← أُكمل (نقاط أقل) ← أكتب (دون مسار).'),
          el('li', null, el('b', null, 'أوظّف: '), 'يحدد موضع الصوت في الكلمة، ثم يميّزه في كلمات جديدة تُسمع قبل أن تُرى.')),
        el('h3', null, 'نصائح للاستخدام'),
        el('ul', null,
          el('li', null, 'استخدم سماعات أو مكانًا هادئًا: التمييز السمعي يتأثر بالضجيج.'),
          el('li', null, 'إن لم يعمل الميكروفون، يستطيع الطفل النطق أمامك ثم الضغط على «نطقتُ الصوت».'),
          el('li', null, 'زر «أوقف الحركة» في الصفحة الرئيسية يوقف الحركة المستمرة للأطفال سريعي التشتت.'),
          el('li', null, 'البيانات والتسجيلات محفوظة على هذا الجهاز فقط ولا تُرسل إلى أي مكان.')),
        el('h3', null, 'بيانات هذا الجهاز'),
        el('p.footnote', null, '✔ أُنجز · … بدأ ولم ينجح بعد · الرقم = عدد المحاولات'),
        table,
        el('div.row.row--center', null, exportBtn, resetBtn)));
  }

  function about() {
    open('about', 'ℹ️ عن المحطة',
      el('div.guide', null,
        el('p', null, 'محطة كنعان للحروف بيئة تعلّم سمعية للمرحلة الأساسية المبكرة. يقودها كنعان، طفل فلسطيني يعمل مذيعًا في محطة إذاعية صغيرة.'),
        el('p', null, 'في كل حلقة تصل «رسالة غامضة» ينقصها حرف. يكتشفه الطفل بأذنه أولًا، ثم يراه، ثم ينطقه، ثم يبني به كلمة، ثم يستخدمه في كلمات جديدة. وكل حرف يكتشفه يعود إلى مكانه في الرسالة.'),
        el('p', null, 'الكلمات والمشاهد مستوحاة من البيت الفلسطيني: الشمس والتين والزيتون والعنب والدار.'),
        el('p.footnote', null, 'تقييم النطق في المحطة تقديري يساعد الطفل على المحاولة، ولا يغني عن أذن المعلم.')));
  }

  return { open, achievements, progress, teacher, about };
})();
