import fs from "node:fs/promises";
import { chromium } from "playwright";
import { extractSvPopup } from "./parser.js";
import { normalizeCategories } from "./normalize.js";

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function parseSourceUpdatedAt(text) {
  const match = text.match(/Values Last Updated\s*[-–:]\s*(.+?)(?=\/\/|Join our Discord|\n|$)/i);
  if (!match) return null;

  const normalized = match[1]
    .replace(/(\d+)(st|nd|rd|th)/gi, "$1")
    .replace(/\s+at\s+/i, " ")
    .trim();
  const timestamp = Date.parse(normalized);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

export function createBrowserLoader(options, logger) {
  return async function loadValues() {
    await fs.mkdir(options.browserProfileDir, { recursive: true });

    let browser = null;
    let context;
    let hasStorageState = false;
    try {
      await fs.access(options.browserStorageStateFile);
      hasStorageState = true;
    } catch {
      // Fall back to the persistent local profile when no exported state exists.
    }

    if (hasStorageState) {
      browser = await chromium.launch({
        headless: options.sourceHeadless,
        ...(options.browserExecutablePath ? { executablePath: options.browserExecutablePath } : {}),
      });
      context = await browser.newContext({ storageState: options.browserStorageStateFile });
    } else {
      context = await chromium.launchPersistentContext(options.browserProfileDir, {
        headless: options.sourceHeadless,
        ...(options.browserExecutablePath ? { executablePath: options.browserExecutablePath } : {}),
      });
    }

    const page = context.pages()[0] || await context.newPage();
    const categoryResults = [];
    let sourceUpdatedAt = null;
    try {
      for (const [index, category] of options.sourceCategories.entries()) {
        const url = `${options.sourceBaseUrl}/${encodeURIComponent(category)}`;
        logger.info("Fetching source category", { category, url });

        let response = null;
        for (let attempt = 1; attempt <= 3; attempt += 1) {
          response = await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: options.sourceTimeoutMs,
          });
          if (response?.ok()) break;
          if (!response) throw new Error(`Navigation returned no response for ${url}`);
          if (response.status() === 403) {
            throw new Error(`Supreme Values denied automated access (HTTP 403) for ${url}; no retry will be sent.`);
          }
          if (attempt === 3 || response.status() < 500) {
            throw new Error(`Source returned HTTP ${response.status()} for ${url}`);
          }
          logger.warn("Source returned a server error; retrying after cooldown", { category, attempt, status: response.status() });
          await sleep(Math.max(options.sourceDelayMs, 10_000) * attempt);
        }

        try {
          await page.waitForFunction(
            () => (typeof globalThis._svPopup === "object"
              && globalThis._svPopup !== null
              && Object.keys(globalThis._svPopup).length > 0)
              || document.querySelectorAll("table tr .itemhead").length > 0,
            null,
            { timeout: options.sourceTimeoutMs },
          );
        } catch (error) {
          const title = await page.title().catch(() => "unknown");
          throw new Error(`No MM2 value table was available for ${url}; page title: ${title}`, { cause: error });
        }

        const html = await page.content();
        let rawItems = {};
        try {
          rawItems = extractSvPopup(html);
        } catch (error) {
          if (!/No _svPopup assignment/.test(error.message)) throw error;
        }

        if (Object.keys(rawItems).length === 0) {
          const tableItems = await page.$$eval("table tr", (rows) => rows.flatMap((row) => {
            const name = row.querySelector(".itemhead")?.textContent?.trim();
            if (!name) return [];

            const value = row.querySelector(".itemvalue")?.textContent?.trim() ?? "";
            const isNumericValue = /^[-+]?\d[\d,]*(?:\.\d+)?$/.test(value);
            const valueNumber = isNumericValue
              ? Number(value.replace(/,/g, ""))
              : null;
            const bodyText = row.querySelector(".itembody")?.textContent ?? "";
            const demand = bodyText.match(/Demand\s*-\s*(\d+)/i)?.[1] ?? null;
            const rarity = bodyText.match(/Rarity\s*-\s*(\d+)/i)?.[1] ?? null;
            const imageButton = row.querySelector("button[data-image]");

            return [[name, {
              value,
              rawValue: Number.isFinite(valueNumber) ? valueNumber : null,
              range: row.querySelector(".itemrange")?.textContent?.trim() ?? "[N/A]",
              pctClass: row.querySelector(".itemvalue")?.className ?? "",
              stability: row.querySelector(".itemstability")?.textContent?.trim() ?? "",
              demand,
              rarity,
              origin: row.querySelector(".itemorigin")?.textContent?.trim() ?? "",
              diff: row.querySelector(".sv-diff-pos, .sv-diff-neg")?.textContent?.trim() ?? "",
              pctChange: row.querySelector(".sv-pctchange")?.textContent?.trim() ?? "",
              aliases: "",
              imageKey: imageButton?.getAttribute("data-image") ?? "",
              class: "",
            }]];
          }));
          rawItems = Object.fromEntries(tableItems);
        }

        if (!sourceUpdatedAt) {
          sourceUpdatedAt = parseSourceUpdatedAt(await page.locator("body").innerText().catch(() => ""));
        }

        const count = Object.keys(rawItems).length;
        if (count === 0) throw new Error(`_svPopup was empty for ${url}`);

        categoryResults.push({ category, rawItems });
        logger.info("Parsed source category", { category, count });
        if (index < options.sourceCategories.length - 1 && options.sourceDelayMs > 0) {
          await sleep(options.sourceDelayMs);
        }
      }

      const items = normalizeCategories(categoryResults);
      return {
        source: "Supreme Values MM2",
        sourceBaseUrl: options.sourceBaseUrl,
        fetchedAt: sourceUpdatedAt ?? new Date().toISOString(),
        categoryCount: categoryResults.length,
        count: items.length,
        items,
      };
    } finally {
      await context.close();
      if (browser) await browser.close();
    }
  };
}
