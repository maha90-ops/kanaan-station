"""يضع رقم إصدار جديدًا على ملفات الموقع في index.html (?v=...) قبل كل نشر،
حتى لا يستخدم المتصفح نسخة قديمة محفوظة من ملفات JS/CSS بعد التحديث.

الاستخدام (من جذر المشروع، قبل كل commit):  python3 tools/stamp_version.py
"""
import pathlib, re, time
root = pathlib.Path(__file__).resolve().parent.parent
p = root / 'index.html'
v = time.strftime('%Y%m%d%H%M%S')
s = p.read_text(encoding='utf-8')
s, n = re.subn(r'((?:src|href)="(?:js|css)/[^"?]+\.(?:js|css))(?:\?v=\d+)?"', rf'\1?v={v}"', s)
p.write_text(s, encoding='utf-8')
print(f'إصدار {v} على {n} ملفًا')
