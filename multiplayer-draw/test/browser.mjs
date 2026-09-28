import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const base = process.env.TEST_URL || "http://127.0.0.1:5173/babylon-lite-multiplayer-draw/";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch({ channel: "chromium", headless: true, args: ["--enable-unsafe-webgpu", "--ignore-gpu-blocklist"] });
const errors = [];
async function page(context) {
  const page = await context.newPage();
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error" && !m.text().includes("favicon")) errors.push(m.text() + " " + m.location().url); });
  await page.goto(base);
  await page.waitForFunction(() => document.querySelector("#canvas").dataset.ready === "true" || document.querySelector("#overlay-title").textContent === "Canvas unavailable", { timeout: 60000 });
  assert.equal(await page.locator("#canvas").getAttribute("data-ready"), "true", await page.locator("#overlay-message").textContent());
  await page.waitForFunction(() => document.querySelector("#connection").dataset.state === "connected");
  return page;
}
async function stroke(page, points) {
  const box = await page.locator("#canvas").boundingBox();
  await page.mouse.move(box.x + points[0][0] * box.width, box.y + points[0][1] * box.height);
  await page.mouse.down();
  for (const [x,y] of points.slice(1)) await page.mouse.move(box.x + x * box.width, box.y + y * box.height, { steps: 3 });
  await page.mouse.up();
}
try {
  const c1 = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const c2 = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const a = await page(c1), b = await page(c2);
  await a.waitForFunction(() => document.querySelector("#occupancy").textContent === "2 / 12");
  await stroke(a, [[0.2,0.25],[0.5,0.25],[0.7,0.4]]);
  await b.waitForFunction(() => globalThis.__drawState().strokes.size === 1);
  await stroke(b, [[0.2,0.6],[0.7,0.6]]);
  await a.waitForFunction(() => globalThis.__drawState().strokes.size === 2);
  await a.keyboard.press("e");
  await stroke(a, [[0.4,0.6],[0.45,0.6]]);
  assert.equal(await a.evaluate(() => __drawState().strokes.size), 2, "Cannot erase peer artwork");
  await stroke(a, [[0.4,0.25],[0.45,0.25]]);
  await b.waitForFunction(() => __drawState().strokes.size === 1);
  const oldId = await b.evaluate(() => __drawState().sessionId);
  await b.reload();
  await b.waitForFunction(() => document.querySelector("#connection").dataset.state === "connected");
  await a.waitForFunction(() => __drawState().strokes.size === 0);
  assert.notEqual(await b.evaluate(() => __drawState().sessionId), oldId);
  await a.keyboard.press("p");
  // Actual pointer-drawn orbital doodle for the documentation capture.
  const circle = Array.from({ length: 65 }, (_, i) => [0.5 + Math.cos(i/64*Math.PI*2)*0.20, 0.43 + Math.sin(i/64*Math.PI*2)*0.1125]);
  await stroke(a, circle);
  const orbit = Array.from({ length: 85 }, (_, i) => { const t = i/84*Math.PI*2; return [0.5 + Math.cos(t)*0.34, 0.43 + Math.sin(t)*0.04 + Math.cos(t)*0.10]; });
  await stroke(b, orbit);
  await stroke(a, [[0.45,0.40],[0.45,0.405]]);
  await stroke(a, [[0.56,0.40],[0.56,0.405]]);
  await stroke(b, [[0.43,0.46],[0.48,0.48],[0.53,0.48],[0.57,0.46]]);
  await stroke(b, [[0.24,0.23],[0.24,0.27]]);
  await stroke(b, [[0.20,0.25],[0.28,0.25]]);
  await stroke(a, [[0.78,0.59],[0.78,0.63]]);
  await stroke(a, [[0.74,0.61],[0.82,0.61]]);
  await a.waitForFunction(() => __drawState().strokes.size >= 8);
  await a.screenshot({ path: "test-results/desktop.png" });
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const mobile = await page(mobileContext);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight), true, "Mobile viewport must not scroll");
  const box = await mobile.locator("#canvas").boundingBox();
  await mobile.touchscreen.tap(box.x + box.width * 0.5, box.y + box.height * 0.7);
  await a.waitForFunction(() => [...__drawState().strokes.values()].some(s => s.points[0][1] > 0.69));
  await mobile.screenshot({ path: "test-results/mobile.png" });
  await c2.close();
  await a.waitForFunction(() => __drawState().players.length === 2);
  await mobileContext.close();
  const unsupported = await browser.newContext();
  await unsupported.addInitScript(() => Object.defineProperty(navigator, "gpu", { get: () => undefined }));
  const noGpu = await unsupported.newPage();
  await noGpu.goto(base);
  await noGpu.waitForFunction(() => document.querySelector("#overlay-title").textContent === "Canvas unavailable");
  assert.match(await noGpu.locator("#overlay-message").textContent(), /WebGPU/);
  assert.deepEqual(errors, []);
  console.log("PASS: two browsers draw/erase, ownership, fresh refresh, cleanup, cursors, mobile touch/layout, unsupported WebGPU, no runtime errors");
} finally { await browser.close(); }


