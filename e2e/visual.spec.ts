import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

test.describe('Visual: hover and focus states', () => {
  const outDir = path.join('docs', 'screenshots', 'playwright');
  test.beforeAll(() => ensureDir(outDir));

  test('card default / hover / focus', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForSelector('.card');

    const card = page.locator('.card').first();
    await card.waitFor();

    await card.screenshot({ path: `${outDir}/card-default.png` });

    await card.hover();
    await page.waitForTimeout(120);
    await card.screenshot({ path: `${outDir}/card-hover.png` });

    // Make card focusable for snapshotting focus styles
    await page.evaluate((el) => el.setAttribute('tabindex', '0'), await card.elementHandle());
    await card.focus();
    await page.waitForTimeout(80);
    await card.screenshot({ path: `${outDir}/card-focus.png` });
  });

  test('ndvi panel default / hover / focus', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForSelector('.ndvi-panel');
    const panel = page.locator('.ndvi-panel').first();
    await panel.screenshot({ path: `${outDir}/ndvi-default.png` });

    await panel.hover();
    await page.waitForTimeout(120);
    await panel.screenshot({ path: `${outDir}/ndvi-hover.png` });

    await page.evaluate((el) => el.setAttribute('tabindex', '0'), await panel.elementHandle());
    await panel.focus();
    await page.waitForTimeout(80);
    await panel.screenshot({ path: `${outDir}/ndvi-focus.png` });
  });

  test('stat card hover', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForSelector('.stat-card');
    const stat = page.locator('.stat-card').first();
    await stat.screenshot({ path: `${outDir}/stat-default.png` });
    await stat.hover();
    await page.waitForTimeout(100);
    await stat.screenshot({ path: `${outDir}/stat-hover.png` });
  });
});
