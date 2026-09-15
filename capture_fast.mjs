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

  const screens = [
    { url: "http://localhost:5173/home", file: "d:/ASV/RedBus Clone/home_screen_verify.png" },
    { url: "http://localhost:5173/offers", file: "d:/ASV/RedBus Clone/offers_screen_verify.png" },
    { url: "http://localhost:5173/help", file: "d:/ASV/RedBus Clone/help_screen_verify.png" },
    { url: "http://localhost:5173/journey", file: "d:/ASV/RedBus Clone/journey_screen_verify.png" },
  ];

  for (const s of screens) {
    console.log("Visiting", s.url);
    await page.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await new Promise((r) => setTimeout(r, 1000));
    const buf = await page.screenshot({ fullPage: false });
    fs.writeFileSync(s.file, buf);
    console.log("Saved", s.file);
  }

  await browser.close();
  console.log("All done!");
}

main().catch(console.error);
