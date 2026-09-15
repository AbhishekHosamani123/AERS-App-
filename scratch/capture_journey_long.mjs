import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const TARGET_URL = "http://localhost:5173/journey";
const OUTPUT_PATH = "d:/ASV/RedBus Clone/journey_screen_full.png";
const ARTIFACT_PATH = "C:/Users/GEETA HOSMANI/.gemini/antigravity-ide/brain/4469199c-b7cf-4fbc-8827-2d329c837e0e/journey_screen_full.png";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=430,3000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 2900, deviceScaleFactor: 2 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // Expand container heights so the entire 2750px canvas is visible and captured in full
  await page.evaluate(() => {
    const scrollContainers = document.querySelectorAll('.phonescreen, .app-scroll, .journey-page, .journey-scroll');
    scrollContainers.forEach(el => {
      el.style.height = 'auto';
      el.style.maxHeight = 'none';
      el.style.overflow = 'visible';
    });
    const hud = document.querySelector('.journey-hud');
    if (hud) {
      hud.style.position = 'relative'; // so it sits nicely at the top of the full capture
    }
  });

  await new Promise(r => setTimeout(r, 500));

  const journeyPage = await page.$('.journey-page') || await page.$('.phonescreen');
  if (journeyPage) {
    const buffer = await journeyPage.screenshot({ type: 'png' });
    fs.writeFileSync(OUTPUT_PATH, buffer);
    try {
      fs.writeFileSync(ARTIFACT_PATH, buffer);
    } catch (e) {
      console.error("Artifact write error:", e);
    }
    console.log(`Journey full long screenshot captured (${buffer.length} bytes) to ${OUTPUT_PATH}`);
  } else {
    await page.screenshot({ path: OUTPUT_PATH, fullPage: true });
    console.log("Fallback full page screenshot saved");
  }

  await browser.close();
}

run().catch(err => {
  console.error("Capture error:", err);
  process.exit(1);
});
