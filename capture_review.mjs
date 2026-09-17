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
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  // --- Test 1: Locked node feedback on Journey map ---
  await page.goto('http://localhost:5173/journey', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1500));
  // Level 05 is locked (current=2, completed=1)
  await page.evaluate(() => {
    const el = document.getElementById('level-node-5');
    if (el) el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 400));
  const toastText = await page.evaluate(() => {
    const t = document.querySelector('.journey-unlock-toast');
    const shaking = document.querySelector('.podium-node.is-shaking');
    return { toast: t ? t.textContent : null, shaking: !!shaking };
  });
  console.log('TEST1 locked-toast:', JSON.stringify(toastText));
  fs.writeFileSync('d:/ASV/RedBus Clone/review_locked_feedback.png', await page.screenshot());
  await new Promise((r) => setTimeout(r, 2400));
  const toastGone = await page.evaluate(() => !document.querySelector('.journey-unlock-toast'));
  console.log('TEST1 toast auto-dismissed:', toastGone);

  // --- Test 2: Level 1 CTA hint + no fake progress dot + tester icon ---
  await page.goto('http://localhost:5173/journey/level-1', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1500));
  const lvl1 = await page.evaluate(() => {
    const hint = document.querySelector('.lvl1-cta-hint__value');
    const label = document.querySelector('.lvl1-cta-hint__label');
    const fill = document.querySelector('.lvl1-hero-progress-fill');
    const fillWidth = fill ? fill.style.width : null;
    const iconBtn = document.querySelector('.lvl1-tester-btn--icon');
    const connectors = document.querySelectorAll('.lvl1-roadmap-connector').length;
    return {
      label: label ? label.textContent : null,
      hint: hint ? hint.textContent : null,
      fillWidth,
      iconTester: !!iconBtn,
      connectors,
    };
  });
  console.log('TEST2 level1:', JSON.stringify(lvl1));

  // --- Test 3: progress fill grows after completing a step (objectives) ---
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.lvl1-step-card-modern');
    if (cards[0]) (cards[0]).dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 600));
  const onObjectives = await page.evaluate(() => !!document.querySelector('.lvl1-objectives-grid'));
  console.log('TEST3 navigated to objectives:', onObjectives);

  await browser.close();
  console.log('Validation done!');
}

main().catch((e) => { console.error(e); process.exit(1); });
