import puppeteer from 'puppeteer-core';
import fs from 'fs';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const TARGET_URL = "http://localhost:5173/home";
const OUTPUT_WORKSPACE = "d:/ASV/RedBus Clone/home_screen_redesign.png";
const OUTPUT_ARTIFACT = "C:/Users/GEETA HOSMANI/.gemini/antigravity-ide/brain/7e8b0ce7-064a-4b6e-8492-d7b800b912ab/home_screen_redesign.png";

async function main() {
  console.log("Launching Edge via Puppeteer...");
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

  console.log("Navigating to", TARGET_URL);
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0', timeout: 15000 });

  // Wait for icons and images
  await new Promise((r) => setTimeout(r, 2000));

  // Remove phone frame height restriction for full height render
  await page.evaluate(() => {
    const phonescreen = document.querySelector('.phonescreen');
    if (phonescreen) {
      phonescreen.style.height = 'auto';
      phonescreen.style.maxHeight = 'none';
      phonescreen.style.overflow = 'visible';
    }
    const appScroll = document.getElementById('app-scroll');
    if (appScroll) {
      appScroll.style.height = 'auto';
      appScroll.style.maxHeight = 'none';
      appScroll.style.overflow = 'visible';
    }
    const bottomnav = document.querySelector('.bottomnav');
    if (bottomnav) {
      bottomnav.style.position = 'relative';
    }
  });

  await new Promise((r) => setTimeout(r, 500));

  console.log("Capturing full page screenshot...");
  const screenshot = await page.screenshot({
    fullPage: true,
  });

  fs.writeFileSync(OUTPUT_WORKSPACE, screenshot);
  try {
    fs.writeFileSync(OUTPUT_ARTIFACT, screenshot);
  } catch (e) {
    console.error("Failed to copy to artifact dir:", e);
  }

  console.log(`Saved screenshot to: ${OUTPUT_WORKSPACE} (${screenshot.length} bytes)`);
  await browser.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error during capture:", err);
  process.exit(1);
});
