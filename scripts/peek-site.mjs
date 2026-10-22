#!/usr/bin/env node
/**
 * Peek at another portfolio (read-only): desktop + mobile screenshots and a
 * structural dump (headings, buttons, images, fonts, colors) for design
 * analysis. Usage: node scripts/peek-site.mjs <url>
 */
import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";

const URL = process.argv[2] ?? "https://ali-portfolio-nine.vercel.app/";
const chrome = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].find((c) => existsSync(c));

async function analyze(page, label) {
  const data = await page.evaluate(() => {
    const pick = (sel, map) => [...document.querySelectorAll(sel)].slice(0, 30).map(map);
    return {
      title: document.title,
      headings: pick("h1,h2,h3", (el) => `${el.tagName}: ${el.textContent.trim().slice(0, 80)}`),
      buttons: pick("button,a[class*='button'],a[class*='btn']", (el) => el.textContent.trim().slice(0, 40)),
      images: pick("img", (el) => ({ src: (el.currentSrc ?? el.src ?? "").slice(0, 100), alt: el.alt })),
      bodyFont: getComputedStyle(document.body).fontFamily,
      bg: getComputedStyle(document.body).backgroundColor,
      color: getComputedStyle(document.body).color,
      sections: pick("section,[data-section]", (el) => el.id || el.getAttribute("data-section") || el.className.slice(0, 40)),
      animations: pick("[style*='animation'],[class*='animate']", (el) => el.className.toString().slice(0, 60)),
      htmlLang: document.documentElement.lang,
      height: document.body.scrollHeight,
    };
  });
  console.log(`\n=== ${label} ===`);
  console.log(JSON.stringify(data, null, 1));
}

async function main() {
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--hide-scrollbars"] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: "networkidle2", timeout: 60_000 });
    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: "peek-desktop-top.png" });
    await analyze(page, "desktop top");
    // Mid page (scroll through to trigger lazy content/animations).
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: "peek-desktop-mid.png" });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: "peek-desktop-bottom.png" });

    const mobile = await browser.newPage();
    await mobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await mobile.goto(URL, { waitUntil: "networkidle2", timeout: 60_000 });
    await new Promise((r) => setTimeout(r, 2500));
    await mobile.screenshot({ path: "peek-mobile-top.png" });
    await mobile.screenshot({ path: "peek-mobile-full.png", fullPage: true });
    console.log("\nscreenshots: peek-desktop-{top,mid,bottom}.png, peek-mobile-{top,full}.png");
  } finally {
    await browser.close();
  }
}

await main();
