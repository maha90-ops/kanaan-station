"""يمسح assets/audio/ ويكتب js/data/audio-manifest.js بقائمة الملفات الموجودة.

الاستخدام (من جذر المشروع):  python3 tools/build_audio_manifest.py
"""
import hashlib, json, os, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
audio = root / 'assets' / 'audio'
files = sorted(str(p.relative_to(audio)).replace(os.sep, '/')
               for p in audio.rglob('*') if p.suffix.lower() in {'.mp3', '.m4a', '.ogg', '.wav'})
# بصمة لكل ملف: إذا استُبدل التسجيل يتغيّر رابطه، فلا يبقى القديم في ذاكرة الجهاز
ver = {f: hashlib.md5((audio / f).read_bytes()).hexdigest()[:8] for f in files}
out = root / 'js' / 'data' / 'audio-manifest.js'
out.write_text('/* يُولَّد تلقائيًا: python3 tools/build_audio_manifest.py — لا تعدّله يدويًا */\n'
               'window.Kanaan = window.Kanaan || {};\n'
               f'Kanaan.AudioManifest = {{ base: \'assets/audio/\', files: {json.dumps(files, ensure_ascii=False)}, ver: {json.dumps(ver)} }};\n',
               encoding='utf-8')
print(f'{len(files)} ملف صوتي في القائمة')
