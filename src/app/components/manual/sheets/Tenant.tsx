import Sheet from "../Sheet";
import SpecTable from "../SpecTable";
import GeneralNotes from "../GeneralNotes";
import { Dot, Route, Stamp } from "../svgParts";
import { sheetById } from "@/data/manual";
import { FloorDetectors, FloorDoors, FloorWalls } from "./geometry";


/** Sheet 04 · Tenant isolation — RoonCyber: tenant rooms off a shared bus, with a vellum overlay of the watermark logic. */
export default function Tenant() {
  const meta = sheetById("s4");
  return (
    <Sheet meta={meta} z={4}>
      <aside className="notes">
        <SpecTable {...meta.schedule!} />
        <GeneralNotes notes={meta.notes!} />
      </aside>
      <div className="drawing">
        <svg className="dwg" viewBox="0 0 900 620" role="img" aria-label="Floor plan of six tenant rooms off a shared event-bus corridor, each with its own detector. A tracing overlay annotates per-tenant watermarks that turn redelivery into a no-op.">
          <text className="lbl fade" x="60" y="32">DWG 04 · PLAN — TENANT FLOOR · LEVEL 01</text>
          <FloorWalls />
          <FloorDoors />
          <FloorDetectors />
          <path className="ink bus" d="M44 270 L846 270" pathLength={1} />
          <text className="lbl fade" x="500" y="290">SHARED INGRESS · EVENT BUS</text>
          <g className="from"><path className="ink" d="M4 258 L30 258 L42 270 L30 282 L4 282 Z" pathLength={1} /><text className="lbl fade" x="4" y="250">FROM SHT 03</text></g>
          <g className="to"><path className="ink" d="M848 258 L874 258 L886 270 L874 282 L848 282 Z" pathLength={1} /><text className="lbl fade" x="886" y="250" textAnchor="end">TO SHT 05</text></g>
          <g className="regs"><g transform="translate(24 470)"><circle className="ink t" r="9" pathLength={1} /><path className="ink t" d="M-15 0 L15 0 M0 -15 L0 15" pathLength={1} /></g><g transform="translate(876 470)"><circle className="ink t" r="9" pathLength={1} /><path className="ink t" d="M-15 0 L15 0 M0 -15 L0 15" pathLength={1} /></g></g>
          <g className="rings"><circle className="ring-o" cx="450" cy="145" r="20" /><circle className="ring-o" cx="450" cy="145" r="20" /><circle className="ring-o" cx="450" cy="145" r="20" /></g>
          <Route id="r3a" d="M18 270 L430 270 L430 200 Q430 160 450 145" />
          <Route id="r3b" d="M450 145 Q430 160 430 200 L430 270 L866 270" />
          <Dot at="18 270" />
        </svg>
        <div className="vellum" aria-hidden="true">
          <span className="tape a" />
          <span className="tape b" />
          <span className="vtag">Vellum · Overlay A</span>
          <svg viewBox="0 0 900 620">
            <g className="regs"><g transform="translate(24 470)"><circle className="ink t" r="9" pathLength={1} /><path className="ink t" d="M-15 0 L15 0 M0 -15 L0 15" pathLength={1} /></g><g transform="translate(876 470)"><circle className="ink t" r="9" pathLength={1} /><path className="ink t" d="M-15 0 L15 0 M0 -15 L0 15" pathLength={1} /></g></g>
            <text className="lbl k fade" x="560" y="32">OVERLAY A · WATERMARK LOGIC</text>
            <path className="ink sg" d="M403 233 L457 233" pathLength={1} />
            <text className="hand pop" x="464" y="216">wm</text>
            <g className="skip pop"><path className="sig-ln" d="M423 245 L437 259 M437 245 L423 259" /><text className="lbl k" x="412" y="256" textAnchor="end">DUP · SKIPPED</text></g>
            <g className="ghost"><circle className="gh" r="8" /></g>
            <g className="v1"><path className="ink" d="M250 484 L420 244" pathLength={1} /><text className="hand pop" x="60" y="500">per-tenant watermark:</text><text className="hand pop" x="60" y="530">redelivery ≤ wm → no-op</text></g>
            <g className="v2"><path className="ink" d="M606 98 L590 114" pathLength={1} /><text className="hand pop" x="612" y="104">walls = isolation</text></g>
            <g className="v4"><text className="hand pop" x="596" y="486">mutation-tested:</text><text className="hand pop" x="596" y="514">the tests got tested.</text></g>
            <g className="tline"><path className="ink" d="M60 590 L760 590" pathLength={1} /><path className="ink" d="M60 580 L60 600 M760 580 L760 600" pathLength={1} /><text className="lbl k pop" x="60" y="614">T−14 DAYS · TOOK OVER AI-IDENTITY PIPELINE</text><text className="lbl k pop" x="760" y="614" textAnchor="end">BOARD-REQUESTED LAUNCH</text></g>
            <Route id="rt" d="M60 590 L760 590" noTrail />
            <path className="tmark" d="M0 -10 L7 2 L-7 2 Z" />
            <Stamp className="st3" transform="translate(452 520) rotate(-5)" w={244} h={68} title="IDEMPOTENT ✓" titleY={7} sub="REDELIVERY = NO-OP" subY={20} />
            <Stamp className="st3b" transform="translate(818 568) rotate(-8)" w={164} h={64} inset={7} title="SHIPPED" titleY={0} titleStyle={{ fontSize: "23px" }} sub="ON SCHEDULE" subY={16} hot />
          </svg>
        </div>
      </div>
    </Sheet>
  );
}
