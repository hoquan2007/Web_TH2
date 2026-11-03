import { chromium } from 'playwright';
import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';

const origin = process.env.DEMO_URL ?? 'https://6651071056-lab2-dat-ve-su-kien.vercel.app';
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox'],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  recordVideo: { dir: path.resolve('evidence'), size: { width: 1280, height: 800 } },
});

const pause = (ms = 1300) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await page.locator('article.event-card').first().waitFor();
  await pause(3500);

  // Feature 1: infinite scroll, with the visible number of cards growing.
  for (let index = 0; index < 7; index++) {
    await page.evaluate(() => window.scrollBy({ top: 660, behavior: 'smooth' }));
    await pause(1000);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await pause(1500);

  // Feature 2: localStorage favorites still present after reloading.
  await page.getByRole('button', { name: /Yêu thích/ }).first().click();
  await pause(1100);
  await page.reload();
  await pause(1500);
  await page.getByRole('link', { name: 'Yêu thích', exact: true }).click();
  await pause(2400);

  // Feature 3: theme persists after reloading.
  await page.getByRole('button', { name: 'Bật chế độ tối' }).click();
  await pause(2400);
  await page.reload();
  await pause(2200);
  await page.getByRole('button', { name: 'Bật chế độ sáng' }).click();
  await pause(1300);

  // Browse a detailed event and complete the booking flow.
  await page.goto(origin);
  await page.locator('article.event-card').first().getByRole('link').last().click();
  await pause(2600);
  await page.getByRole('button', { name: /Đặt vé ngay/ }).click();
  await pause(1700);
  await page.getByLabel(/Họ và tên/).fill('Hồ Ngọc Quân');
  await page.getByLabel(/Email/).fill('demo@example.com');
  await pause(1500);
  await page.getByRole('dialog').getByRole('button', { name: 'Xác nhận đặt vé' }).click();
  await pause(2200);
  await page.getByRole('link', { name: /Xem vé của tôi/ }).click();
  await pause(3200);

  if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);
  const video = page.video();
  await context.close();
  if (!video) throw new Error('Video capture unavailable');
  const source = await video.path();
  await mkdir('public', { recursive: true });
  const destination = path.resolve('public/demo-lab2.webm');
  await copyFile(source, destination);
  console.log(`DEMO_VIDEO=${destination}`);
} finally {
  await browser.close();
}
