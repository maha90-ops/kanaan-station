/**
 * ✉️ الرسالة الغامضة — الحرف المكتشف يعود إلى مكانه في الرسالة.
 * لماذا؟ قصة واحدة تربط الحلقات (لكل حرف سبب)، والحروف تظهر في كلمات داخل جملة
 * (مراجعة تراكمية في سياق). عند الاكتمال يقرأ كنعان الرسالة كلمةً كلمة مع تظليلها
 * (ربط المنطوق بالمكتوب). ثم تُعطى مهمة خارج الشاشة، ودعوة للرسالة التالية.
 */
Kanaan.UI.registerScreen({
  id: 'message',
  stage: null,
  render({ ep, alive, restart, goEpisode }) {
    const { el, button, digits, wait } = Kanaan.UI;
    const M = Kanaan.Message;
    const NON_JOINING = 'اأإآدذرزوؤة'; // حروف لا تتصل بما بعدها
    const split = (w) => w.match(/^(.[ً-ْ]*)(.*)$/u).slice(1);

    const slots = M.parts.filter((p) => typeof p === 'object');
    const learned = (p) => Kanaan.Progress.isDone(p.ep);
    const remaining = slots.filter((p) => !learned(p)).length;
    const complete = remaining === 0;

    // بناء الرسالة: الخانة المكتشفة تُظهر حرفها مميّزًا، والمجهولة تُظهر مربعًا
    const pieces = [];
    const line = el('p.message-text', { lang: 'ar' });
    M.parts.forEach((p) => {
      if (typeof p === 'string') {
        const s = el('span.msg-plain', null, p);
        line.append(s);
        if (p.trim().replace(/[،.:\s]/g, '')) pieces.push({ node: s, text: p });
        return;
      }
      const [first, rest] = split(p.word);
      const isNew = p.ep === ep.id;
      const w = el(`button.msg-word${isNew ? '.is-new' : ''}`, {
        type: 'button',
        'aria-label': learned(p) ? p.word : 'كلمة ينقصها حرف لم يُكتشف بعد',
        onclick: () => learned(p) && Kanaan.Sound.say(p.word, { rate: 0.75 })
      });
      if (learned(p)) w.append(el('mark.target', null, first), rest);
      else w.append(el('span.msg-gap', { 'aria-hidden': 'true' }), (NON_JOINING.includes(first[0]) ? '' : 'ـ') + rest);
      line.append(w);
      pieces.push({ node: w, text: p.word });
    });

    const missionCard = el('div.mission-card', { hidden: true },
      el('span.mission-letter', { 'aria-hidden': 'true' }, '🔎'),
      el('p', null, `مهمتك حتى الرسالة القادمة: ابحث في بيتك عن شيء يبدأ بصوت ${ep.letter}.`));

    const nextEp = Kanaan.Episodes.next(ep.id);
    const soon = el('div.next-slot');
    const nextRow = el('div.next-block', { hidden: true },
      el('p.question-text', null, nextEp ? 'هل أنت مستعد للرسالة التالية؟' : 'أنهيتَ كل رسائل المحطة! 🎉'),
      el('div.row.row--center', null,
        nextEp ? button('الرسالة التالية', { icon: '📻', big: true, onClick: () => goEpisode(nextEp.id) })
          : button('إنجازاتي', { icon: '🏆', big: true, onClick: () => Kanaan.Panels.achievements() }),
        button('أعد الحلقة', { variant: 'ghost', icon: '↺', onClick: restart })),
      soon);

    const readBtn = button('اقرأ الرسالة', { variant: 'secondary', icon: '🔊', onClick: () => readAll() });
    readBtn.hidden = !complete;

    let reading = false;
    async function readAll() {
      if (reading) return;
      reading = true;
      for (const p of pieces) {
        if (!alive()) return;
        p.node.classList.add('is-reading');
        await Kanaan.Sound.say(p.text, { rate: 0.8 });
        p.node.classList.remove('is-reading');
      }
      reading = false;
    }

    const node = el('section.screen.screen--message', { 'aria-labelledby': 'message-title' },
      el('h2.screen-title', { id: 'message-title', tabindex: '-1' }, '✉️ الرسالة الغامضة'),
      el('div.message-paper', null,
        el('p.message-from', null, M.title),
        line,
        el('p.message-count', { 'aria-live': 'polite' },
          complete ? 'اكتملت الرسالة!' : `حروف عادت: ${digits(slots.length - remaining)} من ${digits(slots.length)}`)),
      readBtn, missionCard, nextRow);

    return {
      node,
      async onEnter() {
        Kanaan.Progress.assignMission(ep.id);
        await wait(500);
        Kanaan.Sound.sfx('reveal');
        await Kanaan.Host.say(complete
          ? `عاد الحرف ${ep.letter} إلى الرسالة… واكتملت الرسالة كلها! استمع إليها:`
          : `عاد الحرف ${ep.letter} إلى مكانه في الرسالة! بقي ${remaining === 1 ? 'حرف واحد' : `${digits(remaining)} حروف`}.`);
        if (!alive()) return;
        if (complete) { Kanaan.Host.hide(); await readAll(); }
        if (!alive()) return;
        missionCard.hidden = false;
        missionCard.classList.add('appear');
        await Kanaan.Host.say(`مهمتك حتى الرسالة القادمة: ابحث في بيتك عن شيء يبدأ بصوت ${ep.letter}.`);
        if (!alive()) return;
        Kanaan.Host.hide();
        nextRow.hidden = false;
        nextRow.classList.add('appear');
      }
    };
  }
});
