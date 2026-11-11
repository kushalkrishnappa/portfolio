import Sheet from "../Sheet";
import SpecTable from "../SpecTable";
import GeneralNotes from "../GeneralNotes";
import { Dot, Route, Stamp } from "../svgParts";
import { sheetById } from "@/data/manual";
import { FloorDetectors, FloorDoors, FloorWalls } from "./geometry";

/** Doors that stay RLS-locked to the caller (every room but tenant B's): [hinge x, top row]. */
const LOCKED: [number, boolean][] = [
  [145, true], [665, true], [145, false], [405, false], [665, false],
];
/** The request path, as built: [label, sub-label, x0, x1]. */
const PATH: [string, string, number, number][] = [
  ["FORMAT", "BEFORE ANY DB", 40, 124],
  ["SHA-256", "SHOWN ONCE", 140, 224],
  ["CACHE", "TTL ≤ TOKEN LIFE", 240, 340],
  ["PRIMARY", "NOT A REPLICA", 356, 440],
  ["TENANT ← TOKEN", "NEVER THE URL", 456, 590],
];

function Lock({ x, y }: { x: number; y: number }) {
  return (
    <g className="lock" transform={`translate(${x} ${y})`}>
      <rect className="ink" x="-6" y="-3" width="12" height="9" rx="1.5" pathLength={1} />
      <path className="ink" d="M-3.5 -3 L-3.5 -6 A3.5 3.5 0 0 1 3.5 -6 L3.5 -3" pathLength={1} />
    </g>
  );
}

/**
 * Sheet 05 · Tenant isolation — RoonCyber: the tenant floor plan with a
 * vellum overlay of the keyed entry he designed and whose request path he
 * built (M2M API keys + Postgres RLS): the token picks the door, the other
 * doors stay RLS-locked, and a forged URL gets the same opaque 401.
 */
export default function Tenant() {
  const meta = sheetById("s5");
  return (
    <Sheet meta={meta} z={5}>
      <aside className="notes notes-tight">
        <SpecTable {...meta.schedule!} />
        <GeneralNotes notes={meta.notes!} />
      </aside>
      <div className="drawing">
        <svg className="dwg" viewBox="0 0 900 620" role="img" aria-label="Floor plan of six tenant rooms off a shared ingress corridor. A vellum overlay draws the keyed entry: a request runs format check, SHA-256 lookup, a cache whose TTL never outlives the token, and a primary read; the tenant comes from the token, so the request enters only its own room. Every other door is RLS-locked for writes, and a forged URL gets the same opaque 401.">
          <text className="lbl fade" x="60" y="32">DWG 05 · PLAN — TENANT FLOOR · LEVEL 01</text>
          <FloorWalls />
          <FloorDoors />
          <FloorDetectors />
          <path className="ink bus" d="M44 270 L846 270" pathLength={1} />
          <text className="lbl fade" x="704" y="290">SHARED INGRESS</text>
          <g className="from"><path className="ink" d="M4 258 L30 258 L42 270 L30 282 L4 282 Z" pathLength={1} /><text className="lbl fade" x="4" y="250">FROM SHT 04</text></g>
          <g className="to"><path className="ink" d="M848 258 L874 258 L886 270 L874 282 L848 282 Z" pathLength={1} /><text className="lbl fade" x="886" y="250" textAnchor="end">TO SHT 06</text></g>
          <g className="regs"><g transform="translate(24 470)"><circle className="ink t" r="9" pathLength={1} /><path className="ink t" d="M-15 0 L15 0 M0 -15 L0 15" pathLength={1} /></g><g transform="translate(876 470)"><circle className="ink t" r="9" pathLength={1} /><path className="ink t" d="M-15 0 L15 0 M0 -15 L0 15" pathLength={1} /></g></g>
          <g className="rings"><circle className="ring-o" cx="450" cy="145" r="20" /><circle className="ring-o" cx="450" cy="145" r="20" /><circle className="ring-o" cx="450" cy="145" r="20" /></g>
          <Route id="r5a" d="M18 270 L430 270 L430 200 Q430 160 450 145" />
          <Route id="r5b" d="M450 145 Q430 160 430 200 L430 270 L866 270" />
          <Dot at="18 270" />
        </svg>
        <div className="vellum" aria-hidden="true">
          <span className="tape a" />
          <span className="tape b" />
          <span className="vtag">Vellum · Overlay A</span>
          <svg viewBox="0 0 900 620">
            <g className="regs"><g transform="translate(24 470)"><circle className="ink t" r="9" pathLength={1} /><path className="ink t" d="M-15 0 L15 0 M0 -15 L0 15" pathLength={1} /></g><g transform="translate(876 470)"><circle className="ink t" r="9" pathLength={1} /><path className="ink t" d="M-15 0 L15 0 M0 -15 L0 15" pathLength={1} /></g></g>
            <text className="lbl k fade" x="586" y="32">OVERLAY A · KEYED ENTRY</text>

            {/* the URL can't pick the tenant; the token does */}
            <g className="url">
              <text className="code fade" x="470" y="261" style={{ fontSize: "11px" }}>{"GET /{tenant}/…"}</text>
              <text className="code fade k" x="470" y="294" style={{ fontSize: "11px" }}>{"GET /…  tenant ← token"}</text>
            </g>
            <path className="sig-ln ustrike nf" d="M466 257 L578 257" />
            <g className="c-door"><path className="ink" d="M664 120 L470 196" pathLength={1} /><text className="hand pop" x="670" y="110" style={{ fontSize: "26px" }}>the token</text><text className="hand pop" x="670" y="134" style={{ fontSize: "26px" }}>picks the door.</text></g>

            {/* RLS: every other door stays locked for writes */}
            <g className="locks">
              {LOCKED.map(([x, top]) => (
                <Lock key={`${x}-${top}`} x={x + 25} y={top ? 233 : 307} />
              ))}
            </g>
            <g className="ghost"><circle className="gh" r="8" /></g>
            <g className="skip pop"><path className="sig-ln" d="M423 323 L437 337 M437 323 L423 337" /><text className="lbl k" x="446" y="336">401 · FORGED URL</text></g>

            {/* DETAIL A · the request path */}
            <g className="kpath">
              <text className="lbl k fade" x="40" y="478">DETAIL A · THE REQUEST PATH</text>
              <Lock x={566} y={474} />
              <text className="lbl fade" x="578" y="478" style={{ fontSize: "7.5px" }}>RLS DOOR · WRITES TENANT-LOCKED</text>
              {PATH.map(([t, sub, a, b]) => (
                <g key={t}>
                  <rect className="ink b solid" x={a} y="500" width={b - a} height="28" rx="3" pathLength={1} />
                  <text className="lbl k fade" x={(a + b) / 2} y="518" textAnchor="middle" style={{ fontSize: "8.5px" }}>{t}</text>
                  <text className="lbl fade" x={(a + b) / 2} y="494" textAnchor="middle" style={{ fontSize: "7px" }}>{sub}</text>
                </g>
              ))}
              <path className="ink t" d="M124 514 L140 514 M224 514 L240 514 M340 514 L356 514 M440 514 L456 514" pathLength={1} />
              <path className="ink" d="M82 528 L82 560 M182 528 L182 560 M290 528 L290 560 M82 560 L470 560" pathLength={1} />
              <path className="ink t" d="M420 528 L420 596 L470 596" pathLength={1} />
              <rect className="ink b solid" x="470" y="548" width="126" height="24" rx="3" pathLength={1} />
              <text className="lbl k fade" x="533" y="564" textAnchor="middle" style={{ fontSize: "8px" }}>401 · ONE ANSWER</text>
              <rect className="ink solid" x="470" y="584" width="126" height="24" rx="3" pathLength={1} />
              <text className="lbl fade" x="533" y="600" textAnchor="middle" style={{ fontSize: "8px" }}>500 · OUTAGE</text>
            </g>
            <g className="mcp">
              <path className="ink" d="M590 514 L738 514" pathLength={1} />
              <rect className="ink b solid" x="740" y="500" width="140" height="28" rx="3" pathLength={1} />
              <text className="lbl k fade" x="810" y="518" textAnchor="middle" style={{ fontSize: "8.5px" }}>MCP SERVER</text>
              <text className="lbl fade" x="810" y="494" textAnchor="middle" style={{ fontSize: "7px" }}>SAME KEYS · SAME PATH</text>
              <text className="hand pop" x="606" y="506">later:</text>
            </g>
            <Route id="rk" d="M24 514 L600 514" noTrail />
            <circle className="kd hot" r="5" />
            <Stamp className="st5k" transform="translate(760 580) rotate(-6)"  w={222} h={56} inset={7} title="KEYED ENTRY ✓" titleY={3} titleStyle={{ fontSize: "25px" }} sub="TENANT FROM TOKEN" subY={16} />
          </svg>
        </div>
      </div>
    </Sheet>
  );
}
