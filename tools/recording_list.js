/**
 * يولّد قائمة التسجيلات الكاملة من بيانات الحروف: كل «اسم صوت» (cue) ونصه.
 * الاستخدام (من جذر المشروع):  node tools/recording_list.js
 * المخرجات: assets/audio/RECORDING_LIST.md
 *
 * سمِّ كل ملف باسمه حرفيًا (مثلًا assets/audio/letters/baa/script.reveal.mp3)،
 * ثم شغّل: python3 tools/build_audio_manifest.py
 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="(js\/data\/[^"]+)"/g)].map((m) => m[1]);
const sandbox = { window: {}, console };
sandbox.window.Kanaan = sandbox.Kanaan = {};
vm.createContext(sandbox);
for (const f of files) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f });
vm.runInContext(fs.readFileSync(path.join(root, 'js/core/audio-lib.js'), 'utf8'), sandbox);
const K = sandbox.Kanaan;
const eps = K.Episodes.list();

const LINE_KEYS = [];
const walk = (o, pre) => Object.entries(o).forEach(([k, v]) => (typeof v === 'string' ? LINE_KEYS.push(pre + k) : v && typeof v === 'object' && walk(v, pre + k + '.')));
walk(eps[0].script, 'script.');
walk(eps[0].feedback, 'feedback.');
['meaningActivity.prompt', 'phonemeActivity.prompt'].forEach((k) => LINE_KEYS.push(k));

const rows = new Map(); // cue -> text
const add = (cue, text) => { if (text && !rows.has(cue)) rows.set(cue, text); };
for (const ep of eps) {
  add(`listen/${ep.wordLetter}`, `${ep.sound.label} ${ep.sound.label} ${ep.sound.label}`);
  [ep.wordLetter, ...ep.phonemeActivity.options, ep.phonemeActivity.contrast?.letter].filter(Boolean)
    .forEach((l) => add(`phonemes/${l}`, (ep.phonemeActivity.sounds[l] || ep.phonemeActivity.contrast || {}).label || `${l}َ`));
  add(K.AudioLib.wordCue(ep.exampleWord.text), ep.exampleWord.text);
  ep.transferActivity.channels.forEach((c) => add(K.AudioLib.wordCue(c.word), c.word));
  LINE_KEYS.forEach((key) => add(K.AudioLib.lineCue(ep, key), K.AudioLib.lineText(ep, key)));
}
add('common/script.welcome', eps[0].script.welcome);

const groups = { 'أصوات الحروف (phonemes/)': 'phonemes/', 'نماذج الاستماع (listen/)': 'listen/', 'الكلمات (words/)': 'words/', 'جمل كنعان المشتركة (common/)': 'common/', 'جمل خاصة بكل حرف (letters/)': 'letters/' };
let md = '# قائمة التسجيلات — محطة كنعان للحروف\n\n';
md += `يُولَّد تلقائيًا: \`node tools/recording_list.js\` — ${rows.size} تسجيلًا.\n\n`;
md += 'ضع كل ملف في `assets/audio/` بالمسار المكتوب هنا مع الامتداد (`.mp3` مثلًا)، ثم شغّل `python3 tools/build_audio_manifest.py`.\n';
md += 'أي ملف غير موجود يُنطق بالصوت الآلي — يمكن التسجيل تدريجيًا.\n\n';
for (const [title, pre] of Object.entries(groups)) {
  const list = [...rows].filter(([c]) => c.startsWith(pre)).sort((a, b) => a[0].localeCompare(b[0]));
  md += `## ${title} — ${list.length}\n\n| اسم الملف | النص |\n|---|---|\n`;
  list.forEach(([c, t]) => { md += `| \`${c}\` | ${t.replace(/\|/g, '\\|')} |\n`; });
  md += '\n';
}
fs.writeFileSync(path.join(root, 'assets/audio/RECORDING_LIST.md'), md);
console.log(`${rows.size} تسجيلًا → assets/audio/RECORDING_LIST.md`);
