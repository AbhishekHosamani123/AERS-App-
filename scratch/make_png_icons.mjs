import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const SHORTCUTS_DIR = path.resolve('public/shortcuts');

async function convert() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 128, height: 128, deviceScaleFactor: 2 });

  const files = ['leaderboard', 'progress', 'passport', 'schedule'];

  for (const name of files) {
    const svgContent = fs.readFileSync(path.join(SHORTCUTS_DIR, `${name}.svg`), 'utf-8');
    const html = `<!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:transparent;display:flex;align-items:center;justify-content:center;width:128px;height:128px;">
        <div style="width:116px;height:116px;">
          ${svgContent.replace('width="64"', 'width="100%"').replace('height="64"', 'height="100%"')}
        </div>
      </body>
    </html>`;

    await page.setContent(html);
    const pngBuffer = await page.screenshot({
      omitBackground: true,
      type: 'png'
    });

    fs.writeFileSync(path.join(SHORTCUTS_DIR, `${name}.png`), pngBuffer);
    console.log(`Generated ${name}.png (${pngBuffer.length} bytes)`);
  }

  await browser.close();
  console.log("All shortcut PNGs generated successfully!");
}

convert().catch(err => {
  console.error("Conversion error:", err);
  process.exit(1);
});
