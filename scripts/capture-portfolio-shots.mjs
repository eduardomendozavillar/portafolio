#!/usr/bin/env node
/**
 * One-shot capture (run with `node scripts/capture-portfolio-shots.mjs` while
 * a server for this site is reachable): takes clean section screenshots of
 * the portfolio itself into `img/PORTAFOLIO/`, the raw source folder consumed
 * by `scripts/optimize-project-images.mjs` (which converts them to optimized
 * webp and updates the manifest for the "Portafolio personal" project).
 *
 * Uses the system Chrome via puppeteer-core (no browser download). Section
 * shots give the scroll reveals time to finish (one-shot IO) before capture.
 */
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const BASE_URL = process.env.CAPTURE_BASE_URL ?? "http://localhost:3050";
const OUTPUT_DIR = path.resolve(fileURLToPath(new URL("../img/PORTAFOLIO", import.meta.url)));

/** Ordered section anchors (same ids the header nav links to). */
const SECTIONS = [
  ["inicio", "hero"],
  ["proyectos", "proyectos"],
  ["experiencia", "experiencia"],
  ["contacto", "contacto"],
];

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter((candidate) => existsSync(candidate));
  return candidates[0];
}

async function main() {
  const executablePath = findChrome();
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--hide-scrollbars", "--force-device-scale-factor=1"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 60_000 });

    // Projects are client-fetched: wait for the showcase tracking hooks.
    await page.waitForSelector("[data-project-card]", { timeout: 30_000 });
    await new Promise((resolve) => setTimeout(resolve, 1200));

    await mkdir(OUTPUT_DIR, { recursive: true });
    for (const [anchor, name] of SECTIONS) {
      await page.evaluate((id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "auto", block: "start" });
      }, anchor);
      // Let one-shot reveals and the showcase tracking settle.
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const target = path.join(OUTPUT_DIR, `portafolio-${name}.png`);
      await page.screenshot({ path: target });
      console.log(`captured ${anchor} -> ${target}`);
    }
  } finally {
    await browser.close();
  }
  console.log("done");
}

await main();
