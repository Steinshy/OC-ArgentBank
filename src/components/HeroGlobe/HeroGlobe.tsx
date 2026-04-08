import { useEffect, useRef } from 'react';

import './styles/HeroGlobe.css';

interface Props {
  className?: string;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

const DEG_TO_RAD = Math.PI / 180;
const ROTATION_SPEED = 0.3 * DEG_TO_RAD;
const MERIDIAN_COUNT = 8;
const PARALLEL_COUNT = 6;
const ARC_RESOLUTION = 40;
const NODE_BASE_RADIUS = 4;
const NODE_PULSE_AMP = 1.5;
const NODE_PULSE_SPEED = 0.002;

// Fibonacci sphere: evenly distributed points across the surface
const NODE_COUNT = 120;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const CONNECTION_THRESHOLD = 0.38; // connect nodes within this distance (normalized to diameter)

interface NodePoint {
  x: number;
  y: number;
  z: number;
}

function generateNodes(): NodePoint[] {
  const nodes: NodePoint[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (2 * i) / (NODE_COUNT - 1);
    const r = Math.sqrt(1 - y * y);
    const theta = GOLDEN_ANGLE * i;
    nodes.push({ x: r * Math.cos(theta), y, z: r * Math.sin(theta) });
  }
  return nodes;
}

function generateEdges(nodes: NodePoint[]): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i]!.x - nodes[j]!.x;
      const dy = nodes[i]!.y - nodes[j]!.y;
      const dz = nodes[i]!.z - nodes[j]!.z;
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < CONNECTION_THRESHOLD) {
        edges.push([i, j]);
      }
    }
  }
  return edges;
}

const NODES = generateNodes();
const EDGES = generateEdges(NODES);

function latLonToXYZ(lat: number, lon: number, r: number): Point3D {
  const phi = (90 - lat) * DEG_TO_RAD;
  const theta = (lon + 180) * DEG_TO_RAD;
  return { x: r * Math.sin(phi) * Math.cos(theta), y: r * Math.cos(phi), z: r * Math.sin(phi) * Math.sin(theta) };
}

function rotateY(p: Point3D, a: number): Point3D {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

function tiltX(p: Point3D, a: number): Point3D {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

export const HeroGlobe = ({ className }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let angle = 0;
    const axisTilt = 15 * DEG_TO_RAD;

    function resize() {
      const rect = container!.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      const dpr = devicePixelRatio || 1;
      canvas!.width = size * dpr;
      canvas!.height = size * dpr;
      canvas!.style.width = `${size}px`;
      canvas!.style.height = `${size}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    function generateArc(lat: number, lonStart: number, lonEnd: number, r: number, steps: number): Point3D[] {
      const pts: Point3D[] = [];
      for (let i = 0; i <= steps; i++) {
        const lon = lonStart + ((lonEnd - lonStart) * i) / steps;
        pts.push(latLonToXYZ(lat, lon, r));
      }
      return pts;
    }

    function generateMeridian(lon: number, r: number, steps: number): Point3D[] {
      const pts: Point3D[] = [];
      for (let i = 0; i <= steps; i++) {
        const lat = 90 - (180 * i) / steps;
        pts.push(latLonToXYZ(lat, lon, r));
      }
      return pts;
    }

    function drawLine(points: Point3D[], a: number, t: number, cx: number, cy: number, r: number) {
      ctx!.beginPath();
      let started = false;

      for (const p of points) {
        const r1 = rotateY(p, a);
        const r2 = tiltX(r1, t);
        const depth = (r2.z + r) / (2 * r);

        if (depth < 0.15) {
          started = false;
          continue;
        }

        const sx = cx + r2.x;
        const sy = cy - r2.y;

        if (!started) {
          ctx!.moveTo(sx, sy);
          started = true;
        } else {
          ctx!.lineTo(sx, sy);
        }
      }

      const alpha = 0.18;
      ctx!.strokeStyle = `rgba(0, 188, 119, ${alpha})`;
      ctx!.lineWidth = 0.7;
      ctx!.stroke();
    }

    function render(time: number) {
      const w = canvas!.width / (devicePixelRatio || 1);
      const h = canvas!.height / (devicePixelRatio || 1);
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(cx, cy) * 0.82;

      ctx!.clearRect(0, 0, w, h);

      // Sphere background shading
      const grad = ctx!.createRadialGradient(cx - radius * 0.25, cy - radius * 0.2, radius * 0.1, cx, cy, radius);
      grad.addColorStop(0, 'rgba(0, 188, 119, 0.08)');
      grad.addColorStop(0.5, 'rgba(0, 188, 119, 0.03)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx!.fillStyle = grad;
      ctx!.fill();

      // Rim
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx!.strokeStyle = 'rgba(0, 188, 119, 0.25)';
      ctx!.lineWidth = 1;
      ctx!.stroke();

      // Meridians
      for (let i = 0; i < MERIDIAN_COUNT; i++) {
        const lon = (360 / MERIDIAN_COUNT) * i;
        const pts = generateMeridian(lon, radius, ARC_RESOLUTION);
        drawLine(pts, angle, axisTilt, cx, cy, radius);
      }

      // Parallels
      for (let i = 1; i < PARALLEL_COUNT; i++) {
        const lat = -60 + (120 / PARALLEL_COUNT) * i;
        const pts = generateArc(lat, -180, 180, radius, ARC_RESOLUTION);
        drawLine(pts, angle, axisTilt, cx, cy, radius);
      }

      // Project all nodes once
      const projected = NODES.map((n) => {
        const scaled = { x: n.x * radius, y: n.y * radius, z: n.z * radius };
        const r1 = rotateY(scaled, angle);
        const r2 = tiltX(r1, axisTilt);
        const depth = (r2.z + radius) / (2 * radius);
        return { sx: cx + r2.x, sy: cy - r2.y, depth };
      });

      // Connection edges
      ctx!.lineWidth = 0.6;
      for (const [ai, bi] of EDGES) {
        const a = projected[ai]!;
        const b = projected[bi]!;
        const minDepth = Math.min(a.depth, b.depth);
        if (minDepth < 0.25) continue;
        const alpha = minDepth * 0.45;
        ctx!.beginPath();
        ctx!.moveTo(a.sx, a.sy);
        ctx!.lineTo(b.sx, b.sy);
        ctx!.strokeStyle = `rgba(0, 188, 119, ${alpha})`;
        ctx!.stroke();
      }

      // Nodes
      const pulse = NODE_BASE_RADIUS * 0.5 + Math.sin(time * NODE_PULSE_SPEED) * NODE_PULSE_AMP * 0.3;
      for (const p of projected) {
        if (p.depth < 0.25) continue;
        const nodeAlpha = 0.3 + p.depth * 0.7;
        const r = pulse * p.depth;

        ctx!.beginPath();
        ctx!.arc(p.sx, p.sy, r * 2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 188, 119, ${nodeAlpha * 0.1})`;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 188, 119, ${nodeAlpha})`;
        ctx!.fill();
      }

      // Atmosphere glow (outer ring)
      const atmosGrad = ctx!.createRadialGradient(cx, cy, radius * 0.95, cx, cy, radius * 1.15);
      atmosGrad.addColorStop(0, 'rgba(0, 188, 119, 0.06)');
      atmosGrad.addColorStop(1, 'rgba(0, 188, 119, 0)');
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
      ctx!.fillStyle = atmosGrad;
      ctx!.fill();

      if (!reducedMotion) {
        angle += ROTATION_SPEED;
      }

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  const rootClass = ['hero-globe', className].filter(Boolean).join(' ');

  return (
    <div ref={containerRef} className={rootClass}>
      <canvas ref={canvasRef} className="hero-globe__canvas" aria-hidden="true" />
    </div>
  );
};
