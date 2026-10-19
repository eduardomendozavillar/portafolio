#!/usr/bin/env node
/**
 * Repro: open the SGDI lightbox on the live/preview site and dump the
 * dialog's computed box so CSS centering issues are diagnosed from facts.
 */
import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";

const BASE_URL = process.env.CAPTURE_BASE_URL ?? "http://localhost:3050";
const OUT = process.env.OUT ?? "/tmp/lightbox-repro.png";

const chrome = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].find((c) => existsSync(c));

async function main() {
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--hide-scrollbars"] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 900 });
    await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 60_000 });
    await page.waitForSelector("[data-project-card]", { timeout: 30_000 });
    await new Promise((r) => setTimeout(r, 800));

    await page.evaluate(() => {
      document.getElementById("proyectos")?.scrollIntoView({ behavior: "auto", block: "start" });
    });
    await new Promise((r) => setTimeout(r, 800));

    // Click the card's Vista previa button for SGDI (last featured card).
    const clicked = await page.evaluate(() => {
      const card = document.querySelector('[data-project-id="github-sgdi"]');
      const button = card?.querySelector('button[aria-label^="Vista previa"]');
      if (button) {
        button.click();
        return true;
      }
      return false;
    });
    console.log("clicked sgdi vista previa:", clicked);
    await new Promise((r) => setTimeout(r, 900));

    const box = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return null;
      const rect = dialog.getBoundingClientRect();
      const style = getComputedStyle(dialog);
      return {
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height, bottom: rect.bottom },
        viewport: { w: innerWidth, h: innerHeight, scrollY },
        css: {
          top: style.top,
          translate: style.translate,
          scale: style.scale,
          maxHeight: style.maxHeight,
          overflowY: style.overflowY,
          scrollHeight: dialog.scrollHeight,
        },
        classList: [...dialog.classList],
      };
    });
    console.log(JSON.stringify(box, null, 2));
    await page.screenshot({ path: OUT });
    console.log("screenshot ->", OUT);
  } finally {
    await browser.close();
  }
}

await main();
