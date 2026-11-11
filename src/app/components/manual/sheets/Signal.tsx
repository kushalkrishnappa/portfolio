import { Fragment } from "react";
import Sheet from "../Sheet";
import SpecTable from "../SpecTable";
import GeneralNotes from "../GeneralNotes";
import { Dot, Route, Stamp } from "../svgParts";
import { sheetById } from "@/data/manual";

const DETECTORS: [string, string][] = [
  ["HIGH / CRITICAL", "NEW SECURITY CONCERN"],
  ["AI IDENTITY", "RISK ESCALATION"],
  ["SHADOW AI", "FIRST OBSERVATION"],
];
/** The cold-start flood: 5 rows × 3 arrows that a baseline turns into one row. */
const FLOOD = Array.from({ length: 15 }, (_, i) => ({ x: 52 + (i % 3) * 40, y: 318 + Math.floor(i / 3) * 22 }));
/** Feed drawer items, oldest first (the oldest three are pruned by retention). */
const FEED = [0, 1, 2, 3, 4, 5];

/**
 * Sheet 06 · Signal, not noise — RoonCyber: the in-app AI-security alert
 * bell, drawn as a process schematic. Three detectors feed a per-tenant
 * worker; a watermark gauge and an emission-cap valve sit on the line to the
 * bell. Details: cold start, tracker vs feed, the escalation that re-surfaces.
 */
export default function Signal() {
  const meta = sheetById("s6");
  return (
    <Sheet meta={meta} z={6}>
      <aside className="notes notes-tight">
        <SpecTable {...meta.schedule!} />
        <GeneralNotes notes={meta.notes!} />
      </aside>
      <div className="drawing">
        <svg className="dwg" viewBox="0 0 900 620" role="img" aria-label="Process schematic of the alert bell. Three detectors (new high or critical concern, AI-identity risk escalation, Shadow AI first observation) feed one per-tenant worker that runs one transaction per tenant. A watermark gauge rises atomically and an emission-cap valve defers overflow instead of dropping it, on the line to the bell. Detail A: a cold-start flood becomes one baseline row. Detail B: dedup lives in a tracker, not in the retention-pruned feed. Detail C: an escalation from High to Critical re-surfaces past an earlier dismissal.">
          <text className="lbl fade" x="60" y="22">DWG 06 · PROCESS SCHEMATIC — AI-SECURITY NOTIFICATIONS · NTS</text>
          <g className="from"><path className="ink" d="M4 138 L30 138 L42 150 L30 162 L4 162 Z" pathLength={1} /><text className="lbl fade" x="4" y="187" style={{ fontSize: "8.5px" }}>FROM SHT 05</text></g>

          {/* three detectors */}
          <g className="dets">
            {DETECTORS.map(([t, s], i) => {
              const y = 60 + i * 66;
              return (
                <Fragment key={t}>
                  <rect className="ink b solid" x="58" y={y} width="192" height="48" rx="4" pathLength={1} />
                  <circle className="ink" cx="78" cy={y + 24} r="8" pathLength={1} />
                  <path className="ink t" d={`M90 ${y + 16} A11 11 0 0 1 90 ${y + 32}`} pathLength={1} />
                  <text className="st-name sm fade" x="100" y={y + 22} style={{ fontSize: "9.5px" }}>{t}</text>
                  <text className="lbl fade" x="100" y={y + 37} style={{ fontSize: "7.5px" }}>{s}</text>
                </Fragment>
              );
            })}
            <text className="lbl fade" x="58" y="268" style={{ fontSize: "8.5px" }}>3 DETECTORS · PER TENANT</text>
          </g>
          <g className="pipes">
            <path className="ink" d="M250 84 C276 84 276 150 300 150" pathLength={1} />
            <path className="ink" d="M250 150 L300 150" pathLength={1} />
            <path className="ink" d="M250 216 C276 216 276 150 300 150" pathLength={1} />
          </g>

          {/* the worker: one transaction per tenant, a row lock across replicas */}
          <g className="worker">
            <rect className="ink b solid" x="300" y="114" width="170" height="72" rx="4" pathLength={1} />
            <text className="st-name fade" x="385" y="144" textAnchor="middle">TENANT WORKER</text>
            <text className="lbl fade" x="385" y="164" textAnchor="middle" style={{ fontSize: "8.5px" }}>1 TXN / TENANT / TICK</text>
            <rect className="ink t" x="446" y="96" width="16" height="13" rx="2" pathLength={1} />
            <path className="ink t" d="M449 96 L449 91 A5 5 0 0 1 459 91 L459 96" pathLength={1} />
            <text className="lbl fade" x="385" y="206" textAnchor="middle" style={{ fontSize: "8px" }}>ROW LOCK · SERIALIZES REPLICAS</text>
          </g>

          {/* main line: worker → cap valve → bell, with the watermark gauge tapped on */}
          <g className="main">
            <path className="ink b" d="M470 150 L540 150" pathLength={1} />
            <path className="ink b" d="M580 150 L772 150" pathLength={1} />
            <path className="ink t" d="M506 150 L506 128" pathLength={1} />
            <path className="ink" d="M540 136 L580 164 L580 136 L540 164 Z" pathLength={1} />
            <path className="ink" d="M560 150 L560 120 M548 116 L572 116" pathLength={1} />
            <text className="lbl k fade" x="560" y="186" textAnchor="middle" style={{ fontSize: "8.5px" }}>EMISSION CAP</text>
            <text className="lbl fade" x="560" y="200" textAnchor="middle" style={{ fontSize: "8px" }}>DEFER, NEVER DROP</text>
          </g>
          <g className="gauge6">
            <rect className="ink" x="496" y="44" width="20" height="84" rx="10" pathLength={1} />
            <path className="ink t" d="M518 56 L524 56 M518 72 L524 72 M518 88 L524 88 M518 104 L524 104" pathLength={1} />
            <text className="lbl k fade" x="530" y="62" style={{ fontSize: "8.5px" }}>WATERMARK</text>
            <text className="lbl fade" x="530" y="76" style={{ fontSize: "7.5px" }}>RAISED ATOMICALLY</text>
          </g>
          <rect id="wm-lvl" x="499" y="47" width="14" height="78" rx="7" fill="url(#hatchO)" />
          <g className="queue">
            {[0, 1, 2].map((i) => (
              <rect key={i} className="q" x={482 + i * 17} y="144" width="12" height="12" rx="2" data-i={i} />
            ))}
          </g>
          <g className="defer pop"><text className="lbl k" x="606" y="128" style={{ fontSize: "8px" }}>OVERFLOW · NEXT TICK</text></g>

          {/* the bell */}
          <g className="bell">
            <path className="ink b solid" d="M778 168 Q780 128 800 124 Q820 128 822 168 L830 176 L770 176 Z" pathLength={1} />
            <circle className="ink" cx="800" cy="182" r="5" pathLength={1} />
            <circle className="ink" cx="800" cy="119" r="4" pathLength={1} />
            <text className="lbl k fade" x="800" y="206" textAnchor="middle" style={{ fontSize: "8.5px" }}>ALERT BELL</text>
          </g>
          <g className="badge pop"><circle className="hot" cx="820" cy="128" r="10" /><text className="badge-n" x="820" y="132" textAnchor="middle">1</text></g>
          <g className="rings"><circle className="ring-o" cx="800" cy="150" r="24" /><circle className="ring-o" cx="800" cy="150" r="24" /><circle className="ring-o" cx="800" cy="150" r="24" /></g>

          {/* DETAIL A · cold start */}
          <g className="detA">
            <text className="lbl k fade" x="40" y="296">DETAIL A · COLD START</text>
            <rect className="fade" x="176" y="306" width="12" height="118" fill="url(#hatch)" />
            <rect className="ink b" x="176" y="306" width="12" height="118" pathLength={1} />
            <text className="lbl fade" x="182" y="440" textAnchor="middle" style={{ fontSize: "8px" }}>BASELINE</text>
            <path className="ink" d="M188 365 L214 365" pathLength={1} />
            <rect className="ink b solid" x="216" y="342" width="76" height="46" rx="3" pathLength={1} />
            <text className="st-name sm fade" x="254" y="363" textAnchor="middle">1 ROW</text>
            <text className="lbl fade" x="254" y="378" textAnchor="middle" style={{ fontSize: "7.5px" }}>BACKLOG</text>
          </g>
          <g className="flood">
            {FLOOD.map((f, i) => (
              <path key={i} className="fl" d={`M${f.x} ${f.y} L${f.x + 26} ${f.y} M${f.x + 20} ${f.y - 4} L${f.x + 26} ${f.y} L${f.x + 20} ${f.y + 4}`} />
            ))}
          </g>

          {/* DETAIL B · tracker vs feed */}
          <g className="detB">
            <text className="lbl k fade" x="330" y="296">DETAIL B · TRACKER ≠ FEED</text>
            <rect className="ink b solid" x="340" y="306" width="104" height="118" rx="3" pathLength={1} />
            <path className="ink t" d="M340 345 L444 345 M340 384 L444 384 M382 324 L402 324 M382 363 L402 363 M382 402 L402 402" pathLength={1} />
            <rect className="ink t" x="424" y="312" width="12" height="10" rx="2" pathLength={1} />
            <text className="lbl k fade" x="392" y="440" textAnchor="middle" style={{ fontSize: "8.5px" }}>TRACKER</text>
            <text className="lbl fade" x="392" y="454" textAnchor="middle" style={{ fontSize: "7.5px" }}>DEDUP · ESCALATION</text>
            <rect className="ink b solid" x="466" y="306" width="104" height="118" rx="3" pathLength={1} />
            <text className="lbl k fade" x="518" y="440" textAnchor="middle" style={{ fontSize: "8.5px" }}>FEED</text>
            <text className="lbl fade" x="518" y="454" textAnchor="middle" style={{ fontSize: "7.5px" }}>RETENTION-PRUNED</text>
          </g>
          <g className="feed">
            {FEED.map((i) => (
              <rect key={i} className={i < 3 ? "fi pr" : "fi"} x="478" y={316 + i * 17} width="80" height="11" rx="2" />
            ))}
          </g>

          {/* DETAIL C · the escalation a dismissal must not hide */}
          <g className="detC">
            <text className="lbl k fade" x="610" y="296">DETAIL C · ESCALATION</text>
            <rect className="ink solid" x="616" y="308" width="140" height="44" rx="3" pathLength={1} />
            <text className="lbl k fade" x="628" y="326" style={{ fontSize: "8.5px" }}>HIGH · v1</text>
            <text className="lbl fade" x="628" y="342" style={{ fontSize: "7.5px" }}>DISMISSED · SEEN v1</text>
          </g>
          <path className="sig-ln strike nf" d="M622 330 L750 330" />
          <g className="crit pop">
            <rect className="crit-box" x="652" y="366" width="150" height="46" rx="3" />
            <text className="lbl k" x="664" y="385" style={{ fontSize: "8.5px" }}>CRITICAL · v2</text>
            <text className="lbl" x="664" y="401" style={{ fontSize: "7.5px" }}>v2 ≠ SEEN v1 → RE-SURFACE</text>
          </g>

          <g className="c-flood"><text className="hand pop" x="40" y="484">a flood becomes one row</text></g>
          <g className="c-dedup"><path className="ink t" d="M392 458 L392 470" pathLength={1} /><text className="hand pop" x="330" y="494">dedup lives here,</text><text className="hand pop" x="330" y="522">not in the feed</text></g>
          <g className="c-merge"><text className="hand o pop" x="636" y="446">caught before merge</text></g>
          <g className="m-a"><text className="lbl-b pop" x="40" y="566">~14.4M / DAY</text><text className="lbl pop" x="40" y="586" style={{ fontSize: "8.5px" }}>NO-OP WRITES AVOIDED @ 10K CONCERNS</text></g>
          <g className="m-b"><text className="lbl-b pop" x="346" y="566">p95 1.25 ms</text><text className="lbl pop" x="346" y="586" style={{ fontSize: "8.5px" }}>SETTINGS API · FEED NO REGRESSION</text></g>

          <g className="to"><path className="ink" d="M848 240 L874 240 L886 252 L874 264 L848 264 Z" pathLength={1} /><text className="lbl fade" x="886" y="232" textAnchor="end">TO SHT 07</text></g>
          <Stamp className="st-once" transform="translate(760 74) rotate(5)" w={176} h={54} inset={7} title="DELIVERED ONCE" titleY={2} titleStyle={{ fontSize: "21px" }} sub="NEVER A FLOOD" subY={15} />
          <Stamp className="st-demo" transform="translate(760 540) rotate(-6)" w={214} h={66} inset={7} title="MOST-REQUESTED" titleY={4} titleStyle={{ fontSize: "24px" }} sub="FEATURE IN PLATFORM DEMOS" subY={19} hot />
          <Route id="r6a" d="M42 150 L300 150" />
          <Route id="r6b" d="M300 150 L470 150 L772 150" />
          <Route id="r6c" d="M800 176 C800 226 820 252 848 252" />
          <Dot at="42 150" />
        </svg>
      </div>
    </Sheet>
  );
}
