import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACT_DIR = "C:/Users/GEETA HOSMANI/.gemini/antigravity-ide/brain/88ef2a8c-6caf-41dc-bf65-f20cf1df222f";
const WORKSPACE_DIR = "d:/ASV/RedBus Clone";

const STAGES = [
  { name: "lvl1_01_overview", title: "Overview / Launchpad", stage: "overview", setup: async (page) => {} },
  { name: "lvl1_02_objectives", title: "Step 1: Learning Objectives", stage: "objectives", setup: async (page) => {} },
  { name: "lvl1_03_notes", title: "Step 2: Read Lesson Notes", stage: "notes", setup: async (page) => {} },
  { name: "lvl1_04_video", title: "Step 3: Concept Video & Prompts", stage: "video", setup: async (page) => {} },
  { name: "lvl1_05_quiz", title: "Step 4: Checkpoint Quiz", stage: "quiz", setup: async (page) => {} },
  { name: "lvl1_06_activity_worksheet", title: "Step 5: Worksheet Stepper", stage: "activity", setup: async (page) => {
    // Fill in sample strengths so it looks complete
    await page.evaluate(() => {
      const autofillBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Autofill'));
      if (autofillBtn) autofillBtn.click();
    });
  }},
  { name: "lvl1_07_activity_review", title: "Step 5: Review Snapshot", stage: "activity_review", setup: async (page) => {} },
  { name: "lvl1_08_submission", title: "Step 6: Submit Evidence (Uploaded)", stage: "submission_uploaded", setup: async (page) => {
    // Check certification checkbox
    await page.evaluate(() => {
      const chk = document.querySelector('.lvl1-custom-checkbox');
      if (chk && !chk.checked) chk.click();
    });
  }},
  { name: "lvl1_08_submission_empty", title: "Step 6: Submit Evidence (Empty Initial)", stage: "submission_empty", setup: async (page) => {} },
  { name: "lvl1_08_submission_success", title: "Step 6: Evidence Submitted Confirmation", stage: "submission_success", setup: async (page) => {} },
  { name: "lvl1_09_eval_pending", title: "Evaluation: Under Review", stage: "eval_pending", setup: async (page) => {} },
  { name: "lvl1_10_eval_revision", title: "Evaluation: Revisions Requested", stage: "eval_revision", setup: async (page) => {} },
  { name: "lvl1_11_eval_approved", title: "Evaluation: Approved & Badges", stage: "eval_approved", setup: async (page) => {} }
];

async function main() {
  console.log("Launching Edge for Level 1 full-page captures...");
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

  console.log("Navigating to Level 1 page...");
  await page.goto("http://localhost:5173/journey/level-1", { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  for (const item of STAGES) {
    console.log(`\n--- Capturing Stage: ${item.title} (${item.stage}) ---`);
    
    // Open tester menu and click the stage button
    await page.evaluate(() => {
      // Find state tester button
      const testerBtn = document.querySelector('.lvl1-tester-btn');
      if (testerBtn) testerBtn.click();
    });
    await new Promise(r => setTimeout(r, 200));

    // Click the specific stage button
    await page.evaluate((targetStage) => {
      const buttons = Array.from(document.querySelectorAll('.lvl1-tester-bar__pills button'));
      let targetBtn;
      if (targetStage === 'overview') targetBtn = buttons.find(b => b.textContent && b.textContent.includes('Overview'));
      else if (targetStage === 'objectives') targetBtn = buttons.find(b => b.textContent && b.textContent.includes('Objectives'));
      else if (targetStage === 'notes') targetBtn = buttons.find(b => b.textContent && b.textContent.includes('Notes'));
      else if (targetStage === 'video') targetBtn = buttons.find(b => b.textContent && b.textContent.includes('Video'));
      else if (targetStage === 'quiz') targetBtn = buttons.find(b => b.textContent && b.textContent.includes('Quiz'));
      else if (targetStage === 'activity') targetBtn = buttons.find(b => b.textContent && b.textContent.includes('Activity'));
      else if (targetStage === 'activity_review') targetBtn = buttons.find(b => b.textContent && b.textContent.includes('Review'));
      else if (targetStage === 'submission_uploaded') targetBtn = buttons.find(b => b.textContent && b.textContent.includes('Uploaded'));
      else if (targetStage === 'submission_empty') targetBtn = buttons.find(b => b.textContent && b.textContent.includes('Upload (Empty)'));
      else if (targetStage === 'submission_success') targetBtn = buttons.find(b => b.textContent && b.textContent.includes('Submitted'));
      else if (targetStage === 'eval_pending') targetBtn = buttons.find(b => b.textContent && b.textContent.includes('Pending'));
      else if (targetStage === 'eval_revision') targetBtn = buttons.find(b => b.textContent && b.textContent.includes('Revision'));
      else if (targetStage === 'eval_approved') targetBtn = buttons.find(b => b.textContent && b.textContent.includes('Approved'));

      if (targetBtn) targetBtn.click();
    }, item.stage);

    await new Promise(r => setTimeout(r, 500));
    await item.setup(page);
    await new Promise(r => setTimeout(r, 500));

    // Adjust heights for full long page capture
    await page.evaluate(() => {
      const scrollables = [
        document.querySelector('.phonescreen'),
        document.getElementById('app-scroll'),
        document.querySelector('.lvl1-screen-container'),
        document.querySelector('.lvl1-main-scroll'),
        document.body,
        document.documentElement
      ];
      scrollables.forEach(el => {
        if (el) {
          el.style.height = 'auto';
          el.style.maxHeight = 'none';
          el.style.overflow = 'visible';
        }
      });
      // Ensure tester bar is hidden during screenshot
      const testerBar = document.querySelector('.lvl1-tester-bar');
      if (testerBar) testerBar.style.display = 'none';
    });

    await new Promise(r => setTimeout(r, 400));

    const phoneEl = await page.$('.phonescreen');
    let screenshotBuffer;
    if (phoneEl) {
      screenshotBuffer = await phoneEl.screenshot();
    } else {
      screenshotBuffer = await page.screenshot({ fullPage: true });
    }

    const wsPath = path.join(WORKSPACE_DIR, `${item.name}.png`);
    const artPath = path.join(ARTIFACT_DIR, `${item.name}.png`);

    fs.writeFileSync(wsPath, screenshotBuffer);
    try {
      fs.writeFileSync(artPath, screenshotBuffer);
    } catch {}

    console.log(`Saved screenshot: ${wsPath}`);
  }

  await browser.close();
  console.log("\nAll Level 1 screenshots successfully captured!");
}

main().catch(console.error);
