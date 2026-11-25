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
