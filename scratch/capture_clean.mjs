import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const TARGET_URL = "http://localhost:5173/home";
const OUTPUT_PATH = "d:/ASV/RedBus Clone/home_screen_shortcuts.png";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=430,932']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: OUTPUT_PATH, fullPage: true });
  console.log("Full page screenshot saved to:", OUTPUT_PATH);

  await browser.close();
}

run().catch(err => {
  console.error("Capture error:", err);
  process.exit(1);
});
