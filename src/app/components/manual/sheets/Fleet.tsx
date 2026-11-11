import Sheet from "../Sheet";
import SpecTable from "../SpecTable";
import FactPanel from "../FactPanel";
import { Dot, Route, Stamp } from "../svgParts";
import { sheetById } from "@/data/manual";
import { FleetArcs, FleetAssembly, FleetBroken, FleetFixed, FleetGrid, FleetPlate } from "./geometry";


/** Sheet 02 · Fleet reconciliation — Pure Storage / Everpure: a Temporal reconciler redraws flagged testbeds. */
export default function Fleet() {
  const meta = sheetById("s2");
  return (
    <Sheet meta={meta} z={2}>
      <aside className="notes">
        <SpecTable {...meta.schedule!} />
        <FactPanel />
      </aside>
      <div className="drawing">
        <svg className="dwg" viewBox="0 0 900 620" role="img" aria-label="Exploded axonometric of a 2,000-testbed, 9,000+-VM fleet; a Temporal reconciler visits each flagged node and redraws it. MTTR shrinks from 5 hours to 10 minutes, then a further 85% with snapshot-restore.">
          <text className="lbl fade" x="80" y="22">DWG 02 · FLEET · EXPLODED AXONOMETRIC · NTS</text>
          <g className="from"><path className="ink" d="M14 50 L42 50 L54 62 L42 74 L14 74 Z" pathLength={1} /><text className="lbl fade" x="14" y="94">FROM SHT 01</text></g>
          <FleetGrid />
          <FleetAssembly />
          <FleetPlate />
          <g className="recon">
            <circle className="ink b solid" cx="450" cy="86" r="20" pathLength={1} />
            <path className="ink" markerEnd="url(#arr)" d="M437 74 A18 18 0 0 1 466 80" pathLength={1} />
            <path className="ink" markerEnd="url(#arr)" d="M463 99 A18 18 0 0 1 434 92" pathLength={1} />
          </g>
          <g className="c-recon"><path className="ink t" d="M566 100 L590 74 L600 74" pathLength={1} /><text className="lbl k pop" x="604" y="70">TEMPORAL · RECONCILER</text><text className="hand pop" x="604" y="104">flag → reconcile → redraw</text></g>
          <g className="c-fleet"><path className="ink t" d="M150 326 L112 300 L24 300" pathLength={1} /><text className="lbl-b pop" x="24" y="226">FLEET</text><text className="lbl pop" x="24" y="248">2,000 TESTBEDS</text><text className="lbl pop" x="24" y="267">9,000+ VMs</text><text className="lbl pop" x="24" y="286">OPENSTACK</text></g>
          <FleetBroken />
          <FleetFixed />
          <g className="to"><path className="ink" d="M836 318 L864 318 L876 330 L864 342 L836 342 Z" pathLength={1} /><text className="lbl fade" x="876" y="364" textAnchor="end">TO SHT 03</text></g>
          <g className="mttr">
            <path className="ghost-dim" d="M120 572 L720 572" markerStart="url(#tk)" markerEnd="url(#tk)" />
            <text className="lbl" x="730" y="576">WAS 5 H</text>
            <path className="dimln" d="M120 592 L120 616" />
            <path className="dimln" id="mt-line" d="M120 604 L720 604" />
            <path className="sig-ln" id="mt-end" d="M720 592 L720 616" />
            <text className="lbl" x="24" y="608">MTTR</text>
            <text className="mttr-v" id="mt-v" x="734" y="615">5h 00m</text>
          </g>
          <g className="mt2"><path className="sig-ln" d="M124 594 L124 614" /><text className="lbl k pop" x="268" y="603">THEN −85% MORE</text><text className="lbl pop" x="268" y="617" style={{ fontSize: "8px" }}>SNAPSHOT-RESTORE · GO + TEMPORAL</text></g>
          <Stamp className="st2" transform="translate(770 494) rotate(-6)" w={224} h={68} title="RECONCILED" titleY={7} sub="FLEET · 2023–24" subY={20} />
          <FleetArcs />
          <Route id="r2in" d="M54 62 C200 30 330 56 430 84" />
          <Dot at="54 62" />
        </svg>
      </div>
    </Sheet>
  );
}
