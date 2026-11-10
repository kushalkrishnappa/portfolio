"use client";

import { useMemo } from "react";
import { diagrams, resolveDiagram, type NodeKind } from "./diagrams";

/**
 * SystemDiagram — a self-drawing SVG architecture topology for one case study.
 *
 * Rendering is fully static by default: edges are shown complete
 * (strokeDashoffset 0), arrowheads and nodes at full opacity, flow/pulse layers
 * hidden. That means SSR, no-JS, and reduced-motion all render the final, drawn
 * diagram with no animation and no layout shift.
 *
 * The parent scene owns the timeline. It queries these data hooks inside its
 * own `gsap.context` and, only when motion is allowed, sets the start states
 * and animates them:
 *   [data-edge]  stroke path  — strokeDashoffset 1 → 0 (draws in flow order)
 *   [data-head]  arrowhead    — opacity 0 → 1 (lands as its edge completes)
 *   [data-node]  node group   — opacity/scale in
 *   [data-flow]  accent path  — a travelling dash along a primary edge
 *   [data-pulse] key node ring — an infinite glow pulse
 *
 * `pathLength={1}` normalises every edge so a single dashArray of 1 hides it
 * regardless of its real length — no runtime measurement needed.
 */

const NODE_STROKE: Record<NodeKind, string> = {
  in: "var(--accent)",
  proc: "var(--line-2)",
  store: "var(--line-2)",
  out: "var(--accent)",
};

const LABEL_FILL: Record<NodeKind, string> = {
  in: "var(--accent)",
  proc: "var(--bone)",
  store: "var(--bone)",
  out: "var(--accent)",
};

export default function SystemDiagram({ slug }: { slug: string }) {
  const diagram = useMemo(() => {
    const spec = diagrams[slug];
    return spec ? resolveDiagram(spec) : null;
  }, [slug]);

  if (!diagram) return null;
  const { viewBox, nodes, edges } = diagram;

  return (
    <svg
      viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
      role="img"
      aria-label={diagram.caption}
      className="block h-auto w-full overflow-visible"
      style={{ maxWidth: "100%" }}
    >
      {/* Edges (drawn first so node fills cover their stubs). */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {edges.map((e) => (
          <g key={e.key}>
            <path
              data-edge
              d={e.d}
              pathLength={1}
              stroke={e.dashed ? "var(--line-2)" : "var(--line-2)"}
              strokeWidth={1.4}
              style={{
                strokeDasharray: e.dashed ? "4 4" : 1,
                strokeDashoffset: 0,
                opacity: e.dashed ? 0.7 : 1,
              }}
            />
            <path
              data-head
              d={e.head}
              stroke="var(--dim)"
              strokeWidth={1.4}
              style={{ opacity: 1 }}
            />
            {e.flow && (
              <path
                data-flow
                d={e.d}
                pathLength={1}
                stroke="var(--accent)"
                strokeWidth={2}
                style={{
                  strokeDasharray: "0.16 0.84",
                  strokeDashoffset: 0,
                  opacity: 0,
                  filter: "drop-shadow(0 0 3px var(--accent))",
                }}
              />
            )}
          </g>
        ))}
      </g>

      {/* Nodes on top. */}
      <g>
        {nodes.map((n) => {
          const hasSub = Boolean(n.sub);
          const labelY = hasSub ? n.cy - 5 : n.cy + 1;
          return (
            <g key={n.id} data-node>
              {n.pulse && (
                <rect
                  data-pulse
                  x={n.x}
                  y={n.y}
                  width={n.w}
                  height={n.h}
                  rx={9}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={1.4}
                  style={{ opacity: 0 }}
                />
              )}
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx={9}
                fill="var(--surface)"
                stroke={NODE_STROKE[n.kind]}
                strokeWidth={1.4}
                style={{
                  strokeDasharray: n.kind === "store" ? "5 4" : undefined,
                  opacity: n.kind === "in" || n.kind === "out" ? 0.85 : 1,
                }}
              />
              <text
                x={n.cx}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="mono"
                fontSize={13.5}
                fill={LABEL_FILL[n.kind]}
              >
                {n.label}
              </text>
              {hasSub && (
                <text
                  x={n.cx}
                  y={n.cy + 13}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="mono"
                  fontSize={10.5}
                  fill="var(--dim)"
                >
                  {n.sub}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
