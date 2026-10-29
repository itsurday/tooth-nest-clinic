// Regenerates the raster brand files in assets/brand/ from the SVG logos.
// Run from the repo root: node tools/render-brand.cjs
// Needs Playwright (pre-installed in cloud sessions; NODE_PATH=$(npm root -g) if not found).
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const brand = path.join(root, 'assets/brand');
const svg = name => fs.readFileSync(path.join(brand, name), 'utf8');
const font = name => `url(data:font/woff2;base64,${fs.readFileSync(path.join(root, 'assets/fonts', name)).toString('base64')})`;
const css = `
  @font-face { font-family: Figtree; src: ${font('figtree-latin.woff2')}; font-weight: 300 900; }
  @font-face { font-family: "Noto Sans"; src: ${font('noto-sans-latin.woff2')}; font-weight: 100 900; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 100vw; height: 100vh; display: grid; place-items: center; overflow: hidden; }
  svg { display: block; width: 100%; height: 100%; }`;

// Social card: logo + name + promise + locality.
const card = (w, h) => `
  <body style="background:#F3FAF6;font-family:'Noto Sans';color:#2E3338">
    <div style="display:flex;align-items:center;gap:${w * 0.04}px;padding:0 ${w * 0.07}px;width:100%">
      <div style="width:${h * 0.62}px;height:${h * 0.48}px;flex:none">${svg('logo.svg')}</div>
      <div>
        <div style="font:700 ${h * 0.11}px/1.05 Figtree;color:#176B4C">Tooth Nest<br>Dental Clinic</div>
        <div style="font-size:${h * 0.05}px;margin-top:${h * 0.04}px">Gentle dental care for the whole family</div>
        <div style="font-size:${h * 0.04}px;margin-top:${h * 0.02}px;color:#4A4F54">Alwal, Secunderabad</div>
      </div>
    </div>
    <div style="position:fixed;left:0;right:0;bottom:0;height:${h * 0.03}px;background:#2CB27F"></div>
  </body>`;

const jobs = [
  // [file, width, height, html, transparent]
  ['logo.png', 1200, 918, `<body>${svg('logo.svg')}</body>`, true],
  ['logo-white.png', 1200, 918, `<body>${svg('logo-white.svg')}</body>`, true],
  ['icon-mark-512.png', 512, 512, `<body>${svg('logo-mark.svg')}</body>`, true],
  ['apple-touch-icon.png', 180, 180, `<body style="background:#fff;padding:14px">${svg('logo-mark.svg')}</body>`],
  ['icon-192.png', 192, 192, `<body style="background:#F3FAF6;padding:38px">${svg('logo-mark.svg')}</body>`],
  ['icon-512.png', 512, 512, `<body style="background:#F3FAF6;padding:100px">${svg('logo-mark.svg')}</body>`],
  ['profile-square.png', 800, 800, `<body style="background:#fff;padding:90px">${svg('logo.svg')}</body>`],
  ['og-image.jpg', 1200, 630, card(1200, 630)],
  ['gbp-cover.jpg', 1024, 576, card(1024, 576)],
];

(async () => {
  const browser = await chromium.launch();
  for (const [file, width, height, body, transparent] of jobs) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.setContent(`<!doctype html><style>${css}</style>${body}`);
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(brand, file);
    await page.screenshot(file.endsWith('.jpg') ? { path: out, type: 'jpeg', quality: 88 } : { path: out, omitBackground: !!transparent });
    await page.close();
    console.log(file);
  }
  await browser.close();
})();
