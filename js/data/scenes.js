/**
 * مشاهد المعنى (شاشة ٦) — رسوم SVG بسيطة بالأسلوب نفسه:
 * عنصر هدف واحد واضح في المركز، خلفية هادئة، دون عناصر تنافسه.
 * (مثال: مشهد «بيت» بلا شمس، حتى لا يختلط بمشهد «شمس».)
 * لاستبدال رسمة بصورة: ضع exampleWord.image.src بدل scene.
 */
Kanaan.Scenes = Kanaan.Scenes || {};
Kanaan.Scenes['sun-hills'] = `
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE7B8"/><stop offset="1" stop-color="#FFF6E4"/></linearGradient>
    <radialGradient id="sunG"><stop offset="0" stop-color="#FFD25A"/><stop offset="1" stop-color="#F6A623"/></radialGradient>
  </defs>
  <rect width="480" height="300" fill="url(#sky)"/>
  <g class="sun-rays" stroke="#F6A623" stroke-width="7" stroke-linecap="round" opacity=".75">
    <line x1="240" y1="30" x2="240" y2="10"/><line x1="296" y1="54" x2="310" y2="40"/><line x1="320" y1="110" x2="340" y2="110"/>
    <line x1="184" y1="54" x2="170" y2="40"/><line x1="160" y1="110" x2="140" y2="110"/>
  </g>
  <circle class="sun-disc" cx="240" cy="112" r="62" fill="url(#sunG)"/>
  <path d="M0 220 Q120 160 240 205 T480 190 V300 H0Z" fill="#C9B27C"/>
  <path d="M0 250 Q140 205 290 240 T480 235 V300 H0Z" fill="#8FA35B"/>
  <!-- بيت حجري صغير -->
  <g transform="translate(330 186)">
    <rect width="78" height="56" rx="3" fill="#E8D6B0" stroke="#A88C5C" stroke-width="2"/>
    <path d="M8 56 V32 a12 12 0 0 1 24 0 V56" fill="#7A5A3A"/>
    <path d="M46 22 h20 v16 h-20z" fill="#7FA7C9" stroke="#A88C5C" stroke-width="2"/>
    <path d="M30 0 h18 v-10 h-18z" fill="#E8D6B0" stroke="#A88C5C" stroke-width="2"/>
  </g>
  <!-- شجرة زيتون -->
  <g transform="translate(90 168)">
    <path d="M30 80 C26 60 34 46 28 30" stroke="#6B4F33" stroke-width="9" fill="none" stroke-linecap="round"/>
    <ellipse cx="22" cy="22" rx="34" ry="20" fill="#6F8A44"/>
    <ellipse cx="48" cy="12" rx="26" ry="16" fill="#7E9A4F"/>
    <ellipse cx="10" cy="4" rx="20" ry="13" fill="#7E9A4F"/>
  </g>
</svg>`;

const SKY = (id) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FDF1DA"/><stop offset="1" stop-color="#FFF8EC"/></linearGradient></defs><rect width="480" height="300" fill="url(#${id})"/>`;

// بَيْت — بيت حجري فلسطيني بباب مقوّس
Kanaan.Scenes['stone-house'] = `
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${SKY('skyH')}
  <path d="M0 250 Q160 225 300 245 T480 240 V300 H0Z" fill="#9FB06A"/>
  <g transform="translate(150 92)">
    <rect width="180" height="160" rx="4" fill="#EAD9B4" stroke="#A88C5C" stroke-width="3"/>
    <g stroke="#CDB68A" stroke-width="2" fill="none">
      <path d="M0 40 H180 M0 80 H180 M0 120 H180"/>
      <path d="M45 0 V40 M120 0 V40 M80 40 V80 M150 40 V80 M30 80 V120 M140 120 V160"/>
    </g>
    <rect x="-8" y="-12" width="196" height="16" rx="3" fill="#C9AE7C"/>
    <path d="M68 160 V110 a22 22 0 0 1 44 0 V160Z" fill="#7A5A3A" stroke="#5B4029" stroke-width="3"/>
    <circle cx="102" cy="138" r="3" fill="#E9C46A"/>
    <path d="M18 92 V66 a14 14 0 0 1 28 0 V92Z" fill="#8DB3D3" stroke="#A88C5C" stroke-width="3"/>
    <path d="M134 92 V66 a14 14 0 0 1 28 0 V92Z" fill="#8DB3D3" stroke="#A88C5C" stroke-width="3"/>
  </g>
  <g transform="translate(372 176)">
    <path d="M24 74 C20 56 28 42 22 26" stroke="#6B4F33" stroke-width="8" fill="none" stroke-linecap="round"/>
    <ellipse cx="18" cy="20" rx="30" ry="18" fill="#6F8A44"/><ellipse cx="40" cy="10" rx="22" ry="14" fill="#7E9A4F"/>
  </g>
</svg>`;

// تِين — طبق ثمار تين مع ورقة
const FIG = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})">
  <path d="M0 -46 C22 -34 34 0 28 22 C22 42 -22 42 -28 22 C-34 0 -22 -34 0 -46Z" fill="#7B3F61" stroke="#5A2B46" stroke-width="3"/>
  <path d="M-12 -10 C-16 4 -14 18 -8 26" stroke="#A8678C" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M0 -46 V-58" stroke="#6B8E3A" stroke-width="6" stroke-linecap="round"/></g>`;
Kanaan.Scenes['figs'] = `
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${SKY('skyF')}
  <path d="M300 70 C350 40 420 60 430 110 C400 100 380 120 390 150 C350 140 330 160 320 190 C300 150 260 130 300 70Z" fill="#7E9A4F" stroke="#5E7A35" stroke-width="3"/>
  <path d="M320 180 C340 140 370 110 420 100" stroke="#5E7A35" stroke-width="3" fill="none"/>
  <ellipse cx="230" cy="236" rx="170" ry="30" fill="#E7D3AE" stroke="#B89766" stroke-width="3"/>
  ${FIG(165, 196, -12)}${FIG(240, 186, 4)}${FIG(312, 198, 16)}
</svg>`;

// مَوْز — عنقود موز
const BANANA = (r) => `<g transform="rotate(${r} 240 120)">
  <path d="M240 118 C250 190 320 230 392 214 C398 206 396 200 388 200 C330 206 280 176 262 112Z" fill="#F7D046" stroke="#C9A227" stroke-width="3"/>
  <path d="M388 200 L400 212" stroke="#5B4029" stroke-width="6" stroke-linecap="round"/></g>`;
Kanaan.Scenes['bananas'] = `
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${SKY('skyB')}
  <ellipse cx="250" cy="262" rx="150" ry="16" fill="#EADBC0"/>
  ${BANANA(28)}${BANANA(8)}${BANANA(-12)}
  <rect x="226" y="88" width="30" height="40" rx="8" fill="#8A6A3A" stroke="#5B4029" stroke-width="3"/>
</svg>`;

// زَيْت — جرّة زيت زيتون وغصن زيتون
Kanaan.Scenes['olive-oil'] = `
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${SKY('skyO')}
  <defs><linearGradient id="oil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9C64A"/><stop offset="1" stop-color="#B8921E"/></linearGradient></defs>
  <ellipse cx="240" cy="266" rx="150" ry="14" fill="#EADBC0"/>
  <g transform="translate(180 60)">
    <rect x="42" y="0" width="36" height="22" rx="5" fill="#9C7A4E"/>
    <path d="M38 22 H82 V52 C112 62 122 90 122 120 V190 C122 202 112 206 100 206 H20 C8 206 -2 202 -2 190 V120 C-2 90 8 62 38 52Z" fill="#F3EEDF" stroke="#A8957A" stroke-width="3" opacity=".95"/>
    <path d="M2 110 C40 100 80 120 118 108 V188 C118 198 110 202 100 202 H20 C10 202 2 198 2 188Z" fill="url(#oil)"/>
    <path d="M16 92 C14 120 14 160 18 186" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".6" fill="none"/>
  </g>
  <g transform="translate(330 210) rotate(-25)">
    <path d="M0 0 C40 -10 80 -14 120 -6" stroke="#6B4F33" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="30" cy="-18" rx="18" ry="6" fill="#7E9A4F" transform="rotate(-20 30 -18)"/>
    <ellipse cx="70" cy="-24" rx="18" ry="6" fill="#6F8A44" transform="rotate(-10 70 -24)"/>
    <ellipse cx="100" cy="4" rx="18" ry="6" fill="#7E9A4F" transform="rotate(15 100 4)"/>
    <ellipse cx="54" cy="2" rx="9" ry="12" fill="#3F5A26"/><ellipse cx="86" cy="-6" rx="9" ry="12" fill="#4F6B2C"/>
  </g>
</svg>`;

// عِنَب — عنقود عنب
Kanaan.Scenes['grapes'] = (() => {
  const rows = [[5, 0], [4, 1], [3, 2], [2, 3], [1, 4]];
  let g = '';
  rows.forEach(([n, i]) => {
    for (let k = 0; k < n; k++) {
      const x = 240 + (k - (n - 1) / 2) * 38, y = 110 + i * 32;
      g += `<circle cx="${x}" cy="${y}" r="19" fill="#6D3B7A" stroke="#4E2758" stroke-width="2.5"/><circle cx="${x - 6}" cy="${y - 6}" r="5" fill="#A57AB3"/>`;
    }
  });
  return `
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${SKY('skyG')}
  <ellipse cx="240" cy="270" rx="120" ry="12" fill="#EADBC0"/>
  <path d="M240 92 C238 70 246 52 262 40" stroke="#6B4F33" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M262 46 C290 20 340 26 350 60 C330 56 318 70 322 88 C296 82 280 92 272 108 C262 86 250 66 262 46Z" fill="#7E9A4F" stroke="#5E7A35" stroke-width="3"/>
  ${g}
</svg>`;
})();

/* ---------- المجموعة الأولى: ا ب ت ث ج ح خ د ذ ---------- */
const GROUND = (id) => `${SKY(id)}<path d="M0 238 Q160 214 300 232 T480 228 V300 H0Z" fill="#A9B86F"/>`;

// أَرْنَب
Kanaan.Scenes['rabbit'] = `
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${GROUND('skyR')}
  <g transform="translate(240 170)">
    <ellipse cx="-20" cy="-118" rx="16" ry="52" fill="#F4EEE6" stroke="#B9AFA2" stroke-width="3" transform="rotate(-12 -20 -118)"/>
    <ellipse cx="-20" cy="-116" rx="7" ry="38" fill="#F2B8C0" transform="rotate(-12 -20 -116)"/>
    <ellipse cx="24" cy="-114" rx="16" ry="50" fill="#F4EEE6" stroke="#B9AFA2" stroke-width="3" transform="rotate(14 24 -114)"/>
    <ellipse cx="24" cy="-112" rx="7" ry="36" fill="#F2B8C0" transform="rotate(14 24 -112)"/>
    <ellipse cx="10" cy="26" rx="78" ry="56" fill="#F4EEE6" stroke="#B9AFA2" stroke-width="3"/>
    <circle cx="-62" cy="30" r="16" fill="#FFFFFF" stroke="#B9AFA2" stroke-width="3"/>
    <circle cx="2" cy="-50" r="44" fill="#F4EEE6" stroke="#B9AFA2" stroke-width="3"/>
    <circle cx="-14" cy="-56" r="5.5" fill="#2B2118"/><circle cx="20" cy="-56" r="5.5" fill="#2B2118"/>
    <path d="M-2 -40 l6 6 l6 -6 z" fill="#E58A9A"/>
    <path d="M4 -34 q-8 10 -16 4 M4 -34 q8 10 16 4" stroke="#8A7B6A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="-30" cy="78" rx="22" ry="10" fill="#EDE5DA" stroke="#B9AFA2" stroke-width="3"/>
    <ellipse cx="44" cy="78" rx="22" ry="10" fill="#EDE5DA" stroke="#B9AFA2" stroke-width="3"/>
  </g>
</svg>`;

// ثَوْب — ثوب فلسطيني مطرّز
Kanaan.Scenes['thob'] = (() => {
  let st = '';
  for (let i = 0; i < 7; i++) st += `<rect x="${206 + i * 10}" y="${96 + (i % 2) * 6}" width="6" height="6" fill="#A3161E" transform="rotate(45 ${209 + i * 10} ${99 + (i % 2) * 6})"/>`;
  let hem = '';
  for (let i = 0; i < 14; i++) hem += `<rect x="${172 + i * 10}" y="${246 + (i % 2) * 7}" width="6" height="6" fill="${i % 3 ? '#A3161E' : '#1E6B3C'}" transform="rotate(45 ${175 + i * 10} ${249 + (i % 2) * 7})"/>`;
  return `
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${SKY('skyT')}
  <line x1="150" y1="40" x2="330" y2="40" stroke="#6B4F33" stroke-width="6" stroke-linecap="round"/>
  <path d="M216 44 h48 l58 34 -16 40 -30 -16 12 166 h-156 l12 -166 -30 16 -16 -40z" fill="#1F1A2E" stroke="#120E1C" stroke-width="3" stroke-linejoin="round"/>
  <path d="M222 50 h36 l-18 40z" fill="#A3161E"/>
  ${st}
  <rect x="216" y="120" width="48" height="90" fill="none" stroke="#A3161E" stroke-width="5" stroke-dasharray="6 6"/>
  <path d="M232 130 l8 -8 8 8 -8 8z M232 160 l8 -8 8 8 -8 8z M232 190 l8 -8 8 8 -8 8z" fill="#A3161E"/>
  ${hem}
</svg>`;
})();

// جَمَل
Kanaan.Scenes['camel'] = `
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${SKY('skyJ')}
  <path d="M0 240 Q140 222 260 236 T480 232 V300 H0Z" fill="#E1C48F"/>
  <g fill="#C08A4E" stroke="#8A5A2E" stroke-width="3" stroke-linejoin="round">
    <path d="M150 170 C150 120 190 92 230 96 C260 70 300 84 306 120 C330 128 338 150 332 176 L320 182 L170 184 Z"/>
    <path d="M318 140 C336 120 344 96 340 76 C352 66 372 66 380 78 C386 88 380 96 368 98 C362 120 352 146 330 166 Z"/>
    <rect x="176" y="178" width="14" height="66" rx="5"/><rect x="204" y="180" width="14" height="64" rx="5"/>
    <rect x="286" y="180" width="14" height="64" rx="5"/><rect x="312" y="176" width="14" height="68" rx="5"/>
  </g>
  <circle cx="366" cy="80" r="3.5" fill="#2B2118"/>
  <path d="M150 168 q-16 10 -14 30" stroke="#8A5A2E" stroke-width="5" fill="none" stroke-linecap="round"/>
</svg>`;

// حِصَان
Kanaan.Scenes['horse'] = `
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${GROUND('skyH2')}
  <g fill="#8B5A35" stroke="#5E3A1F" stroke-width="3" stroke-linejoin="round">
    <path d="M140 150 C140 118 170 104 210 106 L290 106 C310 106 320 116 322 132 L322 170 C322 182 312 190 298 190 L162 190 C148 190 140 178 140 150Z"/>
    <path d="M292 116 C300 84 316 58 336 50 C352 46 370 60 374 78 C376 92 366 98 354 96 L340 92 C332 110 326 130 318 146Z"/>
    <rect x="160" y="182" width="16" height="66" rx="5"/><rect x="190" y="184" width="16" height="64" rx="5"/>
    <rect x="270" y="184" width="16" height="64" rx="5"/><rect x="298" y="182" width="16" height="66" rx="5"/>
  </g>
  <path d="M300 92 C312 70 326 56 340 52 L326 92 C318 104 310 112 302 118Z" fill="#3B2414"/>
  <path d="M142 128 C118 138 110 166 116 196 C128 174 134 158 144 150Z" fill="#3B2414"/>
  <circle cx="352" cy="70" r="4" fill="#1C1209"/>
</svg>`;

// خُبْز — خبز طابون
Kanaan.Scenes['bread'] = `
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${SKY('skyK')}
  <ellipse cx="240" cy="230" rx="170" ry="34" fill="#C49A5A" stroke="#8C6A35" stroke-width="3"/>
  <ellipse cx="240" cy="222" rx="150" ry="24" fill="#D9B477"/>
  <g stroke="#9A6A2E" stroke-width="3">
    <ellipse cx="180" cy="190" rx="78" ry="30" fill="#E8B86A"/>
    <ellipse cx="300" cy="182" rx="80" ry="32" fill="#E2AE5E"/>
    <ellipse cx="240" cy="150" rx="84" ry="34" fill="#EDC27A"/>
  </g>
  <g fill="#9A6A2E" opacity=".55">
    <circle cx="210" cy="142" r="4"/><circle cx="236" cy="156" r="3.5"/><circle cx="262" cy="140" r="4"/><circle cx="284" cy="156" r="3"/>
    <circle cx="150" cy="186" r="3.5"/><circle cx="330" cy="176" r="3.5"/>
  </g>
</svg>`;

// دِيك
Kanaan.Scenes['rooster'] = `
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${GROUND('skyD')}
  <g transform="translate(230 150)">
    <path d="M-70 10 C-120 -30 -118 -90 -96 -110 C-86 -70 -70 -50 -50 -40Z" fill="#1E6B3C"/>
    <path d="M-64 8 C-104 -20 -100 -70 -84 -86 C-78 -56 -64 -40 -46 -34Z" fill="#2F6B8A"/>
    <ellipse cx="0" cy="20" rx="72" ry="56" fill="#C9632A" stroke="#8A3F16" stroke-width="3"/>
    <path d="M-10 6 C10 30 40 34 60 20 C40 50 0 54 -24 34Z" fill="#E8A13A"/>
    <path d="M30 -18 C30 -60 50 -82 76 -80 C96 -78 104 -60 98 -40 C92 -22 70 -12 56 -10Z" fill="#D9762E" stroke="#8A3F16" stroke-width="3"/>
    <path d="M62 -86 q6 -18 16 -6 q8 -16 16 0 q10 -10 12 8 q-20 6 -44 -2z" fill="#D92E2E"/>
    <path d="M98 -54 l20 8 -20 8z" fill="#F2B233"/>
    <path d="M92 -38 q10 12 0 22 q-10 -10 0 -22z" fill="#D92E2E"/>
    <circle cx="80" cy="-58" r="5" fill="#1C1209"/>
    <path d="M-12 74 v30 M-20 104 h16 M22 74 v30 M14 104 h16" stroke="#E8A13A" stroke-width="6" stroke-linecap="round"/>
  </g>
</svg>`;

// ذُرَة
Kanaan.Scenes['corn'] = `
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${SKY('skyZ')}
  <ellipse cx="240" cy="270" rx="120" ry="12" fill="#EADBC0"/>
  <path d="M240 262 C200 230 168 170 176 110 C200 150 222 196 240 262Z" fill="#6F8A44" stroke="#4E6A2C" stroke-width="3"/>
  <path d="M240 262 C280 230 312 170 304 110 C280 150 258 196 240 262Z" fill="#7E9A4F" stroke="#4E6A2C" stroke-width="3"/>
  <path d="M240 250 C212 226 204 150 214 90 C220 60 260 60 266 90 C276 150 268 226 240 250Z" fill="#F2C531" stroke="#B88A12" stroke-width="3"/>
  <g fill="#E0AE1C" opacity=".85">
    ${Array.from({ length: 6 }, (_, r) => Array.from({ length: 3 }, (_, c) => `<ellipse cx="${226 + c * 14}" cy="${100 + r * 24}" rx="6" ry="8"/>`).join('')).join('')}
  </g>
  <path d="M240 62 C236 44 244 30 254 22 M240 62 C246 46 260 40 270 40" stroke="#C49A5A" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;
