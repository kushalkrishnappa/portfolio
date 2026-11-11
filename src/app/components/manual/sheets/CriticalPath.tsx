import { Fragment } from "react";
import Sheet from "../Sheet";
import SpecTable from "../SpecTable";
import GeneralNotes from "../GeneralNotes";
import { Dot, Route, Stamp } from "../svgParts";
import { sheetById } from "@/data/manual";

/** Day axis: Jun 30 (handoff) at x 190 → Jul 21 (board launch) at x 750. */
export const CP = { x0: 190, x1: 750, days: 21 };
export const dayX = (d: number) => CP.x0 + (d * (CP.x1 - CP.x0)) / CP.days;
const laneY = (k: number) => 104 + k * 34;

/** The workstreams on the critical path and their merged PRs (16), as [start day, end day]. */
export const LANES: { label: string; bars: [number, number][] }[] = [
  { label: "Stats + filters", bars: [[1, 2], [4.6, 5.6]] },
  { label: "Owner writes", bars: [[7.6, 9], [9.6, 10.6]] },
  { label: "Drawer · risk", bars: [[8.6, 9.6], [10.4, 11.4]] },
  { label: "Workload writer", bars: [[9, 11]] },
  { label: "Last-used · dormancy", bars: [[10, 12], [13, 14], [14.4, 15.4]] },
  { label: "Privilege · IAM", bars: [[12, 14], [14.6, 15.6]] },
  { label: "Runs-as links", bars: [[13, 17], [17.4, 18.4]] },
  { label: "Sort invariant", bars: [[19, 20], [20.1, 20.8]] },
];
const WEEKS: [number, string][] = [[0, "JUN 30"], [7, "JUL 7"], [14, "JUL 14"], [21, "JUL 21"]];
const f1 = (n: number) => (Math.round(n * 10) / 10).toString();

/**
 * Sheet 07 · Critical path — RoonCyber: AI Identity, taken over two weeks
 * before a board-requested launch. A drafting Gantt: 16 PR bars land on the
 * critical path as the request dot walks the days to the launch diamond.
 */
export default function CriticalPath() {
  const meta = sheetById("s7");
  return (
    <Sheet meta={meta} z={7}>
      <aside className="notes notes-tight">
        <SpecTable {...meta.schedule!} />
        <GeneralNotes notes={meta.notes!} />
      </aside>
      <div className="drawing">
        <svg className="dwg" viewBox="0 0 900 620" role="img" aria-label="Gantt chart from the handoff on June 30 to the board-requested launch on July 21. Sixteen merged PRs stack onto eight workstreams (stats, owner writes, drawer and risk, workload writer, last-used and dormancy, privilege from IAM, runs-as links, sort invariant) and the launch diamond fills: on schedule. Detail A: an AI identity runs as a workload that runs as an application, with IAM policy and statement nodes for PBAC.">
          <text className="lbl fade" x="60" y="22">DWG 07 · SCHEDULE — CRITICAL PATH · AI IDENTITY · 2026</text>
          <g className="from"><path className="ink" d="M4 88 L30 88 L42 100 L30 112 L4 112 Z" pathLength={1} /><text className="lbl fade" x="4" y="80">FROM SHT 06</text></g>

          {/* day axis and week grid */}
          <g className="axis">
            <path className="ink" d={`M${CP.x0} 74 L${CP.x1 + 80} 74`} pathLength={1} />
            <path
              className="ink t"
              d={Array.from({ length: CP.days + 4 }, (_, d) => `M${f1(dayX(d))} 74 L${f1(dayX(d))} ${d % 7 ? 78 : 82}`).join(" ")}
              pathLength={1}
            />
            {WEEKS.map(([d, t]) => (
              <text key={t} className="lbl fade" x={f1(dayX(d))} y="62" textAnchor="middle" style={{ fontSize: "8.5px" }}>
                {t}
              </text>
            ))}
            {WEEKS.slice(1, 3).map(([d]) => (
              <path key={d} className="ctr fade" d={`M${f1(dayX(d))} 84 L${f1(dayX(d))} 370`} />
            ))}
            <path className="dl fade" d={`M${CP.x1} 84 L${CP.x1} 380`} />
          </g>

          {/* lanes and their PR bars */}
          <g className="lanes">
            {LANES.map((l, k) => (
              <Fragment key={l.label}>
                <text className="lbl fade" x="56" y={laneY(k) + 3} style={{ fontSize: "8px" }}>
                  {l.label.toUpperCase()}
                </text>
                <path className="ink t" d={`M${CP.x0} ${laneY(k) + 13} L${CP.x1} ${laneY(k) + 13}`} pathLength={1} />
              </Fragment>
            ))}
          </g>
          <g className="bars">
            {LANES.flatMap((l, k) =>
              l.bars.map(([a, b], j) => (
                <g key={`${k}-${j}`} className="bar" data-d={a}>
                  <rect className="bar-f" x={f1(dayX(a))} y={laneY(k) - 7} width={f1(dayX(b) - dayX(a))} height="14" />
                  <rect className="bar-o" x={f1(dayX(a))} y={laneY(k) - 7} width={f1(dayX(b) - dayX(a))} height="14" />
                </g>
              )),
            )}
          </g>
          <g className="post">
            <rect className="pl" x={f1(dayX(22))} y={laneY(0) - 7} width={f1(dayX(24.4) - dayX(22))} height="14" />
            <rect className="pl" x={f1(dayX(23))} y={laneY(1) - 7} width={f1(dayX(25.6) - dayX(23))} height="14" />
            <text className="lbl fade" x={f1(dayX(22))} y="92" style={{ fontSize: "7.5px" }}>POLISH</text>
          </g>

          {/* the critical path itself, handoff → launch */}
          <g className="cpath">
            <path className="ink b" d={`M${CP.x0} 392 L${CP.x1} 392`} pathLength={1} />
            <path className="ink b solid" d={`M${CP.x0} 382 L${CP.x0 + 10} 392 L${CP.x0} 402 L${CP.x0 - 10} 392 Z`} pathLength={1} />
            <path className="ink b solid" d={`M${CP.x1} 378 L${CP.x1 + 14} 392 L${CP.x1} 406 L${CP.x1 - 14} 392 Z`} pathLength={1} />
            <text className="lbl k fade" x={CP.x0 - 6} y="424" style={{ fontSize: "8.5px" }}>HANDOFF · OWNER LEAVES</text>
            <text className="lbl k fade" x={CP.x1 + 14} y="424" textAnchor="end" style={{ fontSize: "8.5px" }}>BOARD LAUNCH · JUL 21</text>
          </g>
          <path className="launch hot" d={`M${CP.x1} 384 L${CP.x1 + 8} 392 L${CP.x1} 400 L${CP.x1 - 8} 392 Z`} />

          <g className="m7"><text className="lbl-b pop" x="40" y="476">16 PRs · 3 WEEKS</text><text className="lbl pop" x="40" y="496" style={{ fontSize: "8.5px" }}>TO MAIN · ALL BEFORE LAUNCH DAY</text></g>
          <g className="c-thanks"><text className="hand pop" x="40" y="540">thanked by the CEO</text><text className="hand pop" x="40" y="570">+ the Director of Product</text></g>

          {/* DETAIL A · runs-as links + PBAC */}
          <g className="detG">
            <text className="lbl k fade" x="560" y="470">DETAIL A · RUNS-AS + PBAC</text>
            <circle className="ink b solid" cx="590" cy="512" r="20" pathLength={1} />
            <text className="st-name sm fade" x="590" y="516" textAnchor="middle">ID</text>
            <text className="lbl fade" x="590" y="547" textAnchor="middle" style={{ fontSize: "7.5px" }}>AI IDENTITY</text>
            <path className="ink" d="M610 512 L652 512" markerEnd="url(#arr)" pathLength={1} />
            <rect className="ink b solid" x="654" y="496" width="92" height="32" rx="3" pathLength={1} />
            <text className="st-name sm fade" x="700" y="516" textAnchor="middle" style={{ fontSize: "9px" }}>WORKLOAD</text>
            <path className="ink" d="M746 512 L782 512" markerEnd="url(#arr)" pathLength={1} />
            <rect className="ink b solid" x="784" y="496" width="100" height="32" rx="3" pathLength={1} />
            <text className="st-name sm fade" x="834" y="516" textAnchor="middle" style={{ fontSize: "9px" }}>APPLICATION</text>
            <text className="lbl fade" x="631" y="490" textAnchor="middle" style={{ fontSize: "7px" }}>RUNS AS</text>
            <text className="lbl fade" x="764" y="490" textAnchor="middle" style={{ fontSize: "7px" }}>RUNS AS</text>
            <path className="rel fade" d="M590 532 L590 576 L606 576" />
            <rect className="ink t" x="606" y="564" width="90" height="24" rx="2" pathLength={1} />
            <text className="lbl fade" x="651" y="580" textAnchor="middle" style={{ fontSize: "7.5px" }}>IAM POLICY</text>
            <path className="ink t" d="M696 576 L714 576" pathLength={1} />
            <rect className="ink t" x="714" y="564" width="90" height="24" rx="2" pathLength={1} />
            <text className="lbl fade" x="759" y="580" textAnchor="middle" style={{ fontSize: "7.5px" }}>STATEMENT</text>
            <text className="lbl k fade" x="816" y="580" style={{ fontSize: "7.5px" }}>PBAC</text>
            <text className="lbl fade" x="560" y="608" style={{ fontSize: "7.5px" }}>PRIVILEGE ← IAM ACTIONS · LAST USED ← AWS</text>
          </g>

          <g className="to"><path className="ink" d="M848 380 L874 380 L886 392 L874 404 L848 404 Z" pathLength={1} /><text className="lbl fade" x="886" y="372" textAnchor="end">TO SHT 08</text></g>
          <Stamp className="st-sched" transform="translate(428 552) rotate(-6)" w={204} h={64} inset={7} title="ON SCHEDULE" titleY={4} titleStyle={{ fontSize: "27px" }} sub="BOARD LAUNCH · JUL 21" subY={19} hot />
          <Route id="r7a" d="M42 100 L46 100 Q50 100 50 110 L50 380 Q50 392 62 392 L190 392" />
          <Route id="r7b" d={`M${CP.x0} 392 L${CP.x1} 392`} />
          <Route id="r7c" d={`M${CP.x1} 392 L848 392`} />
          <Dot at="42 100" />
        </svg>
      </div>
    </Sheet>
  );
}
