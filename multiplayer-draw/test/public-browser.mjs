import { chromium } from "playwright";
import { MultiplayerClient } from "@rmc/multiplayer-client";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const base = process.env.TEST_URL || "https://samuelasherrivello.github.io/babylon-lite-multiplayer-draw/";
const endpoint = process.env.SERVER_URL || "https://rmc-colyseus-multiplayer-server.vercel.app";
const observer = new MultiplayerClient(endpoint);
const errors = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(test, description) {
  const deadline = Date.now() + 30000;
  while (!test()) { if (Date.now() > deadline) throw new Error(description); await delay(50); }
}
const browser = await chromium.launch({ channel: "chromium", headless: true, args: ["--enable-unsafe-webgpu", "--ignore-gpu-blocklist"] });
async function open(viewport = { width: 1440, height: 1000 }, mobile = false) {
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  page.on("response", response => { if (response.status() >= 400 && response.url().startsWith(base)) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(base);
  await page.waitForFunction(() => document.querySelector("#canvas").dataset.ready === "true" && document.querySelector("#connection").dataset.state === "connected", { timeout: 60000 });
  assert.equal(await page.evaluate(() => typeof globalThis.__drawState), "undefined", "Public build must not depend on development hooks");
  return { context, page };
}
async function stroke(page, points) {
  const box = await page.locator("#canvas").boundingBox();
  await page.mouse.move(box.x + points[0][0] * box.width, box.y + points[0][1] * box.height);
  await page.mouse.down();
  for (const [x,y] of points.slice(1)) await page.mouse.move(box.x + x * box.width, box.y + y * box.height, { steps: 3 });
  await page.mouse.up();
}
try {
  await mkdir("test-results", { recursive: true });
  await observer.connect();
  await until(() => observer.state.status === "connected", "Observer failed to join");
  const initialIds = new Set(observer.state.players.map(p => p.id));
  const a = await open();
  await until(() => observer.state.players.some(p => !initialIds.has(p.id)), "Browser A presence missing");
  const aId = observer.state.players.find(p => !initialIds.has(p.id)).id;
  const beforeB = new Set(observer.state.players.map(p => p.id));
  const b = await open();
  await until(() => observer.state.players.some(p => !beforeB.has(p.id)), "Browser B presence missing");
  const bId = observer.state.players.find(p => !beforeB.has(p.id)).id;
  const own = id => [...observer.state.strokes.values()].filter(s => s.owner === id);
  const blank = await b.page.locator("#canvas").screenshot();
  await stroke(a.page, [[0.2,0.25],[0.5,0.25],[0.7,0.4]]);
  await until(() => own(aId).some(s => s.complete), "A stroke failed to reach live server");
  await delay(500);
  assert.notDeepEqual(await b.page.locator("#canvas").screenshot(), blank, "Remote drawing must render in browser B");
  await stroke(b.page, [[0.2,0.6],[0.7,0.6]]);
  await until(() => own(bId).some(s => s.complete), "B stroke missing");
  await a.page.keyboard.press("e");
  await stroke(a.page, [[0.4,0.6],[0.45,0.6]]);
  await delay(250);
  assert.equal(own(bId).length, 1, "Cannot erase peer artwork");
  await stroke(a.page, [[0.4,0.25],[0.45,0.25]]);
  await until(() => own(aId).length === 0, "Own stroke was not erased");
  await b.page.reload();
  await b.page.waitForFunction(() => document.querySelector("#connection").dataset.state === "connected");
  await until(() => !observer.state.players.some(p => p.id === bId) && own(bId).length === 0, "Refresh did not remove old identity/artwork");
  await a.page.keyboard.press("p");
  await stroke(a.page, Array.from({ length: 65 }, (_, i) => [0.5 + Math.cos(i/64*Math.PI*2)*0.20, 0.43 + Math.sin(i/64*Math.PI*2)*0.1125]));
  await stroke(b.page, Array.from({ length: 85 }, (_, i) => { const t = i/84*Math.PI*2; return [0.5 + Math.cos(t)*0.34, 0.43 + Math.sin(t)*0.04 + Math.cos(t)*0.10]; }));
  await stroke(a.page, [[0.45,0.40],[0.45,0.405]]);
  await stroke(a.page, [[0.56,0.40],[0.56,0.405]]);
  await stroke(b.page, [[0.43,0.46],[0.48,0.48],[0.53,0.48],[0.57,0.46]]);
  await delay(300);
  await a.page.screenshot({ path: "test-results/public-desktop.png" });
  const mobile = await open({ width: 390, height: 844 }, true);
  assert.equal(await mobile.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight), true);
  await mobile.page.screenshot({ path: "test-results/public-mobile.png" });
  const version = await a.page.locator("#version").textContent();
  const versionResponse = await fetch(new URL("version.txt", base));
  assert.equal(versionResponse.status, 200);
  assert.equal(version, "v" + (await versionResponse.text()).trim().replace(/^version=/, ""));
  await a.context.close();
  await until(() => !observer.state.players.some(p => p.id === aId) && own(aId).length === 0, "Closing tab did not clean up artwork");
  assert.deepEqual(errors, []);
  console.log(`PASS: public Pages ${version}, two browser clients, remote pixels, ownership, refresh, cleanup, mobile layout, assets, version agreement; observer room ${observer.state.roomId}`);
} finally { await browser.close(); observer.disconnect(); }
