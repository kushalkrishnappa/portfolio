"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/app/components/motion/useReducedMotion";

/**
 * HeroField — the hero's living background.
 *
 * A quiet, systems-themed field: slowly drifting nodes connected by faint
 * proximity edges, with occasional accent "signals" that travel along an edge
 * from one node to the next (a traveling-signal graph). It sits BEHIND the name
 * and is deliberately low-contrast so it never fights the text.
 *
 * Craft / safety:
 *  - Canvas 2D + a single requestAnimationFrame loop.
 *  - DPR capped at 2; sizes to its parent via ResizeObserver.
 *  - Pauses when the tab is hidden (visibilitychange) and when the hero scrolls
 *    offscreen (IntersectionObserver) — no work when nothing is visible.
 *  - Lazy: heavy init is deferred to the next frame so the name paints first
 *    and the canvas never blocks LCP.
 *  - Reduced motion: no rAF loop — a single static frame is drawn once (quiet
 *    texture, zero motion). SSR-safe: the <canvas> renders empty on the server.
 *  - Cleans up the rAF loop, resize observer, intersection observer and the
 *    visibility listener on unmount.
 */

const ACCENT = { r: 77, g: 212, b: 224 }; // --accent #4DD4E0
const BONE = { r: 236, g: 236, b: 234 }; // --bone #ECECEA

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Signal {
  a: number; // source node index
  b: number; // target node index
  t: number; // progress 0..1
  speed: number;
}

export default function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let signals: Signal[] = [];
    let rafId = 0;
    let running = false;
    let visible = true;
    let onScreen = true;
    let lastTime = 0;

    // Edge proximity threshold scales with viewport so density stays even.
    let linkDist = 170;

    const seed = () => {
      // Density tuned to area, but hard-capped so the O(n^2) edge pass stays cheap.
      const target = Math.round((width * height) / 26000);
      const count = Math.max(14, Math.min(54, target));
      linkDist = Math.max(120, Math.min(210, Math.hypot(width, height) * 0.11));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.14,
        r: 0.8 + Math.random() * 1.4,
      }));
      signals = [];
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const spawnSignal = () => {
      if (signals.length > 5 || nodes.length < 2) return;
      const a = (Math.random() * nodes.length) | 0;
      // Find a nearby node to travel toward, so signals ride real edges.
      let best = -1;
      let bestD = linkDist;
      for (let i = 0; i < nodes.length; i++) {
        if (i === a) continue;
        const d = Math.hypot(nodes[i].x - nodes[a].x, nodes[i].y - nodes[a].y);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best === -1) return;
      signals.push({ a, b: best, t: 0, speed: 0.22 + Math.random() * 0.3 });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Edges — faint accent lines between nearby nodes, fading with distance.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d > linkDist) continue;
          const alpha = (1 - d / linkDist) * 0.09;
          ctx.strokeStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // Nodes — tiny bone dots, barely there.
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${BONE.r},${BONE.g},${BONE.b},0.18)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Signals — a brighter accent dot traveling along an edge, with a short glow.
      for (const s of signals) {
        const A = nodes[s.a];
        const B = nodes[s.b];
        if (!A || !B) continue;
        const x = A.x + (B.x - A.x) * s.t;
        const y = A.y + (B.y - A.y) * s.t;
        // Soft falloff at the ends so signals fade in/out rather than pop.
        const edge = Math.sin(Math.PI * s.t);
        ctx.fillStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${0.55 * edge})`;
        ctx.shadowColor = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},0.6)`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const step = (time: number) => {
      if (!running) return;
      const dt = lastTime ? Math.min((time - lastTime) / 16.67, 2.5) : 1;
      lastTime = time;

      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        // Wrap softly at the edges so the field feels continuous.
        if (n.x < -10) n.x = width + 10;
        else if (n.x > width + 10) n.x = -10;
        if (n.y < -10) n.y = height + 10;
        else if (n.y > height + 10) n.y = -10;
      }

      for (let i = signals.length - 1; i >= 0; i--) {
        signals[i].t += signals[i].speed * 0.016 * dt;
        if (signals[i].t >= 1) signals.splice(i, 1);
      }
      if (Math.random() < 0.018 * dt) spawnSignal();

      draw();
      rafId = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || !visible || !onScreen) return;
      running = true;
      lastTime = 0;
      rafId = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    // Reduced motion: draw a single static frame, no loop.
    if (reducedMotion) {
      resize();
      draw();
      const ro = new ResizeObserver(() => {
        resize();
        draw();
      });
      ro.observe(canvas);
      return () => ro.disconnect();
    }

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) start();
      else stop();
    };

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0 },
    );

    const ro = new ResizeObserver(() => resize());

    // Defer heavy init one frame so the name paints first (LCP-safe).
    const initId = requestAnimationFrame(() => {
      resize();
      ro.observe(canvas);
      io.observe(canvas);
      document.addEventListener("visibilitychange", onVisibility);
      visible = document.visibilityState === "visible";
      start();
    });

    return () => {
      cancelAnimationFrame(initId);
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: "none" }}
    />
  );
}
