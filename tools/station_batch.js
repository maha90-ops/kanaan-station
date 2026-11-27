/**
 * قائمة تسجيل «محطة واحدة» بالترتيب الذي يسمعه الطفل، دون ما سُجّل من قبل.
 * الاستخدام: node tools/station_batch.js baa 9
 *   (الحرف، ورقم البداية) → يطبع القائمة، ويحفظ ترقيمها في tools/batches/<id>.json
 * ثم: node tools/import_batch.js baa <مجلد الملفات>  — يضع كل ملف رقمه N في مكانه.
 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(__dirname, '..');
const [id = 'baa', startArg = '1'] = process.argv.slice(2);
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sb = { window: {}, console }; sb.window.Kanaan = sb.Kanaan = {}; vm.createContext(sb);
for (const f of [...html.matchAll(/<script src="(js\/data\/[^"]+)"/g)].map((m) => m[1])) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sb);
vm.runInContext(fs.readFileSync(path.join(root, 'js/core/audio-lib.js'), 'utf8'), sb);
const K = sb.Kanaan, A = K.AudioLib, ep = K.Episodes.get(id);
const line = (key, note) => ({ cue: A.lineCue(ep, key), text: A.lineText(ep, key), note });
const word = (w, note) => ({ cue: A.wordCue(w), text: w, note: note || 'كلمة وحدها، واضحة وبطيئة قليلًا' });
const human = 'يُفضَّل تسجيلها بصوت بشري (معلّمة)';
const L = ep.wordLetter;
const seq = [
  ['الاستوديو', [line('script.welcome'), line('script.go')]],
  ['١ أستمع', [line('script.listenIntro'), { cue: `listen/${L}`, text: `${ep.sound.label} ${ep.sound.label} ${ep.sound.label}`, note: `صوت الحرف ثلاث مرات — ${human}` }, line('script.listenAfter')]],
  ['٢ أميّز', [line('phonemeActivity.prompt'), line('script.signal'),
    // أصوات يولّدها الموقع بنفسه (ش، س، ز، ف، م) لا تحتاج تسجيلًا
    ...ep.phonemeActivity.options.filter((l) => !ep.phonemeActivity.sounds[l].synth).map((l) => ({ cue: `phonemes/${l}`, text: ep.phonemeActivity.sounds[l].label, note: `صوت الحرف ${l} مرة واحدة قصيرة — ${human}` })),
    line('feedback.discrimination.retry'), line('feedback.discrimination.correct'), line('feedback.discriminationScaffold', 'تظهر بعد محاولتين خاطئتين')]],
  ['٣ أكتشف', [line('script.reveal'), line('script.revealHint')]],
  ['٤ أنطق', [line('script.speak'), ...['clear', 'excellent', 'close', 'retry'].map((k) => line(`feedback.pronunciation.${k}`))]],
  ['٥ أبني', [line('script.build'), word(ep.exampleWord.text), line('feedback.build.correct'), line('feedback.build.retry')]],
  ['٦ أكتب', [line('script.write'), line('script.write2'), line('script.write3'), line('feedback.writing.traced'), line('feedback.writing.excellent'), line('feedback.writing.retry')]],
  ['٧ أوظّف', [line('meaningActivity.prompt'), line('feedback.meaning.correct'), line('feedback.meaning.retry'), line('script.transfer'),
    ...ep.transferActivity.channels.map((c) => word(c.word, 'كلمة قناة — وحدها')), line('feedback.transfer.correct'), line('feedback.transfer.retry')]],
  ['النهاية', [line('script.success'), line('script.onairStart'), line('script.onairIntro'), line('script.onairNoVoice', 'تُسمع إن لم يسجّل الطفل صوته'), line('script.onairWord'), line('script.messageBack'), line('script.mission')]]
];
let n = +startArg; const map = {}; const seen = new Set();
let out = `محطة حرف ${ep.letter} (${ep.exampleWord.text})\n`;
for (const [stage, items] of seq) {
  const todo = items.filter((it) => it.text && !A.has(it.cue) && !seen.has(it.cue));
  if (!todo.length) continue;
  out += `\n## ${stage}\n`;
  for (const it of todo) { seen.add(it.cue); map[n] = it.cue; out += `${n}. ${it.text}${it.note ? `   ← ${it.note}` : ''}\n`; n++; }
}
fs.mkdirSync(path.join(root, 'tools/batches'), { recursive: true });
fs.writeFileSync(path.join(root, `tools/batches/${id}.json`), JSON.stringify(map, null, 1));
console.log(out);
