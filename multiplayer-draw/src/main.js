import "./style.css";
import version from "../../version.txt?raw";
import { MultiplayerClient } from "@rmc/multiplayer-client";
import { createDrawingRenderer } from "./renderer.js";
import { hitsStroke } from "./geometry.js";

const $ = id => document.getElementById(id);
const canvas = $("canvas"), paper = $("paper");
const endpoint = import.meta.env.VITE_SERVER_URL || "https://rmc-colyseus-multiplayer-server.vercel.app";
const session = new MultiplayerClient(endpoint);
const optimistic = new Map(), cursors = new Map();
let renderer, tool = "pencil", active, pointer, dirty = true, lastCursor = 0, stopped = false;
$("version").textContent = "v" + version.trim().replace(/^version=/, "");
function choose(next) {
  finish(); tool = next; canvas.dataset.tool = tool;
  for (const id of ["pencil", "eraser"]) { $(id).classList.toggle("selected", id === tool); $(id).setAttribute("aria-pressed", String(id === tool)); }
  $("tool-note").textContent = tool === "pencil" ? "Draw something good." : "Only your own marks.";
}
$("pencil").onclick = () => choose("pencil");
$("eraser").onclick = () => choose("eraser");
$("retry").onclick = () => renderer ? session.connect() : location.reload();
$("fullscreen").onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch {} };
window.addEventListener("keydown", event => { if (event.ctrlKey || event.metaKey || event.altKey) return; if (event.key.toLowerCase() === "p") choose("pencil"); if (event.key.toLowerCase() === "e") choose("eraser"); });
function point(event) {
  const rect = canvas.getBoundingClientRect();
  return [Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))];
}
function flush(complete = false) {
  if (!active) return;
  const count = active.points.length - active.sent;
  if (!count && !complete) return;
  for (let offset = active.sent; offset < active.points.length || (complete && offset === active.points.length);) {
    const points = active.points.slice(offset, offset + 64);
    const end = offset + points.length;
    session.send("stroke", { id: active.localId, offset, points, complete: complete && end === active.points.length });
    active.sent = end;
    if (end === active.points.length) break;
    offset = end;
  }
}
function finish() {
  if (active) { flush(true); active.complete = true; active = undefined; }
  pointer = undefined;
}
function erase(p) {
  for (const [id, stroke] of session.state.strokes) if (stroke.owner === session.state.sessionId && hitsStroke(p, stroke)) {
    session.send("erase", id); session.state.strokes.delete(id); optimistic.delete(id); dirty = true;
  }
}
function move(event) {
  if (session.state.status !== "connected") return;
  const p = point(event);
  const now = performance.now();
  if (now - lastCursor > 45) { session.send("cursor", p); lastCursor = now; }
  if (event.pointerId !== pointer) return;
  if (tool === "eraser") { erase(p); return; }
  if (active && active.points.length < 2048) {
    const prior = active.points.at(-1);
    if (Math.hypot((p[0] - prior[0]) * 720, (p[1] - prior[1]) * 1280) > 2) { active.points.push(p); dirty = true; }
  }
}
canvas.addEventListener("pointerdown", event => {
  if (event.button !== 0 || session.state.status !== "connected" || pointer !== undefined) return;
  event.preventDefault(); pointer = event.pointerId; canvas.setPointerCapture(pointer);
  const p = point(event);
  if (tool === "eraser") erase(p);
  else {
    const localId = crypto.randomUUID(), id = session.state.sessionId + ":" + localId;
    active = { localId, id, owner: session.state.sessionId, points: [p], sent: 0, complete: false };
    optimistic.set(id, active); flush(); dirty = true;
  }
});
canvas.addEventListener("pointermove", move);
canvas.addEventListener("pointerup", event => { if (event.pointerId === pointer) { move(event); finish(); } });
canvas.addEventListener("pointercancel", finish);
canvas.addEventListener("lostpointercapture", finish);
canvas.addEventListener("pointerleave", () => { if (pointer === undefined) session.send("cursor", null); });
window.addEventListener("blur", () => { finish(); session.send("cursor", null); });
const flushTimer = setInterval(() => flush(), 50);

session.subscribe((state, event) => {
  const me = state.players.find(p => p.id === state.sessionId);
  $("identity-text").textContent = me ? "#" + me.number + " " + me.name : "Finding your seat…";
  $("color-chip").style.background = me?.color || "#68818d";
  $("occupancy").textContent = state.players.length + " / " + state.capacity;
  $("connection").dataset.state = state.status;
  $("connection").textContent = state.status === "connected" ? "Live" : state.status;
  $("notice").textContent = state.error || "Your marks disappear when you leave. Erase only your own strokes.";
  if (renderer) {
    $("overlay").hidden = state.status === "connected";
    $("overlay-title").textContent = state.status === "full" ? "This canvas is full" : "Finding your people";
    $("overlay-message").textContent = state.error || "Joining the shared canvas…";
    $("retry").hidden = !["full", "reconnecting", "offline"].includes(state.status);
  }
  if (state.status !== "connected") { active = undefined; pointer = undefined; optimistic.clear(); }
  for (const [id, stroke] of optimistic) {
    const confirmed = state.strokes.get(id);
    if (confirmed?.complete && confirmed.points.length >= stroke.points.length) optimistic.delete(id);
  }
  if (event === "notice") { active = undefined; pointer = undefined; optimistic.clear(); session.send("snapshot"); }
  if (event !== "cursor") dirty = true;
});
function frame() {
  if (stopped) return;
  if (dirty && renderer) {
    const all = new Map(session.state.strokes);
    for (const [id, stroke] of optimistic) all.set(id, stroke);
    renderer.draw(all.values(), session.state.players); dirty = false;
  }
  const peers = session.state.players.filter(p => p.id !== session.state.sessionId && p.cursor);
  for (const [id, entry] of cursors) if (!peers.some(p => p.id === id)) { entry.el.remove(); cursors.delete(id); }
  for (const player of peers) {
    let entry = cursors.get(player.id);
    if (!entry) {
      const el = document.createElement("div"); el.className = "peer-cursor";
      el.innerHTML = '<svg viewBox="0 0 18 21"><path d="M1 1v16l4-4 3 7 3-1-3-7h7Z" fill="currentColor" stroke="white" stroke-width="1.5"/></svg><span></span>';
      el.querySelector("span").textContent = "#" + player.number + " " + player.name;
      el.style.setProperty("--color", player.color); $("cursors").append(el);
      entry = { el, x: player.cursor[0], y: player.cursor[1] }; cursors.set(player.id, entry);
    }
    entry.x += (player.cursor[0] - entry.x) * 0.32;
    entry.y += (player.cursor[1] - entry.y) * 0.32;
    entry.el.dataset.side = player.cursor[0] > 0.65 ? "left" : "right";
    entry.el.style.transform = "translate(" + entry.x * paper.clientWidth + "px," + entry.y * paper.clientHeight + "px)";
  }
  requestAnimationFrame(frame);
}
async function start() {
  try { renderer = await createDrawingRenderer(canvas); dirty = true; await session.connect(); }
  catch (error) { $("overlay-title").textContent = "Canvas unavailable"; $("overlay-message").textContent = error.message; $("retry").hidden = false; session.disconnect(); }
}
window.addEventListener("pagehide", () => { stopped = true; clearInterval(flushTimer); session.disconnect(); renderer?.dispose(); });
window.addEventListener("pageshow", event => { if (event.persisted) location.reload(); });
if (import.meta.env.DEV) globalThis.__drawState = () => session.state;
frame(); void start();


