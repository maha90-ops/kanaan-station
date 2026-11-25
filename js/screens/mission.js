/**
 * تقرير المهمة — في بداية الحلقة، عن مهمة الحلقة السابقة.
 * لماذا؟ ينقل التعلّم إلى بيت الطفل وحياته (تعميم)، ويُشرك الأسرة،
 * ويُعيد الحرف السابق إلى الذاكرة قبل حرف جديد. لا تقييم هنا: المهم أن يبحث ويسمّي.
 */
Kanaan.UI.registerScreen({
  id: 'mission',
  stage: null,
  render({ next, alive, missionEp: prev }) {
    const { el, button, digits } = Kanaan.UI;
    let rec = null, url = null;
    const panel = el('div.mic-panel');

    const done = (found) => {
      Kanaan.Progress.reportMission(prev.id, found);
      next();
    };

    function ask() {
      panel.replaceChildren(
        el('button.mic-btn', { type: 'button', onclick: record },
          el('span.mic-icon', { 'aria-hidden': 'true' }, '🎙️'),
          el('span.mic-label', null, 'قل اسم ما وجدتَه')),
        el('div.row.row--center', null,
          button('لم أجد بعد', { variant: 'ghost', icon: '🔎', onClick: async () => {
            Kanaan.Progress.reportMission(prev.id, false);
            await Kanaan.Host.say('لا بأس! الأصوات حولنا في كل مكان، ستجدها.');
            if (alive()) next();
          } })));
    }

    async function record() {
      Kanaan.Host.hide();
      const left = el('span.rec-time');
      const stop = button('إيقاف', { variant: 'stop', icon: '⏹', onClick: () => finish() });
      panel.replaceChildren(
        el('div.rec-indicator', { role: 'status' }, el('span.rec-dot', { 'aria-hidden': 'true' }), 'أسمعك الآن… ', left),
        el('div.row.row--center', null, stop));
      try {
        rec = await Kanaan.Recorder.start({
          maxMs: 3500,
          onLevel() {
            if (!rec) return;
            const e = performance.now() - rec.startedAt;
            left.textContent = `(${digits(Math.max(0, Math.ceil((3500 - e) / 1000)))})`;
            if (e >= 3500) finish();
          }
        });
      } catch (e) {
        // لا ميكروفون: يخبر المعلم/الأهل
        panel.replaceChildren(
          el('p.result-tip', null, 'قل اسم ما وجدتَه لمعلّمك أو لأحد أفراد أسرتك.'),
          el('div.row.row--center', null, button('قلتُه', { icon: '✔', onClick: () => done(true) })));
      }
    }

    let finishing = false;
    async function finish() {
      if (!rec || finishing) return;
      finishing = true;
      const r = await rec.stop();
      rec = null;
      if (!alive()) return;
      url = r.playbackUrl;
      Kanaan.Archive.save(`mission:${prev.id}`, r.blob);
      panel.replaceChildren(
        el('p.heard', null, '👂 استمعتُ إليك.'),
        el('div.row.row--center', null,
          url ? button('استمع لصوتك', { variant: 'secondary', icon: '▶', onClick: () => new Audio(url).play() }) : null,
          button('متابعة', { icon: '←', onClick: () => done(true) })));
      Kanaan.Sound.sfx('success');
      Kanaan.Host.say(`رائع! حفظتُ اكتشافك في أرشيف المحطة. هل يبدأ بصوت ${prev.letter}؟ استمع وتأكّد.`);
    }

    ask();
    const node = el('section.screen.screen--mission', { 'aria-labelledby': 'mission-title' },
      el('h2.screen-title', { id: 'mission-title', tabindex: '-1' }, '🔎 تقرير المهمة'),
      el('div.mission-card', null,
        el('span.mission-letter', { 'aria-hidden': 'true' }, prev.letter),
        el('p', null, `مهمتك كانت: ابحث في بيتك عن شيء يبدأ بصوت ${prev.letter}.`)),
      panel);

    return {
      node,
      onEnter() { Kanaan.Host.say(`أهلًا بعودتك! في الرسالة السابقة كانت مهمتك أن تبحث عن شيء يبدأ بصوت ${prev.letter}. هل وجدتَ شيئًا؟ قل اسمه!`); },
      cleanup() { if (rec) rec.stop(); if (url) URL.revokeObjectURL(url); }
    };
  }
});
