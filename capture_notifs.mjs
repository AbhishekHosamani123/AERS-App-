import puppeteer from 'puppeteer-core';
import fs from 'fs';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 430,
    height: 932,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  // 1. Home screen notifications
  console.log("Navigating to Home screen...");
  await page.goto("http://localhost:5173/home", { waitUntil: 'domcontentloaded', timeout: 10000 });
  await new Promise((r) => setTimeout(r, 1200));

  // Scroll down to notifications section
  await page.evaluate(() => {
    const notifsSection = document.querySelector('.home__section--notifs');
    if (notifsSection) {
      notifsSection.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  });
  await new Promise((r) => setTimeout(r, 600));

  const homeShot = await page.screenshot({ fullPage: false });
  fs.writeFileSync("d:/ASV/RedBus Clone/home_notifs_verify.png", homeShot);
  fs.writeFileSync("C:/Users/GEETA HOSMANI/.gemini/antigravity-ide/brain/4469199c-b7cf-4fbc-8827-2d329c837e0e/home_notifs_verify.png", homeShot);

  // 2. Notifications screen
  console.log("Navigating to Notifications screen...");
  await page.goto("http://localhost:5173/notifications", { waitUntil: 'domcontentloaded', timeout: 10000 });
  await new Promise((r) => setTimeout(r, 1200));

  const notifsShot = await page.screenshot({ fullPage: false });
  fs.writeFileSync("d:/ASV/RedBus Clone/notifs_screen_verify.png", notifsShot);
  fs.writeFileSync("C:/Users/GEETA HOSMANI/.gemini/antigravity-ide/brain/4469199c-b7cf-4fbc-8827-2d329c837e0e/notifs_screen_verify.png", notifsShot);

  await browser.close();
  console.log("All done!");
}

main().catch(console.error);
