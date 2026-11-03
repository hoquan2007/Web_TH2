import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

// A local offline request router allows browser verification in restricted sandboxes.
const baseUrl = process.env.SMOKE_URL ?? 'https://lab2.test';
const screenshotDir = path.resolve('evidence');
const distDir = path.resolve('dist');
await mkdir(screenshotDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox'],
});
const details = [];
const failures = [];
async function enableOfflineSite(context) {
  await context.route('**/*', async (route) => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.hostname !== new URL(baseUrl).hostname) {
      await route.abort();
      return;
    }
    const extension = path.extname(requestUrl.pathname);
    const target = extension ? path.join(distDir, requestUrl.pathname.slice(1)) : path.join(distDir, 'index.html');
    try {
      const body = await readFile(target);
      const contentType = extension === '.js' ? 'text/javascript' : extension === '.css' ? 'text/css' : 'text/html';
      await route.fulfill({ status: 200, contentType, body });
    } catch { await route.fulfill({ status: 404, body: 'Not found' }); }
  });
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await enableOfflineSite(context);
  const page = await context.newPage();
  page.on('pageerror', (error) => failures.push(error.message));
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.locator('h1').first().waitFor();
  assert.match(await page.title(), /HẸN/);
  assert.equal(await page.locator('article.event-card').count(), 8);
  details.push('Trang chủ: 8 sự kiện đầu tiên hiển thị.');
  await page.screenshot({ path: path.join(screenshotDir, '01-desktop-home.png'), fullPage: false });

  await page.getByRole('button', { name: /Yêu thích/ }).first().click();
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('hen_favorites') || '[]').length), 1);
  await page.reload();
  assert.equal(await page.getByRole('button', { name: /Bỏ yêu thích/ }).count(), 1);
  await page.getByRole('link', { name: 'Yêu thích', exact: true }).click();
  assert.equal(await page.locator('article.event-card').count(), 1);
  details.push('Favorites: thêm, lưu localStorage, tải lại và hiển thị ở /favorites.');

  await page.getByRole('button', { name: 'Bật chế độ tối' }).click();
  assert.equal(await page.locator('html.dark').count(), 1);
  await page.reload();
  assert.equal(await page.locator('html.dark').count(), 1);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('hen_theme') || 'null')), 'dark');
  details.push('Dark mode: thiết lập dark và tồn tại sau khi reload.');
  await page.goto(baseUrl);
  await page.screenshot({ path: path.join(screenshotDir, '02-dark-home.png'), fullPage: false });

  await page.getByRole('button', { name: 'Bật chế độ sáng' }).click();
  const initialCount = await page.locator('article.event-card').count();
  for (let attempt = 0; attempt < 5 && await page.locator('article.event-card').count() < 24; attempt++) {
    await page.evaluate(() => {
      const button = [...document.querySelectorAll('button')].find((item) => item.textContent?.includes('Xem thêm sự kiện'));
      button?.click();
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(120);
  }
  assert.equal(initialCount, 8);
  assert.equal(await page.locator('article.event-card').count(), 24);
  details.push('Infinite Scroll: từ 8 lên đầy đủ 24 bản ghi qua tự tải/nút xem thêm.');

  await page.getByLabel('Tìm kiếm sự kiện').fill('Workshop');
  const filteredCount = await page.locator('article.event-card').count();
  assert(filteredCount > 0 && filteredCount < 24);
  await page.getByLabel('Tìm kiếm sự kiện').fill('');
  await page.locator('article.event-card').first().getByRole('link').last().click();
  assert.match(page.url(), /\/item\//);
  await page.getByRole('button', { name: /Đặt vé ngay/ }).click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  await page.getByRole('button', { name: /Đặt vé ngay/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Xác nhận đặt vé' }).click();
  assert.equal(await page.getByText('Vui lòng nhập họ tên từ 2 ký tự.').count(), 1);
  await page.getByLabel(/Họ và tên/).fill('Hồ Ngọc Quân');
  await page.getByLabel(/Email/).fill('quan@example.com');
  await page.screenshot({ path: path.join(screenshotDir, '03-booking-modal.png'), fullPage: false });
  await page.getByRole('dialog').getByRole('button', { name: 'Xác nhận đặt vé' }).click();
  await page.getByRole('dialog').getByText('Đã giữ chỗ!').waitFor();
  await page.getByRole('link', { name: /Xem vé của tôi/ }).click();
  assert.match(page.url(), /\/tickets/);
  assert.equal(await page.locator('article.ticket-receipt').count(), 1);
  details.push('Đặt vé: modal Escape, validation, xác nhận, lưu vé, xem /tickets.');

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 });
  await enableOfflineSite(mobile);
  const mobilePage = await mobile.newPage();
  mobilePage.on('pageerror', (error) => failures.push(error.message));
  await mobilePage.goto(baseUrl);
  await mobilePage.locator('h1').first().waitFor();
  assert.equal(await mobilePage.locator('article.event-card').count(), 8);
  assert.equal(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await mobilePage.screenshot({ path: path.join(screenshotDir, '04-mobile-home.png'), fullPage: true });
  details.push('Mobile 390px: trang hiển thị, không tràn ngang.');
  await mobile.close();
  await context.close();
  assert.equal(failures.length, 0, `Lỗi runtime: ${failures.join('; ')}`);
  details.push('Không có uncaught pageerror.');
  await writeFile(path.join(screenshotDir, 'browser-smoke.txt'), details.join('\n') + '\n', 'utf8');
  for (const detail of details) process.stdout.write(`PASS: ${detail}\n`);
} catch (error) {
  for (const detail of details) process.stdout.write(`PASS: ${detail}\n`);
  process.stderr.write(`FAIL: ${error.stack ?? error}\n`);
  process.exitCode = 1;
} finally {
  await browser.close();
}
