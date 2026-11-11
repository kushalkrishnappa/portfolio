/**
 * Generated drawing geometry, ported from v3's inline generators. Everything
 * here is a pure function of constants, so server and client render the same
 * markup (no hydration drift).
 */
import { Fragment } from "react";
import { Route } from "../svgParts";

const f1 = (n: number) => (Math.round(n * 10) / 10).toString();
type Pt = [number, number];

/* ---------------- sheet 02 · fleet (exploded axonometric) ---------------- */
const E = 374, F = 196, H = 12, S = 36, PITCH = 44;
const P = (x: number, y: number, e = E, f = F): Pt => [e + 0.866 * (x - y), f + 0.5 * (x + y)];
const pt = (a: Pt) => f1(a[0]) + " " + f1(a[1]);

/** Testbeds that come up broken and get reconciled, in visiting order. */
export const FLEET_BROKEN = [7, 12, 23, 26, 33, 38, 44, 51];

const fleet = (() => {
  const cells: { top: string; detail: string; side: string }[] = [];
  const tops: Record<string, string> = {};
  const centers: Record<number, Pt> = {};
  const bset = new Set(FLEET_BROKEN);
  for (let j = 0; j < 6; j++)
    for (let i = 0; i < 10; i++) {
      const k = j * 10 + i, x = i * PITCH, y = j * PITCH;
      const top = "M" + pt(P(x, y)) + " L" + pt(P(x + S, y)) + " L" + pt(P(x + S, y + S)) + " L" + pt(P(x, y + S)) + " Z";
      const detail = " M" + pt(P(x + 6, y + 12)) + " L" + pt(P(x + 30, y + 12)) + " M" + pt(P(x + 6, y + 24)) + " L" + pt(P(x + 30, y + 24));
      const R = P(x + S, y), Fr = P(x + S, y + S), Lf = P(x, y + S);
      const side =
        "M" + f1(R[0]) + " " + f1(R[1]) + " L" + f1(R[0]) + " " + f1(R[1] + H) + " L" + f1(Fr[0]) + " " + f1(Fr[1] + H) +
        " L" + f1(Lf[0]) + " " + f1(Lf[1] + H) + " L" + f1(Lf[0]) + " " + f1(Lf[1]) + " M" + f1(Fr[0]) + " " + f1(Fr[1]) +
        " L" + f1(Fr[0]) + " " + f1(Fr[1] + H);
      cells.push({ top, detail, side });
      tops[k] = top;
      centers[k] = P(x + S / 2, y + S / 2);
      if (bset.has(k)) {
        tops[k + "x"] = "M" + pt(P(x + 5, y + 5)) + " L" + pt(P(x + S - 5, y + S - 5)) + " M" + pt(P(x + S - 5, y + 5)) + " L" + pt(P(x + 5, y + S - 5));
      }
    }
  const outline = "M" + pt(P(-14, -14)) + " L" + pt(P(446, -14)) + " L" + pt(P(446, 270)) + " L" + pt(P(-14, 270)) + " Z";

  // reconciler plate, exploded above the fleet
  const e2 = 428, f2 = 20, pw = 160, pd = 110, T = 8;
  const q = (x: number, y: number) => P(x, y, e2, f2);
  const a = q(pw, 0), b = q(pw, pd), c = q(0, pd);
  const plate = [
    { cls: "ink b solid", d: "M" + pt(q(0, 0)) + " L" + pt(q(pw, 0)) + " L" + pt(q(pw, pd)) + " L" + pt(q(0, pd)) + " Z" },
    {
      cls: "ink t",
      d: "M" + f1(a[0]) + " " + f1(a[1]) + " L" + f1(a[0]) + " " + f1(a[1] + T) + " L" + f1(b[0]) + " " + f1(b[1] + T) + " L" + f1(c[0]) + " " + f1(c[1] + T) + " L" + f1(c[0]) + " " + f1(c[1]) + " M" + f1(b[0]) + " " + f1(b[1]) + " L" + f1(b[0]) + " " + f1(b[1] + T),
    },
    { cls: "ink t", d: "M" + pt(q(14, 14)) + " L" + pt(q(pw - 14, 14)) + " L" + pt(q(pw - 14, pd - 14)) + " L" + pt(q(14, pd - 14)) + " Z" },
  ];
  const asm = [a, b, c].map((p) => "M" + f1(p[0]) + " " + f1(p[1] + T + 4) + " L" + f1(p[0]) + " " + f1(p[1] + T + 92));

  const broken = FLEET_BROKEN.map((k) => {
    const cc = centers[k];
    return {
      k,
      top: tops[k],
      x: tops[k + "x"],
      tick: "M" + f1(cc[0] - 7) + " " + f1(cc[1]) + " L" + f1(cc[0] - 2) + " " + f1(cc[1] + 4) + " L" + f1(cc[0] + 8) + " " + f1(cc[1] - 5),
    };
  });

  // hop arcs: reconciler -> n1 -> n2 ... -> connector
  let prev: Pt = [450, 86];
  const hops = FLEET_BROKEN.map((k) => centers[k])
    .concat([[838, 330]])
    .map((p, idx) => {
      const mx = (prev[0] + p[0]) / 2, my = Math.min(prev[1], p[1]) - (idx === 0 ? 30 : 46);
      const d = "M" + f1(prev[0]) + " " + f1(prev[1]) + " Q" + f1(mx) + " " + f1(my) + " " + f1(p[0]) + " " + f1(p[1]);
      prev = p;
      return d;
    });
  return { cells, outline, plate, asm, broken, hops };
})();

export function FleetGrid() {
  return (
    <g id="fleet">
      <path className="ink t" d={fleet.outline} pathLength={1} />
      {fleet.cells.map((c, i) => (
        <Fragment key={i}>
          <path className="ink nt" d={c.top + c.detail} pathLength={1} />
          <path className="ink t ns" d={c.side} pathLength={1} />
        </Fragment>
      ))}
    </g>
  );
}

export function FleetAssembly() {
  return (
    <g id="asm">
      {fleet.asm.map((d, i) => (
        <path key={i} className="ctr fade" d={d} />
      ))}
    </g>
  );
}

export function FleetPlate() {
  return (
    <g id="plate">
      {fleet.plate.map((p, i) => (
        <path key={i} className={p.cls} d={p.d} pathLength={1} />
      ))}
    </g>
  );
}

export function FleetBroken() {
  return (
    <g id="bks">
      {fleet.broken.map((b) => (
        <g key={b.k} className="bk" data-k={b.k}>
          <path className="o-top" d={b.top} />
          <path className="o-x" d={b.x} />
        </g>
      ))}
    </g>
  );
}

export function FleetFixed() {
  return (
    <g id="fxs">
      {fleet.broken.map((b) => (
        <g key={b.k} className="fx" data-k={b.k}>
          <path className="ink b" d={b.top} pathLength={1} />
          <path className="ink b" d={b.tick} pathLength={1} />
        </g>
      ))}
    </g>
  );
}

export function FleetArcs() {
  return (
    <g id="arcs">
      {fleet.hops.map((d, i) => (
        <Route key={i} d={d} hop />
      ))}
    </g>
  );
}

/* ---------------- sheet 04 · tenant floor plan ---------------- */
const WALLS: [number, number, number, number][] = [
  [60, 50, 780, 14], [60, 436, 780, 14], [60, 64, 14, 176], [60, 300, 14, 136], [826, 64, 14, 176], [826, 300, 14, 136],
  [74, 226, 71, 14], [195, 226, 210, 14], [455, 226, 210, 14], [715, 226, 111, 14],
  [74, 300, 71, 14], [195, 300, 210, 14], [455, 300, 210, 14], [715, 300, 111, 14],
  [313, 64, 14, 162], [573, 64, 14, 162], [313, 314, 14, 122], [573, 314, 14, 122],
];
const DETS: Pt[] = [[193.5, 145], [450, 145], [706.5, 145], [193.5, 375], [450, 375], [706.5, 375]];
const TENANTS = "ABCDEF";

export function FloorWalls() {
  return (
    <g id="walls">
      {WALLS.map((w, i) => (
        <rect key={"f" + i} className="fade" x={w[0]} y={w[1]} width={w[2]} height={w[3]} fill="url(#hatch)" />
      ))}
      {WALLS.map((w, i) => (
        <rect key={"o" + i} className="ink" x={w[0]} y={w[1]} width={w[2]} height={w[3]} pathLength={1} />
      ))}
    </g>
  );
}

export function FloorDoors() {
  return (
    <g id="doors">
      {[145, 405, 665].map((x) => (
        <Fragment key={x}>
          <path className="ink t" d={`M${x} 226 L${x} 176 M${x + 50} 226 A50 50 0 0 0 ${x} 176`} pathLength={1} />
          <path className="ink t" d={`M${x} 314 L${x} 364 M${x + 50} 314 A50 50 0 0 1 ${x} 364`} pathLength={1} />
        </Fragment>
      ))}
    </g>
  );
}

export function FloorDetectors() {
  return (
    <g id="dets">
      {DETS.map(([x, y], i) => {
        const rx = [88, 341, 601][i % 3], ry = i < 3 ? 88 : 426;
        return (
          <Fragment key={i}>
            <path className="ink dr" d={`M${x - 27} ${y} A27 27 0 1 0 ${x + 27} ${y} A27 27 0 1 0 ${x - 27} ${y}`} pathLength={1} />
            <circle className="ink" cx={x} cy={y} r="18" pathLength={1} />
            <circle className="fade fill-ink" cx={x} cy={y} r="4" />
            <path className="ink t" d={`M${x + 24} ${y - 9} A12 12 0 0 1 ${x + 24} ${y + 9} M${x + 30} ${y - 14} A18 18 0 0 1 ${x + 30} ${y + 14}`} pathLength={1} />
            <text className="lbl fade" x={x} y={y + (i < 3 ? 40 : -28)} textAnchor="middle">
              {`DET · ${TENANTS[i]}`}
            </text>
            <text className="lbl k fade" x={rx} y={ry}>
              {`TENANT ${TENANTS[i]}`}
            </text>
          </Fragment>
        );
      })}
    </g>
  );
}

/* ---------------- sheet 03 · one image group of VMs ---------------- */
export const RS = {
  qx: (i: number) => 44 + i * 40,
  laneX: (k: number) => 750 - k * 40,
};
const VM_STATES: [string, string][] = [["idle", "IMAGE v1"], ["req", "REQUESTED"], ["per", "PERMITTED"], ["den", "DENIED"], ["done", "v2 ✓"]];

export function ImageGroup() {
  return (
    <g id="vms">
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} className="vm" data-i={i} transform={`translate(${RS.qx(i)} 300)`}>
          <rect className="ink b solid" x="0" y="0" width="30" height="80" rx="2" pathLength={1} />
          <rect className="ink t" x="4" y="5" width="22" height="9" pathLength={1} />
          <rect className="img2" x="4" y="5" width="22" height="9" />
          {VM_STATES.map(([k, label]) => (
            <text key={k} className={`vst v-${k}`} transform="translate(15 49) rotate(-90)" textAnchor="middle">
              {label}
            </text>
          ))}
          {i === 7 && (
            <text className="lbl k" x="15" y="-8" textAnchor="middle" style={{ fontSize: "8.5px" }}>
              CANARY
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

/* ---------------- sheet 06 · the issued set ---------------- */
export function IssuedSet() {
  return (
    <g id="set">
      {Array.from({ length: 5 }, (_, i) => {
        const x = 96 + i * 56, y = 40 + i * 20, w = 230, hh = 150;
        return (
          <g key={i} className="setsheet">
            <rect className="ink solid" x={x} y={y} width={w} height={hh} pathLength={1} />
            <rect className="ink t" x={x + 6} y={y + 6} width={w - 12} height={hh - 12} pathLength={1} />
            <rect className="ink t" x={x + 6} y={y + hh - 30} width="84" height="24" pathLength={1} />
            <text className="lbl k fade" x={x + 12} y={y + 20} style={{ fontSize: "9px" }}>
              {`0${i + 1}`}
            </text>
            {i === 4 && (
              <>
                <text className="lbl fade" x={x + 12} y={y + hh - 14} style={{ fontSize: "7px" }}>
                  DURABLE WORKFLOWS
                </text>
                <path
                  className="ink t"
                  d={`M${x + 60} ${y + 60} L${x + 170} ${y + 60} M${x + 60} ${y + 50} L${x + 60} ${y + 70} M${x + 115} ${y + 50} L${x + 115} ${y + 70} M${x + 170} ${y + 50} L${x + 170} ${y + 70}`}
                  pathLength={1}
                />
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}
