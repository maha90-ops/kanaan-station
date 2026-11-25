"""تقسيم الرسم المرجعي للاستوديو إلى طبقات متحركة.

الاستخدام:
    pip install opencv-python-headless pillow numpy
    python3 tools/split_scene.py <reference.png> assets/scene

المخرجات (في assets/scene):
    plate.webp/jpg  الخلفية بعد حذف: نص الفقاعة، نص اللافتة، أشعة الزينة، موجات الهوائي، الزر المرسوم
                    (الرأس واليد مُعاد ملؤهما لأنهما طبقتان متحركتان فوقها)
    head.webp       رأس كنعان، والفم مستبدل ببشرة (الفم طبقة مستقلة)
    mouth.webp      الفم المبتسم الأصلي (يُضغط عموديًا أثناء الكلام)
    hand.webp       اليد المرفوعة (إيماءة أثناء الكلام)
    clock.webp      الساعة المطرّزة دون عقاربها (العقارب الحقيقية SVG)

إذا تغيّر الرسم المرجعي: عدّل المضلعات والإحداثيات أدناه، ثم الثوابت المقابلة في
js/core/puppet.js و js/core/studio.js.
"""
import json, sys
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter

SRC, OUT = sys.argv[1], sys.argv[2]
img = cv2.imread(SRC)
H, W = img.shape[:2]
rng = np.random.default_rng(7)

def poly_mask(points, dilate=0):
    m = Image.new('L', (W, H), 0)
    ImageDraw.Draw(m).polygon(points, fill=255)
    a = np.array(m)
    if dilate:
        a = cv2.dilate(a, np.ones((dilate * 2 + 1, dilate * 2 + 1), np.uint8))
    return a

def region_mask(box, cond, dilate):
    x0, y0, x1, y1 = box
    m = np.zeros((H, W), np.uint8)
    sub = img[y0:y1, x0:x1].astype(int)
    b, g, r = sub[..., 0], sub[..., 1], sub[..., 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    m[y0:y1, x0:x1] = np.where(cond(r, g, b, lum), 255, 0).astype(np.uint8)
    if dilate:
        m = cv2.dilate(m, np.ones((dilate * 2 + 1, dilate * 2 + 1), np.uint8))
    return m

yellow = lambda r, g, b, l: (r > 170) & (g > 120) & (r - b > 70)

HEAD = [(250, 250), (300, 230), (345, 230), (390, 243), (425, 260), (450, 283), (463, 308), (471, 343),
        (483, 378), (488, 420), (486, 456), (474, 482), (452, 494), (420, 507), (380, 517), (345, 520),
        (310, 516), (280, 512), (255, 522), (225, 529), (188, 522), (168, 502), (158, 470), (154, 430),
        (156, 390), (163, 350), (178, 313), (203, 278), (224, 260)]
MOUTH = [(333, 467), (344, 458), (364, 454), (385, 450), (400, 444), (409, 445), (407, 459), (399, 473),
         (386, 485), (370, 491), (354, 488), (341, 479)]
HAND = [(590, 499), (601, 502), (603, 519), (613, 522), (640, 519), (656, 526), (658, 537), (646, 546),
        (631, 553), (616, 561), (601, 573), (586, 589), (567, 599), (562, 576), (568, 556), (576, 538), (582, 520)]
CLOCK = (1422, 290, 193)  # center x, y, radius

# ---------- head (mouth -> skin) ----------
head_src = cv2.inpaint(img, poly_mask(MOUTH, dilate=3), 9, cv2.INPAINT_TELEA)

def cutout(source_bgr, alpha_arr, box, name, feather=1.6):
    im = Image.fromarray(cv2.cvtColor(source_bgr, cv2.COLOR_BGR2RGB))
    im.putalpha(Image.fromarray(alpha_arr).filter(ImageFilter.GaussianBlur(feather)))
    im.crop(box).save(f'{OUT}/{name}.webp', quality=90, method=6)

cutout(head_src, poly_mask(HEAD), (152, 226, 492, 532), 'head')
cutout(img, poly_mask(MOUTH), (328, 438, 414, 496), 'mouth', 1.2)
cutout(img, poly_mask(HAND), (558, 494, 662, 604), 'hand')

# ---------- clock face without its hands (real hands are drawn on top) ----------
cx, cy, cr = CLOCK
hands = np.zeros((H, W), np.uint8)
for tip in [(1326, 220), (1526, 212)]:
    mid = (int(cx + (tip[0] - cx) * .72), int(cy + (tip[1] - cy) * .72))
    end = (int(cx + (tip[0] - cx) * .9), int(cy + (tip[1] - cy) * .9))
    cv2.line(hands, (cx, cy), mid, 255, 34)   # hand body + its olive leaves
    cv2.line(hands, mid, end, 255, 16)        # thin tip, stops short of the numerals
cv2.circle(hands, (cx, cy), 22, 255, -1)
# local inpaint (colours come from the face right next to each hand) + embroidery-like grain
clock_src = cv2.inpaint(img, hands, 4, cv2.INPAINT_NS)
grain = cv2.GaussianBlur(rng.normal(0, 5.0, (H, W, 3)).astype(np.float32), (3, 3), 0)
sel = hands > 0
clock_src[sel] = np.clip(clock_src[sel].astype(np.float32) + grain[sel], 0, 255).astype(np.uint8)
# the centre (r<=30) is hidden by an embroidered medallion drawn in SVG
cm = np.zeros((H, W), np.uint8); cv2.circle(cm, (cx, cy), cr, 255, -1)
cutout(clock_src, cm, (cx - cr - 2, cy - cr - 2, cx + cr + 2, cy + cr + 2), 'clock', 1.4)

# ---------- plate ----------
plate = clock_src.copy()
masks = [
    region_mask((478, 278, 792, 478), lambda r, g, b, l: l < 150, 3),     # bubble text
    region_mask((655, 205, 752, 278), yellow, 4),                          # bubble sparkles
    region_mask((745, 100, 1158, 264), lambda r, g, b, l: l > 185, 5),     # sign title
    region_mask((775, 290, 1176, 334), lambda r, g, b, l: l < 115, 3),     # ribbon text
    region_mask((798, 410, 906, 488), yellow, 5),                          # antenna waves
    region_mask((1082, 426, 1250, 498), yellow, 5),                        # button rays
    poly_mask(HEAD, dilate=7), poly_mask(HAND, dilate=6),
]
m = np.zeros((H, W), np.uint8)
for x in masks:
    m = np.maximum(m, x)
plate = cv2.inpaint(plate, m, 12, cv2.INPAINT_TELEA)

def wall_fill(x0, y0, x1, y1, xl=None, xr=None):
    xl = x0 - 2 if xl is None else xl
    xr = min(x1 + 1, W - 1) if xr is None else xr
    left = cv2.GaussianBlur(plate[y0:y1, xl:xl + 1].astype(np.float32), (1, 41), 0)
    right = cv2.GaussianBlur(plate[y0:y1, xr:xr + 1].astype(np.float32), (1, 41), 0)
    t = np.linspace(0, 1, x1 - x0)[None, :, None]
    fill = left * (1 - t) + right * t
    grain = cv2.GaussianBlur(rng.normal(0, 3.0, fill.shape).astype(np.float32), (3, 3), 0)
    plate[y0:y1, x0:x1] = np.clip(fill + grain, 0, 255).astype(np.uint8)
    sl = (slice(max(0, y0 - 4), y1 + 4), slice(max(0, x0 - 4), min(W, x1 + 4)))
    plate[sl] = cv2.GaussianBlur(plate[sl], (7, 7), 0)

wall_fill(992, 498, 1452, 672)   # baked start button (a real button sits here)

rgb = Image.fromarray(cv2.cvtColor(plate, cv2.COLOR_BGR2RGB))
rgb.save(f'{OUT}/plate.webp', quality=84, method=6)
rgb.save(f'{OUT}/plate.jpg', quality=82, optimize=True, progressive=True)

def px(x, y):
    b, g, r = img[y, x]
    return '#%02X%02X%02X' % (r, g, b)
print(json.dumps({'skin': [px(318, 398), px(300, 455), px(404, 366), px(414, 428)]}))
