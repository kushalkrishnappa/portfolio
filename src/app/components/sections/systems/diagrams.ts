// Per-system architecture-diagram specs + pure geometry resolver.
//
// Each diagram is a small, hand-placed topology (nodes = the system's real
// components, edges = data flow) authored in a fixed viewBox coordinate space.
// `resolveDiagram` turns a spec into render-ready geometry (edge path `d`,
// arrowhead `d`, node centers) with no DOM access, so it is SSR-safe and can be
// memoised in the diagram component. Nodes are drawn on top of edges (document
// order), so edges may start from a node's centre — the opaque node fill hides
// the stub — while arrowheads land cleanly on the target node's boundary.

export type NodeKind = "in" | "proc" | "store" | "out";

export interface DiagramNode {
  id: string;
  /** Top-left in viewBox units. */
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  kind: NodeKind;
  /** Key node that pulses once the diagram has drawn. */
  pulse?: boolean;
}

export interface DiagramEdge {
  from: string;
  to: string;
  /** Optional quadratic control point (viewBox units) for a curved edge. */
  c?: [number, number];
  /** A primary data path — gets the travelling accent pulse. */
  flow?: boolean;
  /** Read/feedback link — rendered dashed and fainter. */
  dashed?: boolean;
}

export interface DiagramSpec {
  /** Short caption shown under the drawing (reads as a figure label). */
  caption: string;
  viewBox: { w: number; h: number };
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface ResolvedNode extends DiagramNode {
  cx: number;
  cy: number;
}

export interface ResolvedEdge {
  key: string;
  /** Main stroke path. */
  d: string;
  /** Arrowhead chevron path at the target boundary. */
  head: string;
  flow: boolean;
  dashed: boolean;
}

export interface ResolvedDiagram {
  caption: string;
  viewBox: { w: number; h: number };
  nodes: ResolvedNode[];
  edges: ResolvedEdge[];
}

function centre(n: DiagramNode) {
  return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
}

// Where a ray from the box centre toward (tx,ty) crosses the box boundary.
function boxBoundary(n: DiagramNode, tx: number, ty: number) {
  const c = centre(n);
  const dx = tx - c.x;
  const dy = ty - c.y;
  if (dx === 0 && dy === 0) return c;
  const hw = n.w / 2;
  const hh = n.h / 2;
  const sx = dx !== 0 ? hw / Math.abs(dx) : Infinity;
  const sy = dy !== 0 ? hh / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);
  return { x: c.x + dx * s, y: c.y + dy * s };
}

const round = (v: number) => Math.round(v * 100) / 100;

export function resolveDiagram(spec: DiagramSpec): ResolvedDiagram {
  const byId = new Map(spec.nodes.map((n) => [n.id, n]));

  const edges: ResolvedEdge[] = spec.edges.map((e, i) => {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    if (!a || !b) {
      return { key: `${e.from}-${e.to}-${i}`, d: "", head: "", flow: false, dashed: false };
    }
    const ca = centre(a);
    const cb = centre(b);

    // Start just inside the source box (hidden under its fill); end on the
    // target boundary so the arrowhead meets the node cleanly.
    const start = e.c ? boxBoundary(a, e.c[0], e.c[1]) : boxBoundary(a, cb.x, cb.y);
    const end = e.c ? boxBoundary(b, e.c[0], e.c[1]) : boxBoundary(b, ca.x, ca.y);

    const d = e.c
      ? `M${round(ca.x)},${round(ca.y)} Q${round(e.c[0])},${round(e.c[1])} ${round(end.x)},${round(end.y)}`
      : `M${round(ca.x)},${round(ca.y)} L${round(end.x)},${round(end.y)}`;

    // Incoming tangent at the target, for orienting the arrowhead.
    const prev = e.c ? { x: e.c[0], y: e.c[1] } : start;
    const ang = Math.atan2(end.y - prev.y, end.x - prev.x);
    const len = 8.5;
    const spread = 0.42;
    const p1 = {
      x: end.x - len * Math.cos(ang - spread),
      y: end.y - len * Math.sin(ang - spread),
    };
    const p2 = {
      x: end.x - len * Math.cos(ang + spread),
      y: end.y - len * Math.sin(ang + spread),
    };
    const head = `M${round(p1.x)},${round(p1.y)} L${round(end.x)},${round(end.y)} L${round(p2.x)},${round(p2.y)}`;

    return {
      key: `${e.from}-${e.to}-${i}`,
      d,
      head,
      flow: Boolean(e.flow),
      dashed: Boolean(e.dashed),
    };
  });

  const nodes: ResolvedNode[] = spec.nodes.map((n) => {
    const c = centre(n);
    return { ...n, cx: c.x, cy: c.y };
  });

  return { caption: spec.caption, viewBox: spec.viewBox, nodes, edges };
}

// ---------------------------------------------------------------------------
// The three topologies. Distinct shapes derived from each system's stack /
// approach: a fan-out/fan-in hub, a reconciliation loop with feedback, and a
// branching detection pipeline.
// ---------------------------------------------------------------------------

const VB = { w: 580, h: 360 };

export const diagrams: Record<string, DiagramSpec> = {
  // Detectors fan in through an idempotent tracker to the API + bell UI, with a
  // per-tenant RLS store beneath. (Go · SQS · PostgreSQL RLS · multi-tenant.)
  "alert-bell": {
    caption: "Per-tenant detection → idempotent tracker → bell delivery",
    viewBox: VB,
    nodes: [
      { id: "sqs", x: 20, y: 157, w: 100, h: 46, label: "SQS", sub: "ingestion", kind: "in" },
      { id: "d1", x: 150, y: 44, w: 150, h: 44, label: "High / Critical", kind: "proc" },
      { id: "d2", x: 150, y: 157, w: 150, h: 44, label: "AI-identity risk", kind: "proc" },
      { id: "d3", x: 150, y: 270, w: 150, h: 44, label: "Shadow-AI", kind: "proc" },
      { id: "tracker", x: 330, y: 148, w: 132, h: 62, label: "Tracker", sub: "watermarks · dedup", kind: "proc", pulse: true },
      { id: "store", x: 306, y: 292, w: 172, h: 46, label: "Postgres · RLS", sub: "per-tenant isolation", kind: "store" },
      { id: "api", x: 480, y: 92, w: 92, h: 44, label: "REST API", kind: "proc" },
      { id: "bell", x: 480, y: 214, w: 92, h: 48, label: "Bell UI", kind: "out" },
    ],
    edges: [
      { from: "sqs", to: "d1" },
      { from: "sqs", to: "d2", flow: true },
      { from: "sqs", to: "d3" },
      { from: "d1", to: "tracker" },
      { from: "d2", to: "tracker", flow: true },
      { from: "d3", to: "tracker" },
      { from: "tracker", to: "store" },
      { from: "tracker", to: "api", flow: true },
      { from: "store", to: "api", c: [500, 200], dashed: true },
      { from: "api", to: "bell" },
    ],
  },

  // Event-driven loop: a Temporal reconciler, bounded by a Consul-tunable
  // semaphore, drives the fleet back to a known-good state (feedback edge).
  "auto-sim-rehab": {
    caption: "Event-driven reconciliation loop over a 9k+-VM fleet",
    viewBox: VB,
    nodes: [
      { id: "event", x: 20, y: 156, w: 126, h: 48, label: "Testbed event", sub: "failure detected", kind: "in" },
      { id: "recon", x: 182, y: 150, w: 146, h: 60, label: "Reconciler", sub: "Temporal loop", kind: "proc", pulse: true },
      { id: "sem", x: 366, y: 54, w: 150, h: 52, label: "Semaphore", sub: "Consul-tunable", kind: "proc" },
      { id: "snap", x: 366, y: 252, w: 150, h: 52, label: "Snapshot-restore", sub: "Go · Temporal", kind: "proc" },
      { id: "fleet", x: 470, y: 150, w: 96, h: 60, label: "Fleet", sub: "9k+ VMs", kind: "store" },
    ],
    edges: [
      { from: "event", to: "recon", flow: true },
      { from: "recon", to: "sem" },
      { from: "recon", to: "snap" },
      { from: "sem", to: "fleet", flow: true },
      { from: "snap", to: "fleet" },
      { from: "fleet", to: "recon", c: [400, 352], dashed: true },
    ],
  },

  // Branching non-human-identity detection pipeline inherited mid-flight and
  // driven to a fixed launch date.
  "ai-identity": {
    caption: "Non-human-identity pipeline — inherited, shipped on date",
    viewBox: VB,
    nodes: [
      { id: "ingest", x: 20, y: 154, w: 120, h: 52, label: "Ingest", sub: "identity signals", kind: "in" },
      { id: "resolve", x: 178, y: 66, w: 156, h: 50, label: "Resolve NHI", sub: "non-human identity", kind: "proc" },
      { id: "score", x: 178, y: 244, w: 156, h: 50, label: "Risk scoring", kind: "proc" },
      { id: "correlate", x: 364, y: 148, w: 150, h: 62, label: "Correlate", sub: "escalation state", kind: "proc", pulse: true },
      { id: "store", x: 356, y: 292, w: 166, h: 46, label: "Multi-tenant store", sub: "AWS", kind: "store" },
      { id: "launch", x: 476, y: 70, w: 96, h: 50, label: "Launch", sub: "on date", kind: "out" },
    ],
    edges: [
      { from: "ingest", to: "resolve", flow: true },
      { from: "ingest", to: "score" },
      { from: "resolve", to: "correlate", flow: true },
      { from: "score", to: "correlate" },
      { from: "correlate", to: "store" },
      { from: "correlate", to: "launch", flow: true },
    ],
  },
};
