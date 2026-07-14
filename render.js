// Server-compatible Playwright PDF renderer
// Uses CHROMIUM_PATH env var or falls back to 'chromium'
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const out = process.argv[2];
  if (!out) { console.error('usage: node render.js <out.pdf>'); process.exit(1); }

  const BASE = __dirname;
  const htmlPath = path.join(BASE, 'interior.html');
  const chromiumPath = process.env.CHROMIUM_PATH || null;

  const launchOpts = {
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb']
  };
  if (chromiumPath) launchOpts.executablePath = chromiumPath;

  const browser = await chromium.launch(launchOpts);
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.pdf({
    path: path.join(BASE, out),
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: false
  });
  await browser.close();
  console.log('rendered', out);
})().catch(e => { console.error(e); process.exit(1); });
