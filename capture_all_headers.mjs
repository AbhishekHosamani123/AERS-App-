import puppeteer from 'puppeteer-core';
import fs from 'fs';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function captureScreen(url, filename) {
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

  console.log("Navigating to", url);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1500));

  const screenshot = await page.screenshot({ fullPage: false });
  fs.writeFileSync(filename, screenshot);
  console.log("Captured", filename);
  await browser.close();
}

async function main() {
  await captureScreen("http://localhost:5173/home", "d:/ASV/RedBus Clone/home_screen_verify.png");
  await captureScreen("http://localhost:5173/offers", "d:/ASV/RedBus Clone/offers_screen_verify.png");
  await captureScreen("http://localhost:5173/help", "d:/ASV/RedBus Clone/help_screen_verify.png");
  await captureScreen("http://localhost:5173/journey", "d:/ASV/RedBus Clone/journey_screen_verify.png");
  console.log("All screenshots captured successfully!");
}

main().catch(console.error);
