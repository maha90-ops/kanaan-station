/**
 * يضع ملفات دفعة تسجيل في أماكنها حسب أرقامها.
 * الاستخدام: node tools/import_batch.js baa <ملف أو مجلد>...
 * اسم كل ملف يبدأ برقمه في القائمة (مثل "14.mp3" أو "14 انظر.mp3").
 * بعده: python3 tools/build_audio_manifest.py
 */
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const [id, ...inputs] = process.argv.slice(2);
const vm = require('vm');
const sb = { window: { Kanaan: {} }, console }; sb.Kanaan = sb.window.Kanaan; vm.createContext(sb);
vm.runInContext(fs.readFileSync(path.join(root, 'js/core/audio-lib.js'), 'utf8'), sb);
const fileKey = sb.Kanaan.AudioLib.fileKey;
const map = JSON.parse(fs.readFileSync(path.join(root, `tools/batches/${id}.json`), 'utf8'));
const files = inputs.flatMap((p) => (fs.statSync(p).isDirectory() ? fs.readdirSync(p).map((f) => path.join(p, f)) : [p]));
for (const f of files) {
  const m = path.basename(f).match(/(\d+)/);
  const cue = m && map[+m[1]];
  if (!cue) { console.log(`؟ لم أجد رقمًا معروفًا في: ${path.basename(f)}`); continue; }
  const dest = path.join(root, 'assets/audio', fileKey(cue) + path.extname(f).toLowerCase());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(f, dest);
  console.log(`${m[1]} → ${cue}  (${fileKey(cue)})`);
}
