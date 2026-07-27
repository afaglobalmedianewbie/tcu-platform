const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://topclassuniversal.co.id', { waitUntil: 'networkidle' });
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text);
  await browser.close();
})();
