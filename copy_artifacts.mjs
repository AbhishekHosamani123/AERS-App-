import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = "C:/Users/GEETA HOSMANI/.gemini/antigravity-ide/brain/4469199c-b7cf-4fbc-8827-2d329c837e0e";
const files = [
  "home_screen_verify.png",
  "offers_screen_verify.png",
  "help_screen_verify.png",
  "journey_screen_verify.png"
];

for (const f of files) {
  const src = path.join("d:/ASV/RedBus Clone", f);
  const dest = path.join(ARTIFACT_DIR, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${f} to artifacts.`);
  }
}
