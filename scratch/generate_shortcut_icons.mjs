import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import http from 'http';
import os from 'os';

const SHORTCUTS_DIR = 'd:/ASV/RedBus Clone/public/shortcuts';
if (!fs.existsSync(SHORTCUTS_DIR)) {
  fs.mkdirSync(SHORTCUTS_DIR, { recursive: true });
}

// 1. Leaderboard Trophy SVG
const leaderboardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <linearGradient id="blueBase" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#F59E0B" flood-opacity="0.35"/>
    </filter>
  </defs>
  <!-- Handles -->
  <path d="M14 20 C14 29 22 33 28 34" stroke="url(#goldGrad)" stroke-width="4.5" stroke-linecap="round" fill="none" />
  <path d="M50 20 C50 29 42 33 36 34" stroke="url(#goldGrad)" stroke-width="4.5" stroke-linecap="round" fill="none" />
  <!-- Cup Body -->
  <path d="M18 12 H46 V24 C46 33.5 39.5 40 32 40 C24.5 40 18 33.5 18 24 Z" fill="url(#goldGrad)" filter="url(#glow)"/>
  <!-- Cup Rim highlight -->
  <ellipse cx="32" cy="12" rx="14" ry="3.5" fill="#FEF08A" />
  <!-- Star on Cup -->
  <polygon points="32,19 34,23.5 39,24 35.2,27.5 36.3,32.5 32,29.8 27.7,32.5 28.8,27.5 25,24 30,23.5" fill="#FFFFFF" opacity="0.95"/>
  <!-- Stem -->
  <path d="M30 40 H34 V48 H30 Z" fill="#D97706" />
  <!-- Pedestal Base -->
  <rect x="22" y="48" width="20" height="9" rx="3" fill="url(#blueBase)" />
  <rect x="25" y="50.5" width="14" height="4" rx="1.5" fill="#60A5FA" opacity="0.6"/>
</svg>`;

// 2. My Progress Chart SVG
const progressSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
  <defs>
    <linearGradient id="bar1Grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#93C5FD"/>
      <stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>
    <linearGradient id="bar2Grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="bar3Grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>
    <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#2563EB" flood-opacity="0.25"/>
    </filter>
  </defs>
  <!-- Grid lines / Base plate -->
  <rect x="8" y="10" width="48" height="46" rx="8" fill="#F0F7FF" opacity="0.7"/>
  <!-- Bars -->
  <rect x="15" y="34" width="8.5" height="16" rx="3" fill="url(#bar1Grad)" filter="url(#chartGlow)"/>
  <rect x="27.5" y="24" width="8.5" height="26" rx="3" fill="url(#bar2Grad)" filter="url(#chartGlow)"/>
  <rect x="40" y="15" width="8.5" height="35" rx="3" fill="url(#bar3Grad)" filter="url(#chartGlow)"/>
  <!-- Upward Trend Line & Arrow -->
  <path d="M15 30 L28 19 L44 9" stroke="url(#arrowGrad)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M37 8.5 H45.5 V17" stroke="url(#arrowGrad)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Highlight dots on trend points -->
  <circle cx="15" cy="30" r="2.5" fill="#F59E0B"/>
  <circle cx="28" cy="19" r="2.5" fill="#F59E0B"/>
  <circle cx="44" cy="9" r="2.5" fill="#EF4444"/>
</svg>`;

// 3. Passport Badge / Graduation SVG
const passportSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
  <defs>
    <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <filter id="passGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#1E3A8A" flood-opacity="0.3"/>
    </filter>
  </defs>
  <!-- Passport Booklet Base -->
  <rect x="13" y="10" width="38" height="46" rx="6" fill="#1E40AF" filter="url(#passGlow)"/>
  <rect x="16" y="13" width="32" height="40" rx="4" fill="#2563EB" opacity="0.4"/>
  <!-- Graduation Cap Icon on Booklet -->
  <!-- Cap Diamond -->
  <polygon points="32,20 48,27 32,34 16,27" fill="#FFFFFF"/>
  <path d="M23 30.5 V37 C23 41 41 41 41 37 V30.5" fill="#E0E7FF" opacity="0.9"/>
  <!-- Tassel -->
  <path d="M48 27 L50 38" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="50" cy="39" r="2.2" fill="#F59E0B"/>
  <!-- Gold Shield / Seal Badge -->
  <circle cx="32" cy="46" r="6.5" fill="url(#badgeGrad)"/>
  <polygon points="32,42.5 33.5,45.5 36.5,46 34.2,48 35,51 32,49.2 29,51 29.8,48 27.5,46 30.5,45.5" fill="#FFFFFF"/>
</svg>`;

// 4. Schedule Calendar SVG
const scheduleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
  <defs>
    <linearGradient id="calHead" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
    <linearGradient id="clockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <filter id="calGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#1E3A8A" flood-opacity="0.25"/>
    </filter>
  </defs>
  <!-- Calendar Body -->
  <rect x="10" y="13" width="44" height="42" rx="8" fill="#FFFFFF" stroke="#DBEAFE" stroke-width="1.5" filter="url(#calGlow)"/>
  <!-- Header Bar -->
  <path d="M10 21 C10 16.5 13.5 13 18 13 H46 C50.5 13 54 16.5 54 21 V24 H10 Z" fill="url(#calHead)"/>
  <!-- Hanging Rings -->
  <rect x="19" y="8" width="4" height="9" rx="2" fill="#93C5FD"/>
  <rect x="41" y="8" width="4" height="9" rx="2" fill="#93C5FD"/>
  <!-- Grid Dots / Cells -->
  <circle cx="19" cy="31" r="2.2" fill="#94A3B8"/>
  <circle cx="28" cy="31" r="2.2" fill="#94A3B8"/>
  <circle cx="37" cy="31" r="2.2" fill="#94A3B8"/>
  <circle cx="19" cy="39" r="2.2" fill="#94A3B8"/>
  <circle cx="28" cy="39" r="2.2" fill="#2563EB"/>
  <circle cx="19" cy="47" r="2.2" fill="#94A3B8"/>
  <!-- Highlight Active Day Badge -->
  <rect x="23.5" y="35" width="9" height="8" rx="2.5" fill="#DBEAFE" opacity="0.6"/>
  <!-- Mini Clock on corner -->
  <circle cx="44" cy="44" r="9" fill="url(#clockGrad)" stroke="#FFFFFF" stroke-width="2"/>
  <path d="M44 39.5 V44 L47 46" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

// Write SVGs directly
fs.writeFileSync(path.join(SHORTCUTS_DIR, 'leaderboard.svg'), leaderboardSvg);
fs.writeFileSync(path.join(SHORTCUTS_DIR, 'progress.svg'), progressSvg);
fs.writeFileSync(path.join(SHORTCUTS_DIR, 'passport.svg'), passportSvg);
fs.writeFileSync(path.join(SHORTCUTS_DIR, 'schedule.svg'), scheduleSvg);

console.log("SVGs written successfully to public/shortcuts/");

// Convert SVGs to high-res transparent PNGs using Edge CDP
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const TEMP_PROFILE_DIR = path.join(os.tmpdir(), "edge_icons_profile_" + Date.now());

async function renderPngs() {
  const edge = spawn(EDGE_PATH, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--remote-debugging-port=9223",
    "--window-size=200,200",
    `--user-data-dir=${TEMP_PROFILE_DIR}`,
    "about:blank"
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const listJson = await new Promise((resolve, reject) => {
    http.get('http://localhost:9223/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = listJson[0];
  const ws = new globalThis.WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const pending = new Map();
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 128,
    height: 128,
    deviceScaleFactor: 2,
    mobile: false
  });

  const items = [
    { name: 'leaderboard', svg: leaderboardSvg },
    { name: 'progress', svg: progressSvg },
    { name: 'passport', svg: passportSvg },
    { name: 'schedule', svg: scheduleSvg }
  ];

  for (const item of items) {
    const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;display:flex;align-items:center;justify-content:center;width:128px;height:128px;">
      <div style="width:112px;height:112px;">${item.svg.replace('width="64"', 'width="100%"').replace('height="64"', 'height="100%"')}</div>
    </body></html>`;
    
    await send("Page.setDocumentContent", {
      frameId: (await send("Page.getFrameTree")).frameTree.frame.id,
      html
    });

    await new Promise(r => setTimeout(r, 200));

    const result = await send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true
    });

    const pngBuffer = Buffer.from(result.data, 'base64');
    fs.writeFileSync(path.join(SHORTCUTS_DIR, `${item.name}.png`), pngBuffer);
    console.log(`Generated ${item.name}.png (${pngBuffer.length} bytes)`);
  }

  ws.close();
  edge.kill();
}

renderPngs().catch(err => {
  console.error("Error generating PNGs:", err);
});
