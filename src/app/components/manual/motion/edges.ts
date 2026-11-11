/** Seeded torn / deckled paper edges (ported verbatim from v3). */

export function rng(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

type EdgePt = [number, number];

export function edgePts(seed: number, kind: string): EdgePt[] {
  const r = rng(seed);
  const pts: EdgePt[] = [];
  let x = 0;
  const p1 = r() * 6.28, p2 = r() * 6.28, p3 = r() * 6.28;
  const torn = kind !== "deckle";
  while (x < 100) {
    let y: number;
    if (torn) {
      const w = Math.sin(x * 0.07 + p1) * 0.55 + Math.sin(x * 0.23 + p2) * 0.3 + Math.sin(x * 0.9 + p3) * 0.15;
      y = 20 + w * 13 + (r() - 0.5) * 7;
      if (r() < 0.06) y += 4 + r() * 8;
    } else {
      y = 10 + Math.sin(x * 0.5 + p1) * 2.5 + (r() - 0.5) * 6 + (r() < 0.12 ? r() * 5 : 0);
    }
    pts.push([x, Math.max(2, Math.min(38, y))]);
    x += torn ? 0.3 + r() * 0.9 : 0.25 + r() * 0.45;
  }
  pts.push([100, pts[pts.length - 1][1]]);
  return pts;
}

export function topPoly(pts: EdgePt[], dy: number, jit = 0, seed = 1): string {
  const r = rng(seed);
  return (
    "polygon(" +
    pts.map((p) => p[0].toFixed(2) + "% " + (p[1] + dy - (jit ? r() * jit : 0)).toFixed(1) + "px").join(",") +
    ",100% 100%,0 100%)"
  );
}

export function botPoly(pts: EdgePt[], dy: number, jit = 0, seed = 1): string {
  const r = rng(seed);
  return (
    "polygon(0 0,100% 0," +
    pts
      .slice()
      .reverse()
      .map((p) => p[0].toFixed(2) + "% calc(100% - " + Math.max(0, p[1] + dy - (jit ? r() * jit : 0)).toFixed(1) + "px)")
      .join(",") +
    ")"
  );
}
