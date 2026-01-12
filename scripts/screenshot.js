const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const urls = ['https://kurimasense.vercel.app/', 'https://kurimasense.vercel.app/dashboard'];
  for (const url of urls) {
    console.log('Visiting', url);
    await page.goto(url, { waitUntil: 'networkidle' });
    // Wait for main content
    await page.waitForTimeout(500);
    const title = await page.title();
    const html = await page.content();
    const filename = url.endsWith('/') ? 'root' : url.split('/').pop();
    fs.writeFileSync(`./screenshots/${filename}.html`, html);
    await page.screenshot({ path: `./screenshots/${filename}.png`, fullPage: true });
    console.log('Saved', filename);
  }

  await browser.close();
})();