import { Fragment } from "react";
import Sheet from "../Sheet";
import SpecTable from "../SpecTable";
import GeneralNotes from "../GeneralNotes";
import { Dot, Route, Stamp } from "../svgParts";
import { sheetById } from "@/data/manual";

/** The eight stations, in order: the top run left → right, the return run right → left. */
const STATIONS: { name: string; x: number; y: number }[] = [
  { name: "RESEARCH", x: 140, y: 110 },
  { name: "TECH SPEC", x: 320, y: 110 },
  { name: "TICKETING", x: 500, y: 110 },
  { name: "IMPL PLAN", x: 680, y: 110 },
  { name: "ORCHESTRATE", x: 680, y: 300 },
  { name: "IMPLEMENT", x: 500, y: 300 },
  { name: "SCREENSHOTS", x: 320, y: 300 },
  { name: "COMPLIANCE", x: 140, y: 300 },
];
/** Human approval gates: between every pair of stations, and before the dock. */
const GATES: { x: number; y: number; v?: boolean }[] = [
  { x: 230, y: 110 },
  { x: 410, y: 110 },
  { x: 590, y: 110 },
  { x: 875, y: 205, v: true },
  { x: 590, y: 300 },
  { x: 410, y: 300 },
  { x: 230, y: 300 },
  { x: 60, y: 344, v: true },
];
const lampX = (g: { x: number; v?: boolean }) => (g.v ? (g.x > 800 ? g.x - 26 : g.x + 24) : g.x);
/** Centre line of the conveyor: top run, U-turn, return run, chute to the dock. */
const TRACK = "M42 110 L780 110 A95 95 0 0 1 780 300 L92 300 Q60 300 60 332 L60 380";

/**
 * Sheet 08 · Assembly line — RoonCyber: the 8-stage agentic harness, as a
 * plan view of a conveyor. Claude does the work at each station; a human
 * gate approves every hand-off. The plant floor inside the U holds the
 * validators, the descope rule and the autonomy dial.
 */
export default function Assembly() {
  const meta = sheetById("s8");
  return (
    <Sheet meta={meta} z={8}>
      <aside className="notes notes-tight">
        <SpecTable {...meta.schedule!} />
        <GeneralNotes notes={meta.notes!} />
      </aside>
      <div className="drawing">
        <svg className="dwg" viewBox="0 0 900 620" role="img" aria-label="Plan view of an assembly line with eight stations: research, tech spec, ticketing, implementation plan, orchestrate, implement, screenshots and compliance, with a human approval gate between every pair. Inside the loop: a drift validator gauge, the rule that every dropped requirement needs a recorded decision, and an autonomy dial turned from an autonomous loop to an interactive arbiter. A reject bin under implement shows two days of rework, and a ground-truth probe is fitted to research. The output dock counts 25+ features from 9+ of 12 engineers.">
          <text className="lbl fade" x="60" y="22">DWG 08 · PLAN — ASSEMBLY LINE · PRD → MERGED PR · NTS</text>
          <g className="from"><path className="ink" d="M4 98 L30 98 L42 110 L30 122 L4 122 Z" pathLength={1} /><text className="lbl fade" x="4" y="90">FROM SHT 07</text></g>

          {/* the conveyor: two rails around the loop */}
          <g className="rails">
            <path className="ink b" d="M42 98 L780 98 A107 107 0 0 1 780 312 L96 312 Q72 312 72 336 L72 380" pathLength={1} />
            <path className="ink" d="M42 122 L780 122 A83 83 0 0 1 780 288 L92 288 Q48 288 48 332 L48 380" pathLength={1} />
            <path className="ctr fade" d={TRACK} />
          </g>

          {/* stations */}
          <g className="stations">
            {STATIONS.map((s, i) => (
              <Fragment key={s.name}>
                <rect className="ink b solid" x={s.x - 50} y={s.y - 26} width="100" height="52" rx="4" pathLength={1} />
                <text className="lbl fade" x={s.x - 42} y={s.y - 12} style={{ fontSize: "7.5px" }}>{`0${i + 1}`}</text>
                <text className="st-name sm fade" x={s.x} y={s.y + 6} textAnchor="middle" style={{ fontSize: "9.5px" }}>{s.name}</text>
              </Fragment>
            ))}
            <text className="lbl fade" x="140" y="160" textAnchor="middle" style={{ fontSize: "7.5px" }}>CLAUDE AT EVERY STATION</text>
          </g>

          {/* human gates: a boom across the rails, a lamp that lights on approval */}
          <g className="gates">
            {GATES.map((g, i) => (
              <Fragment key={i}>
                <path className="ink" d={g.v ? `M${g.x - 18} ${g.y} L${g.x + 18} ${g.y}` : `M${g.x} ${g.y - 18} L${g.x} ${g.y + 18}`} pathLength={1} />
                <circle className="ink t" cx={lampX(g)} cy={g.v ? g.y : g.y - 25} r="5" pathLength={1} />
              </Fragment>
            ))}
            <text className="lbl k fade" x="410" y="70" textAnchor="middle" style={{ fontSize: "7.5px" }}>HUMAN GATE</text>
          </g>
          <g className="glamps">
            {GATES.map((g, i) => (
              <circle key={i} className="gl hot" cx={lampX(g)} cy={g.v ? g.y : g.y - 25} r="3.2" />
            ))}
          </g>

          {/* the plant floor inside the loop */}
          <g className="floor">
            <path className="ink" d="M186 222 A40 40 0 0 1 266 222" pathLength={1} />
            <path className="sig-ln" d="M252 192 A40 40 0 0 1 266 222" />
            <path className="ink t" d="M226 182 L226 190 M198 194 L203 199 M254 194 L249 199" pathLength={1} />
            <text className="lbl k fade" x="226" y="242" textAnchor="middle" style={{ fontSize: "7.5px" }}>DRIFT · PLAN vs SPEC</text>
            <path className="ink t" d="M300 186 L432 186 L446 204 L432 222 L300 222 Z" pathLength={1} />
            <circle className="ink t" cx="312" cy="204" r="3" pathLength={1} />
            <text className="lbl k fade" x="322" y="201" style={{ fontSize: "7px" }}>DROPPED REQUIREMENT</text>
            <text className="lbl fade" x="322" y="214" style={{ fontSize: "7px" }}>→ A RECORDED DECISION</text>
            <circle className="ink" cx="500" cy="204" r="22" pathLength={1} />
            <path className="ink t" d="M482 214 L486 211 M518 214 L514 211 M500 184 L500 188" pathLength={1} />
            <text className="lbl fade" x="532" y="198" style={{ fontSize: "7px" }}>AUTONOMOUS LOOP</text>
            <text className="lbl k fade" x="532" y="214" style={{ fontSize: "7px" }}>INTERACTIVE ARBITER</text>
          </g>
          <path className="sig-ln strike8 nf" d="M530 195 L650 195" />
          <g className="needle nf"><path className="sig-ln" d="M226 222 L204 196" /><circle className="hot" cx="226" cy="222" r="3" /></g>
          <g className="dial nf"><path className="sig-ln" d="M500 204 L516 194" /></g>

          {/* the incident: a part built for a machine that was switched off */}
          <g className="reject">
            <path className="ink" d="M446 380 L452 430 L548 430 L554 380" pathLength={1} />
            <path className="ink t" d="M500 326 L500 372" pathLength={1} />
            <text className="lbl k fade" x="500" y="448" textAnchor="middle" style={{ fontSize: "8px" }}>REJECT · ~2 DAYS REWORK</text>
          </g>
          <g className="part"><rect className="partbox" x="488" y="388" width="24" height="16" rx="2" /><text className="lbl" x="500" y="420" textAnchor="middle" style={{ fontSize: "6.5px" }}>DATASTORE OFF</text></g>
          <g className="probe">
            <path className="ink" d="M140 84 L140 54 M128 54 L152 54 M134 46 L146 46" pathLength={1} />
            <text className="lbl k fade" x="160" y="50" style={{ fontSize: "7.5px" }}>GROUND-TRUTH PROBE</text>
            <text className="lbl fade" x="160" y="62" style={{ fontSize: "7px" }}>THE REAL SERVING PATH</text>
          </g>

          {/* output dock */}
          <g className="dock">
            <rect className="ink b solid" x="30" y="380" width="120" height="56" rx="3" pathLength={1} />
            <text className="st-name sm fade" x="108" y="404" textAnchor="middle" style={{ fontSize: "9px" }}>MERGED</text>
            <text className="st-name sm fade" x="108" y="420" textAnchor="middle" style={{ fontSize: "9px" }}>PR</text>
          </g>
          <g className="m8"><text className="lbl-b pop" x="168" y="406">25+ FEATURES</text><text className="lbl pop" x="168" y="426" style={{ fontSize: "8.5px" }}>9+ OF 12 ENGINEERS · MAY–AUG</text></g>

          <g className="c-cost"><text className="hand pop" x="168" y="486">minutes at a gate,</text><text className="hand pop" x="168" y="516">days in code review.</text></g>
          <g className="c-auto"><path className="ink t" d="M552 326 L604 380" pathLength={1} /><text className="hand pop" x="612" y="398">autonomy stays</text><text className="hand pop" x="612" y="428">where validators</text><text className="hand pop" x="612" y="458">guard it.</text></g>

          <g className="to"><path className="ink" d="M46 552 L74 552 L74 566 L60 578 L46 566 Z" pathLength={1} /><text className="lbl fade" x="84" y="572">TO SHT 09</text></g>
          <Stamp className="st-gated" transform="translate(360 574) rotate(-5)" w={208} h={58} inset={7} title="HUMAN-GATED" titleY={3} titleStyle={{ fontSize: "25px" }} sub="EVERY STAGE · ADVISORY CHECKS" subY={17} />
          <Route id="r8a" d={TRACK} />
          <Route id="r8b" d="M60 380 L60 552" />
          <Dot at="42 110" />
        </svg>
      </div>
    </Sheet>
  );
}
