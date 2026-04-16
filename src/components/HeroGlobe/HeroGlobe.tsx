import { useEffect, useRef } from 'react';

import {
  DEG_TO_RAD,
  TWO_PI,
  ARC_RESOLUTION,
  MERIDIAN_COUNT,
  PARALLEL_COUNT,
  generateNodes,
  generateEdges,
  generateArc,
  generateMeridian,
  drawLine,
  projectNodes,
  drawGlobeBg,
  drawGlobeAtmosphere,
} from './globeUtils';
import './styles/HeroGlobe.css';

interface Props {
  className?: string;
}

const ROTATION_SPEED = 0.3 * DEG_TO_RAD;
const AXIS_TILT = 15 * DEG_TO_RAD;
const NODE_BASE_RADIUS = 4;
const NODE_PULSE_AMP = 1.5;
const NODE_PULSE_SPEED = 0.002;

const NODES = generateNodes();
const EDGES = generateEdges(NODES);

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

    function render(time: number) {
      const w = canvas!.width / (devicePixelRatio || 1);
      const h = canvas!.height / (devicePixelRatio || 1);
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(cx, cy) * 0.82;

      ctx!.clearRect(0, 0, w, h);

      drawGlobeBg(ctx!, cx, cy, radius);

      for (let i = 0; i < MERIDIAN_COUNT; i++) {
        const lon = (360 / MERIDIAN_COUNT) * i;
        const pts = generateMeridian(lon, radius, ARC_RESOLUTION);
        drawLine(ctx!, pts, angle, AXIS_TILT, cx, cy, radius);
      }

      for (let i = 1; i < PARALLEL_COUNT; i++) {
        const lat = -60 + (120 / PARALLEL_COUNT) * i;
        const pts = generateArc(lat, -180, 180, radius, ARC_RESOLUTION);
        drawLine(ctx!, pts, angle, AXIS_TILT, cx, cy, radius);
      }

      const projected = projectNodes(NODES, angle, AXIS_TILT, cx, cy, radius);

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

      const pulse = NODE_BASE_RADIUS * 0.5 + Math.sin(time * NODE_PULSE_SPEED) * NODE_PULSE_AMP * 0.3;
      for (const p of projected) {
        if (p.depth < 0.25) continue;
        const nodeAlpha = 0.3 + p.depth * 0.7;
        const r = pulse * p.depth;

        ctx!.beginPath();
        ctx!.arc(p.sx, p.sy, r * 2, 0, TWO_PI);
        ctx!.fillStyle = `rgba(0, 188, 119, ${nodeAlpha * 0.1})`;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(p.sx, p.sy, r, 0, TWO_PI);
        ctx!.fillStyle = `rgba(0, 188, 119, ${nodeAlpha})`;
        ctx!.fill();
      }

      drawGlobeAtmosphere(ctx!, cx, cy, radius);

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
