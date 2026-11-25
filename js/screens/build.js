/**
 * الشاشة ٥ — ابنِ الكلمة
 * لماذا؟ ينتقل الطفل من الصوت المفرد إلى الكلمة (الدمج الصوتي)، ويرى أن الحروف
 * تتغيّر أشكالها عندما تتصل: ش + م + س ← شَمْس.
 * لماذا لا تظهر الصورة؟ حتى يبني الكلمة من أصواتها لا من تخمين الصورة.
 * التفاعل: لمس الحرف يضعه في أول خانة فارغة (يناسب الهاتف ولوحة المفاتيح)، والسحب متاح أيضًا.
 */
Kanaan.UI.registerScreen({
  id: 'build',
  stage: 'build',
  render({ ep, next, alive }) {
    const { el, button, feedback, wait, digits } = Kanaan.UI;
    const act = ep.wordBuildingActivity;
    const word = ep.exampleWord;
    const fbSlot = el('div.feedback-slot');
    let done = false;

    const slots = act.target.map((_, i) => el('button.slot', {
      type: 'button', 'aria-label': `الخانة ${digits(i + 1)}: فارغة`, dataset: { index: i },
      onclick: () => returnTile(i)
    }, el('span.slot-num', { 'aria-hidden': 'true' }, digits(i + 1))));
    const placed = act.target.map(() => null);

    const tiles = act.tiles.map((letter, i) => {
      const t = el('button.tile', { type: 'button', 'aria-label': `الحرف ${letter}`, dataset: { id: i } }, letter);
      t.addEventListener('click', (e) => { if (!t.dataset.dragged) placeTile(i); delete t.dataset.dragged; e.preventDefault(); });
      enableDrag(t, i);
      return t;
    });
    const tray = el('div.tray', { role: 'group', 'aria-label': 'الحروف المبعثرة' }, tiles);

    function placeTile(tileIdx, slotIdx) {
      if (done) return;
      if (slotIdx == null) slotIdx = placed.indexOf(null);
      if (slotIdx < 0) return;
      if (placed[slotIdx] != null) returnTile(slotIdx, true);
      const from = placed.indexOf(tileIdx);
      if (from >= 0) clearSlot(from);
      placed[slotIdx] = tileIdx;
      const letter = act.tiles[tileIdx];
      tiles[tileIdx].classList.add('is-used');
      tiles[tileIdx].setAttribute('disabled', '');
      slots[slotIdx].classList.add('is-filled');
      slots[slotIdx].replaceChildren(el('span.slot-letter', null, letter), el('span.slot-num', { 'aria-hidden': 'true' }, digits(slotIdx + 1)));
      slots[slotIdx].setAttribute('aria-label', `الخانة ${digits(slotIdx + 1)}: ${letter}. اضغط لإرجاعه`);
      Kanaan.Sound.sfx('tap');
      if (!placed.includes(null)) check();
    }

    function clearSlot(i) {
      placed[i] = null;
      slots[i].classList.remove('is-filled', 'is-wrong');
      slots[i].replaceChildren(el('span.slot-num', { 'aria-hidden': 'true' }, digits(i + 1)));
      slots[i].setAttribute('aria-label', `الخانة ${digits(i + 1)}: فارغة`);
    }

    function returnTile(i, silent) {
      if (done || placed[i] == null) return;
      const t = tiles[placed[i]];
      t.classList.remove('is-used'); t.removeAttribute('disabled');
      clearSlot(i);
      if (!silent) Kanaan.Sound.sfx('tap');
    }

    async function check() {
      const letters = placed.map((t) => act.tiles[t]);
      const ok = letters.every((l, i) => l === act.target[i]);
      Kanaan.Progress.attempt(ep.id, 'wordBuilding', ok);
      if (ok) {
        done = true;
        Kanaan.Sound.sfx('built');
        // الحروف المنفصلة تندمج في كلمة متصلة
        const joined = el('div.joined', null,
          el('p.equation', { 'aria-hidden': 'true' }, act.target.join(' + '), ' = '),
          el('p.joined-word', { lang: 'ar' }, word.text));
        board.classList.add('is-merging');
        await wait(550);
        board.replaceChildren(joined);
        tray.hidden = true;
        fbSlot.replaceChildren(feedback('success', ep.feedback.build.correct));
        await Kanaan.Sound.say(word.text, { audio: word.audio, rate: 0.7 });
        if (!alive()) return;
        await Kanaan.Sound.say(ep.feedback.build.correct, { who: 'kanaan' });
        await wait(600);
        if (alive()) next();
      } else {
        Kanaan.Sound.sfx('gentle');
        // نُرجع فقط الحروف التي ليست في مكانها: يحتفظ الطفل بما أنجزه
        letters.forEach((l, i) => { if (l !== act.target[i]) slots[i].classList.add('is-wrong'); });
        fbSlot.replaceChildren(feedback('retry', ep.feedback.build.retry));
        Kanaan.Sound.say(ep.feedback.build.retry, { who: 'kanaan' });
        await wait(900);
        letters.forEach((l, i) => { if (l !== act.target[i]) returnTile(i, true); });
      }
    }

    /* سحب بالمؤشر (لمس/فأرة) — اختياري؛ اللمس البسيط يكفي */
    function enableDrag(tile, idx) {
      tile.addEventListener('pointerdown', (e) => {
        if (done || tile.disabled) return;
        const sx = e.clientX, sy = e.clientY;
        let ghost = null;
        const move = (ev) => {
          if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) {
            ghost = tile.cloneNode(true);
            ghost.classList.add('tile--ghost');
            document.body.append(ghost);
            tile.dataset.dragged = '1';
          }
          if (ghost) ghost.style.transform = `translate(${ev.clientX - 36}px, ${ev.clientY - 36}px)`;
        };
        const up = (ev) => {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
          if (!ghost) return;
          ghost.remove();
          const target = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.slot');
          if (target) placeTile(idx, +target.dataset.index);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      });
    }

    const board = el('div.board', { role: 'group', 'aria-label': 'خانات الكلمة، تبدأ من اليمين' },
      el('span.board-start', { 'aria-hidden': 'true' }, 'البداية'),
      el('div.slots', null, slots));

    const node = el('section.screen.screen--build', { 'aria-labelledby': 'build-title' },
      el('h2.screen-title', { id: 'build-title', tabindex: '-1' }, 'ابنِ الكلمة'),
      el('p.instruction', null, act.prompt),
      board, tray,
      el('div.row.row--center', null,
        button('اسمع الكلمة', { variant: 'ghost', icon: '🔊', onClick: () => Kanaan.Sound.say(word.text, { audio: word.audio, rate: 0.6 }) })),
      fbSlot);

    return { node, onEnter() { Kanaan.Host.say(ep.script.build); } };
  }
});
