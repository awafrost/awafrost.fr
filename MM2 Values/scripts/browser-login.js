import fs from "node:fs/promises";
import { chromium } from "playwright";
import { config } from "../src/config.js";

await fs.mkdir(config.browserProfileDir, { recursive: true });
const context = await chromium.launchPersistentContext(config.browserProfileDir, {
  headless: false,
  ...(config.browserExecutablePath ? { executablePath: config.browserExecutablePath } : {}),
});
const page = context.pages()[0] || await context.newPage();
const url = `${config.sourceBaseUrl}/${config.sourceCategories[0]}`;

try {
  console.log(`Opening ${url}`);
  console.log("Keep this window open. Complete any Supreme Values browser challenge if one appears.");
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: config.sourceTimeoutMs });
  console.log(`Initial source response: HTTP ${response?.status() ?? "no response"}.`);
  await page.waitForFunction(
    () => (typeof globalThis._svPopup === "object"
      && globalThis._svPopup !== null
      && Object.keys(globalThis._svPopup).length > 0)
      || document.querySelectorAll("table tr .itemhead").length > 0,
    null,
    { timeout: 5 * 60 * 1000 },
  );
  const rowCount = await page.locator("table tr .itemhead").count();
  const popupCount = await page.evaluate(() => Object.keys(globalThis._svPopup || {}).length);
  if (rowCount === 0 && popupCount === 0) throw new Error("Supreme Values loaded without any value rows.");
  await context.storageState({ path: config.browserStorageStateFile });
  console.log(`Supreme Values page loaded (${rowCount} visible rows, ${popupCount} popup records).`);
  console.log(`Browser state saved locally to ${config.browserStorageStateFile}; do not commit or share this file.`);
} catch (error) {
  console.error("Browser session was not saved. Keep the window open through the challenge, then retry:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await context.close().catch(() => undefined);
}
