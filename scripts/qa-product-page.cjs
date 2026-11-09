const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const { createServer } = await import('vite');
  const server = await createServer({ server: { host: '127.0.0.1', port: 8181, strictPort: true } });
  await server.listen();
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const results = [];
  const base = process.env.PRODUCT_QA_URL || 'http://127.0.0.1:8181';
  try {
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['tablet', 820, 1180], ['small-mobile', 320, 740]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${base}/produto`, { waitUntil: 'networkidle' });
    await page.locator('img').evaluateAll(async images => { await Promise.all(images.map(img => { img.loading = 'eager'; return img.decode().catch(() => {}); })); });
    await page.screenshot({ path: path.join('qa/produto', `${name}.png`), fullPage: true });
    const layout = await page.evaluate(() => {
      const rect = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) }; };
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        brokenImages: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src),
        title: rect('.pp-title-row'), gallery: rect('.pp-gallery'), purchase: rect('.pp-purchase'),
        actionsVisible: getComputedStyle(document.querySelector('.pp-actions')).display !== 'none',
        sections: [...document.querySelectorAll('main > section')].map(s => s.className),
      };
    });
    await page.getByRole('button', { name: 'Ver foto 2', exact: true }).click();
    await page.getByRole('button', { name: 'Ampliar imagem', exact: true }).click();
    await page.getByRole('dialog').waitFor();
    await page.getByRole('dialog').getByRole('button', { name: 'Close', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    await page.getByRole('button', { name: 'Comprar agora', exact: true }).click();
    await page.getByText('Demonstração do layout. Nenhum pedido ou pagamento será realizado.').waitFor();
    await page.getByRole('button', { name: 'Continuar explorando', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    const tab = page.getByRole('tab', { name: 'Ficha Técnica', exact: true });
    await tab.focus(); await page.keyboard.press('ArrowRight');
    if (await page.getByRole('tab', { name: 'Qualidade do Produto', exact: true }).getAttribute('aria-selected') !== 'true') throw new Error('Keyboard tab failure');
    results.push({ name, width, height, ...layout, errors, interactions: 'passed' });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync('qa/produto/browser-checks.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  if (results.some(r => r.overflow || r.brokenImages.length || r.errors.length)) process.exitCode = 1;
  } finally { await browser.close(); await server.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
