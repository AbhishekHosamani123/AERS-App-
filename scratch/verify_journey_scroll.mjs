import puppeteer from 'puppeteer-core';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:5173";

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, isMobile: true, hasTouch: true });

  // Load a different tab first (simulating "switch from other tabs")
  await page.goto(BASE + '/home', { waitUntil: 'networkidle0', timeout: 20000 });
  await new Promise((r) => setTimeout(r, 800));

  // Switch to the Journey tab via SPA navigation (same remount path as tab switch)
  await page.evaluate(() => { window.history.pushState({}, '', '/journey'); window.dispatchEvent(new PopStateEvent('popstate')); });
  await new Promise((r) => setTimeout(r, 2000));

  const result = await page.evaluate(() => {
    const totalLevelNodes = document.querySelectorAll('[id^="level-node-"]').length;
    const moduleBanners = document.querySelectorAll('.journey-module-pill-banner').length;
    const hasLevel21 = !!document.getElementById('level-node-21');
    const hasLevel24 = !!document.getElementById('level-node-24');
    const node = document.getElementById('level-node-2');
    if (!node) return { error: 'node not found' };
    // Which element actually scrolls?
    let scroller = null;
    let el = node.parentElement;
    while (el) {
      const s = getComputedStyle(el);
      if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 1) { scroller = el; break; }
      el = el.parentElement;
    }
    const scrollerInfo = scroller
      ? { id: scroller.id, cls: scroller.className, scrollTop: Math.round(scroller.scrollTop), scrollHeight: scroller.scrollHeight, clientHeight: scroller.clientHeight }
      : null;
    const nodeRect = node.getBoundingClientRect();
    const viewportH = window.innerHeight;
    return {
      totalLevelNodes,
      moduleBanners,
      hasLevel21,
      hasLevel24,
      scroller: scrollerInfo,
      nodeTopInViewport: Math.round(nodeRect.top),
      nodeBottomInViewport: Math.round(nodeRect.bottom),
      viewportH,
      centered: nodeRect.top > 0 && nodeRect.bottom < viewportH,
    };
  });
  console.log('Result:', JSON.stringify(result, null, 2));

  // Screenshot 1: current level view (already captured)
  await page.screenshot({ path: 'D:/ASV/RedBus Clone/scratch/journey_scroll_verify.png' });

  // Screenshot 2: scroll to top of map — passport + Module 6 + Level 24
  await page.evaluate(() => {
    let el = document.getElementById('level-node-2');
    while (el) {
      const s = getComputedStyle(el);
      if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 1) { el.scrollTo({ top: 0 }); return; }
      el = el.parentElement;
    }
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: 'D:/ASV/RedBus Clone/scratch/journey_top_module6.png' });
  await browser.close();
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
