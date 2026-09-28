import test from "node:test";
import assert from "node:assert/strict";
import { hitsStroke, pointSegmentDistance } from "../src/geometry.js";
test("eraser hits the middle of a sparse segment and handles a single-point stroke", () => {
  assert.equal(hitsStroke([0.5, 0.5], { points: [[0.1, 0.5], [0.9, 0.5]] }), true);
  assert.equal(hitsStroke([0.5, 0.7], { points: [[0.1, 0.5], [0.9, 0.5]] }), false);
  assert.equal(hitsStroke([0.5, 0.5], { points: [[0.5, 0.5]] }), true);
  assert.equal(pointSegmentDistance([0.5, 0.5], [0.5, 0.5], [0.5, 0.5]), 0);
});

