export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export const DEG_TO_RAD = Math.PI / 180;
export const TWO_PI = Math.PI * 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const CONNECTION_THRESHOLD = 0.38;
const CONNECTION_THRESHOLD_SQ = CONNECTION_THRESHOLD * CONNECTION_THRESHOLD;
const NODE_COUNT = 120;
export const ARC_RESOLUTION = 40;
export const MERIDIAN_COUNT = 8;
export const PARALLEL_COUNT = 6;

export function generateNodes(): Point3D[] {
  const nodes: Point3D[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (2 * i) / (NODE_COUNT - 1);
    const r = Math.sqrt(1 - y * y);
    const theta = GOLDEN_ANGLE * i;
    nodes.push({ x: r * Math.cos(theta), y, z: r * Math.sin(theta) });
  }
  return nodes;
}

export function generateEdges(nodes: Point3D[]): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i]!.x - nodes[j]!.x;
      const dy = nodes[i]!.y - nodes[j]!.y;
      const dz = nodes[i]!.z - nodes[j]!.z;
      if (dx * dx + dy * dy + dz * dz < CONNECTION_THRESHOLD_SQ) {
        edges.push([i, j]);
      }
    }
  }
  return edges;
}

export function latLonToXYZ(lat: number, lon: number, r: number): Point3D {
  const phi = (90 - lat) * DEG_TO_RAD;
  const theta = (lon + 180) * DEG_TO_RAD;
  return { x: r * Math.sin(phi) * Math.cos(theta), y: r * Math.cos(phi), z: r * Math.sin(phi) * Math.sin(theta) };
}

export function rotateY(p: Point3D, a: number): Point3D {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

export function tiltX(p: Point3D, a: number): Point3D {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

export function generateArc(lat: number, lonStart: number, lonEnd: number, r: number, steps: number): Point3D[] {
  const pts: Point3D[] = [];
  for (let i = 0; i <= steps; i++) {
    const lon = lonStart + ((lonEnd - lonStart) * i) / steps;
    pts.push(latLonToXYZ(lat, lon, r));
  }
  return pts;
}

export function generateMeridian(lon: number, r: number, steps: number): Point3D[] {
  const pts: Point3D[] = [];
  for (let i = 0; i <= steps; i++) {
    const lat = 90 - (180 * i) / steps;
    pts.push(latLonToXYZ(lat, lon, r));
  }
  return pts;
}

export function drawLine(ctx: CanvasRenderingContext2D, points: Point3D[], angle: number, tilt: number, cx: number, cy: number, radius: number): void {
  ctx.beginPath();
  let started = false;

  for (const p of points) {
    const r1 = rotateY(p, angle);
    const r2 = tiltX(r1, tilt);
    const depth = (r2.z + radius) / (2 * radius);

    if (depth < 0.15) {
      started = false;
      continue;
    }

    const sx = cx + r2.x;
    const sy = cy - r2.y;

    if (!started) {
      ctx.moveTo(sx, sy);
      started = true;
    } else {
      ctx.lineTo(sx, sy);
    }
  }

  ctx.strokeStyle = 'rgba(0, 188, 119, 0.18)';
  ctx.lineWidth = 0.7;
  ctx.stroke();
}

interface ProjectedNode {
  sx: number;
  sy: number;
  depth: number;
}

export function projectNodes(nodes: Point3D[], angle: number, tilt: number, cx: number, cy: number, radius: number): ProjectedNode[] {
  return nodes.map((n) => {
    const scaled = { x: n.x * radius, y: n.y * radius, z: n.z * radius };
    const r1 = rotateY(scaled, angle);
    const r2 = tiltX(r1, tilt);
    const depth = (r2.z + radius) / (2 * radius);
    return { sx: cx + r2.x, sy: cy - r2.y, depth };
  });
}

export function drawGlobeBg(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number): void {
  const grad = ctx.createRadialGradient(cx - radius * 0.25, cy - radius * 0.2, radius * 0.1, cx, cy, radius);
  grad.addColorStop(0, 'rgba(0, 188, 119, 0.08)');
  grad.addColorStop(0.5, 'rgba(0, 188, 119, 0.03)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TWO_PI);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TWO_PI);
  ctx.strokeStyle = 'rgba(0, 188, 119, 0.25)';
  ctx.lineWidth = 1;
  ctx.stroke();
}

export function drawGlobeAtmosphere(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number): void {
  const atmosGrad = ctx.createRadialGradient(cx, cy, radius * 0.95, cx, cy, radius * 1.15);
  atmosGrad.addColorStop(0, 'rgba(0, 188, 119, 0.06)');
  atmosGrad.addColorStop(1, 'rgba(0, 188, 119, 0)');
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.15, 0, TWO_PI);
  ctx.fillStyle = atmosGrad;
  ctx.fill();
}
