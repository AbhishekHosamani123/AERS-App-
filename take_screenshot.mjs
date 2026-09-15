import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import os from 'os';
import path from 'path';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const TARGET_URL = "http://localhost:5173/home";
const OUTPUT_PATH = "d:/ASV/RedBus Clone/home_screen_shortcuts.png";
const ARTIFACT_PATH = "C:/Users/GEETA HOSMANI/.gemini/antigravity-ide/brain/4469199c-b7cf-4fbc-8827-2d329c837e0e/home_screen_shortcuts.png";
const TEMP_PROFILE_DIR = path.join(os.tmpdir(), "edge_cdp_profile_" + Date.now());

async function main() {
  console.log("Starting Edge in headless remote debugging mode...");
  const edge = spawn(EDGE_PATH, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--remote-debugging-port=9222",
    "--window-size=430,1200",
    `--user-data-dir=${TEMP_PROFILE_DIR}`,
    "about:blank"
  ]);

  // Wait 2s for CDP port to be open
  await new Promise(r => setTimeout(r, 2000));

  // Get WebSocket URL
  const listJson = await new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = listJson[0];
  if (!page || !page.webSocketDebuggerUrl) {
    throw new Error("No webSocketDebuggerUrl found: " + JSON.stringify(listJson));
  }

  console.log("Connecting to WebSocket:", page.webSocketDebuggerUrl);
  const WebSocket = (await import('node:http')).default; // or use standard WS if available or fetch via CDP

  // Since we have Node 18+ global WebSocket
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
  console.log("WebSocket connected. Enabling Page & Emulation...");

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 430,
    height: 932,
    deviceScaleFactor: 2,
    mobile: true
  });

  console.log("Navigating to", TARGET_URL);
  await send("Page.navigate", { url: TARGET_URL });

  // Wait 3.5s for fonts, icons, layout, animations to stabilize
  await new Promise(r => setTimeout(r, 3500));

  // Get layout metrics for full length height
  const metrics = await send("Page.getLayoutMetrics");
  console.log("Layout metrics:", metrics);
  const contentHeight = Math.ceil(metrics.contentSize.height || metrics.cssContentSize.height || 2200);
  const contentWidth = Math.ceil(metrics.contentSize.width || metrics.cssContentSize.width || 430);

  console.log(`Setting metrics for full length capture: ${contentWidth} x ${contentHeight}`);
  await send("Emulation.setDeviceMetricsOverride", {
    width: contentWidth,
    height: contentHeight,
    deviceScaleFactor: 2,
    mobile: true
  });

  await new Promise(r => setTimeout(r, 800));

  console.log("Capturing full screenshot...");
  const screenshotResult = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    fromSurface: true
  });

  const buffer = Buffer.from(screenshotResult.data, 'base64');
  fs.writeFileSync(OUTPUT_PATH, buffer);
  try {
    fs.writeFileSync(ARTIFACT_PATH, buffer);
  } catch (e) {
    console.error("Could not write to artifact dir:", e);
  }

  console.log(`Full screenshot saved successfully to: ${OUTPUT_PATH} (${buffer.length} bytes)`);

  ws.close();
  edge.kill();
  process.exit(0);
}

main().catch(err => {
  console.error("Error capturing screenshot:", err);
  process.exit(1);
});
