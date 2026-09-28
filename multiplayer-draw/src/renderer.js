import { createEngine, createSceneContext, createArcRotateCamera, enableOrthographicCamera, createPlane, createPbrMaterial, setPbrUnlit, createDynamicTexture, updateDynamicTexture, addToScene, registerScene, startEngine, resizeEngine, disposeEngine } from "@babylonjs/lite";
export async function createDrawingRenderer(canvas) {
  if (!navigator.gpu) throw new Error("This canvas needs WebGPU. Open it in a recent Chrome or Edge browser.");
  const engine = await createEngine(canvas, { antialias: true });
  const scene = createSceneContext(engine);
  scene.clearColor = { r: 0.97, g: 0.965, b: 0.94, a: 1 };
  scene.camera = createArcRotateCamera(-Math.PI / 2, Math.PI / 2, 24, { x: 0, y: 0, z: 0 });
  enableOrthographicCamera(scene.camera, { halfHeight: 8 });
  const sheet = document.createElement("canvas"); sheet.width = 720; sheet.height = 1280;
  const context = sheet.getContext("2d");
  const texture = createDynamicTexture(engine, sheet.width, sheet.height, { format: "rgba8unorm-srgb" });
  const material = createPbrMaterial({ baseColorFactor: [1, 1, 1, 1], doubleSided: true });
  material.baseColorTexture = texture;
  setPbrUnlit(material);
  const plane = createPlane(engine, { width: 9, height: 16 }); plane.material = material;
  addToScene(scene, plane);
  function draw(strokes, players) {
    context.fillStyle = "#f8f6ef"; context.fillRect(0, 0, 720, 1280);
    context.fillStyle = "#dedfd4";
    for (let y = 28; y < 1280; y += 28) for (let x = 28; x < 720; x += 28) { context.beginPath(); context.arc(x, y, 0.85, 0, Math.PI * 2); context.fill(); }
    context.lineWidth = 5; context.lineCap = "round"; context.lineJoin = "round";
    const palette = new Map(players.map(p => [p.id, p.color]));
    for (const stroke of strokes) {
      if (!stroke.points.length) continue;
      const color = palette.get(stroke.owner);
      if (!color) continue;
      context.strokeStyle = context.fillStyle = color;
      if (stroke.points.length === 1) {
        context.beginPath(); context.arc(stroke.points[0][0] * 720, stroke.points[0][1] * 1280, 2.5, 0, Math.PI * 2); context.fill();
      } else {
        context.beginPath();
        stroke.points.forEach(([x, y], i) => i ? context.lineTo(x * 720, y * 1280) : context.moveTo(x * 720, y * 1280));
        context.stroke();
      }
    }
    updateDynamicTexture(engine, texture, sheet);
  }
  draw([], []);
  await registerScene(scene);
  await startEngine(engine);
  const resize = new ResizeObserver(() => resizeEngine(engine)); resize.observe(canvas);
  canvas.dataset.ready = "true";
  return { draw, dispose() { resize.disconnect(); disposeEngine(engine); } };
}


