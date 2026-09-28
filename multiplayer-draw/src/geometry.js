export function pointSegmentDistance(point, a, b) {
  const [px, py] = [point[0] * 720, point[1] * 1280];
  const [ax, ay] = [a[0] * 720, a[1] * 1280];
  const [bx, by] = [b[0] * 720, b[1] * 1280];
  const dx = bx - ax, dy = by - ay;
  const t = dx || dy ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))) : 0;
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}
export function hitsStroke(point, stroke, radius = 20) {
  return stroke.points.some((p, i) => pointSegmentDistance(point, p, stroke.points[Math.max(0, i - 1)]) <= radius);
}

