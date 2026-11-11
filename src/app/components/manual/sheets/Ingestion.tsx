import Sheet from "../Sheet";
import SpecTable from "../SpecTable";
import GeneralNotes from "../GeneralNotes";
import { Dot, Route, Stamp } from "../svgParts";
import { sheetById } from "@/data/manual";


/** Sheet 01 · Ingestion — Mercedes-Benz R&D India: multi-source telemetry into a central warehouse. */
export default function Ingestion() {
  const meta = sheetById("s1");
  return (
    <Sheet meta={meta} z={1}>
      <aside className="notes">
        <SpecTable {...meta.schedule!} />
        <GeneralNotes notes={meta.notes!} />
      </aside>
      <div className="drawing">
        <svg className="dwg" viewBox="0 0 900 620" role="img" aria-label="Schematic: telemetry from a vehicle and other sources streams into Azure Event Hubs in real time, runs through PySpark ETL, and lands in a Delta Lake warehouse holding 90 TB+. Detail B: an N+1 query fan-out replaced by one call, halving p95 latency.">
          <text className="lbl fade" x="20" y="22">DWG 01 · MULTI-SOURCE INGESTION · NTS</text>
          <g className="p1" transform="translate(0 90)">
            <path className="ink b" d="M28 396 L28 368 C28 356 40 350 58 347 L112 340 C138 314 168 298 214 294 L262 294 C292 296 314 316 336 338 L352 344 C362 348 366 358 366 372 L366 396 L330 396 A34 34 0 0 0 262 396 L132 396 A34 34 0 0 0 64 396 Z" pathLength={1} />
            <path className="ink" d="M124 340 C146 318 170 306 208 303 L208 340 Z" pathLength={1} />
            <path className="ink" d="M218 303 L258 303 C282 305 300 320 318 339 L218 340 Z" pathLength={1} />
            <path className="ink t" d="M213 340 L213 392 M36 372 L360 372 M300 352 L316 352" pathLength={1} />
            <circle className="ink b" cx="98" cy="396" r="26" pathLength={1} /><circle className="ink" cx="98" cy="396" r="9" pathLength={1} />
            <circle className="ink b" cx="296" cy="396" r="26" pathLength={1} /><circle className="ink" cx="296" cy="396" r="9" pathLength={1} />
            <path className="ctr fade" d="M62 396 L134 396 M98 360 L98 432 M260 396 L332 396 M296 360 L296 432" />
            <path className="ink" d="M214 294 L214 266" pathLength={1} /><circle className="ink" cx="214" cy="262" r="4" pathLength={1} />
            <circle className="ink" cx="40" cy="376" r="3.5" pathLength={1} /><circle className="ink" cx="356" cy="360" r="3.5" pathLength={1} />
            <path className="ink t" d="M8 424 L384 424" pathLength={1} />
            <rect className="fade" x="8" y="424" width="376" height="9" fill="url(#hatch)" />
            <text className="lbl fade" x="8" y="454">ELEVATION 1 · SRC 01 · VEHICLE</text>
            <text className="lbl fade" x="224" y="268">OTA</text>
          </g>
          <g className="p2">
            <rect className="ink" x="40" y="60" width="130" height="40" pathLength={1} /><text className="lbl fade" x="54" y="84">SRC 02</text><path className="ink t" d="M124 70 L158 70 M124 80 L158 80 M124 90 L148 90" pathLength={1} />
            <rect className="ink" x="40" y="130" width="130" height="40" pathLength={1} /><text className="lbl fade" x="54" y="154">SRC 03</text><path className="ink t" d="M124 140 L158 140 M124 150 L158 150 M124 160 L148 160" pathLength={1} />
            <path className="ink" d="M170 80 C300 80 380 166 440 180" pathLength={1} />
            <path className="ink" d="M170 150 C300 150 360 186 440 190" pathLength={1} />
            <path className="ink" d="M214 352 C250 280 360 214 440 200" pathLength={1} />
            <path className="ink" d="M356 450 C410 430 404 262 440 222" pathLength={1} />
            <path className="ink" d="M40 466 C18 400 34 330 120 322 C260 310 380 262 440 236" pathLength={1} />
          </g>
          <g className="p3">
            <rect className="ink b solid" x="440" y="165" width="100" height="95" rx="6" pathLength={1} />
            <path className="ink t" d="M452 184 L528 184 M452 203 L528 203 M452 222 L528 222 M452 241 L528 241" pathLength={1} />
            <text className="lbl fade" x="440" y="154">AZURE EVENT HUBS</text>
          </g>
          <g className="p4">
            <path className="ink" d="M540 206 L600 206 M540 220 L600 220" pathLength={1} />
            <path className="ink t" d="M550 198 L550 228 M590 198 L590 228" pathLength={1} />
            <rect className="ink t" x="616" y="164" width="120" height="66" pathLength={1} />
            <rect className="ink t" x="608" y="172" width="120" height="66" pathLength={1} />
            <rect className="ink b solid" x="600" y="180" width="120" height="66" pathLength={1} />
            <path className="ink" d="M618 213 L642 213 M630 201 L630 225 M622 205 L638 221 M638 205 L622 221" pathLength={1} />
            <text className="lbl fade" x="652" y="209">PYSPARK</text><text className="lbl fade" x="652" y="226">ETL</text>
            <path className="ink" d="M720 206 L748 206 L748 338 M720 220 L734 220 L734 331" pathLength={1} />
          </g>
          <g className="p5">
            <path className="fade" fill="url(#hatch)" fillRule="evenodd" d="M570 380 L840 380 L840 560 L570 560 Z M584 394 L826 394 L826 548 L584 548 Z" />
            <rect id="lvl" x="586" y="396" width="238" height="150" fill="url(#hatchFine)" />
            <path className="ink b" d="M570 380 L840 380 L840 560 L570 560 Z" pathLength={1} />
            <path className="ink t" d="M584 394 L826 394 L826 548 L584 548 Z" pathLength={1} />
            <path className="ink b" d="M570 380 L705 318 L840 380" pathLength={1} />
            <path className="ink t" d="M584 380 L705 332 L826 380" pathLength={1} />
            <path className="ink t" d="M584 446 L826 446 M584 498 L826 498" pathLength={1} />
            <text className="lbl fade" x="705" y="372" textAnchor="middle">DELTA LAKE</text>
            <text className="lbl fade" x="570" y="582">SECTION A–A · WAREHOUSE</text>
            <path className="ink" d="M727 590 L755 590 L755 604 L741 616 L727 604 Z" pathLength={1} />
            <text className="lbl fade" x="764" y="610">TO SHT 02</text>
          </g>
          <g className="dim1">
            <path className="dimln" d="M846 394 L872 394 M846 548 L872 548" />
            <path className="dimln" d="M862 394 L862 548" markerStart="url(#tk)" markerEnd="url(#tk)" />
            <text className="dimtxt" transform="translate(884 471) rotate(-90)" textAnchor="middle">90 TB+</text>
          </g>
          <g className="c1"><path className="ink t" d="M214 346 L190 262 L30 262" pathLength={1} /><text className="hand pop" x="30" y="252">OTA telemetry, straight off the car</text></g>
          <g className="c2"><path className="ink t" d="M512 165 L540 120 L560 120" pathLength={1} /><text className="hand pop" x="566" y="126">many sources, one front door</text></g>
          <g className="c3"><path className="ink t" d="M566 470 L522 500" pathLength={1} /><text className="hand pop" x="388" y="524">pitched it,</text><text className="hand pop" x="402" y="552">then built it.</text></g>
          <g className="hotp">
            <text className="lbl k fade" x="470" y="38" style={{ fontSize: "8.5px" }}>DETAIL B · HOT PATH · ON CALL</text>
            <text className="lbl fade" x="470" y="63" style={{ fontSize: "7.5px" }}>BEFORE</text>
            <rect className="ink t" x="526" y="52" width="24" height="14" rx="2" pathLength={1} />
            <path className="ink t" d="M550 59 L590 48 M550 59 L590 54 M550 59 L590 59 M550 59 L590 64 M550 59 L590 70" pathLength={1} />
            <rect className="ink t" x="592" y="46" width="18" height="26" rx="5" pathLength={1} />
            <path className="ink b" d="M626 59 L866 59" pathLength={1} />
            <text className="lbl fade" x="626" y="50" style={{ fontSize: "7px" }}>p95 · N+1 QUERIES</text>
            <text className="lbl fade" x="470" y="91" style={{ fontSize: "7.5px" }}>AFTER</text>
            <rect className="ink t" x="526" y="80" width="24" height="14" rx="2" pathLength={1} />
            <path className="ink b" d="M550 87 L590 87" pathLength={1} />
            <rect className="ink t" x="592" y="74" width="18" height="26" rx="5" pathLength={1} />
            <path className="sig-ln p95b sdraw" d="M626 87 L746 87" pathLength={1} />
            <text className="dimtxt pop" x="758" y="92">−50%</text>
          </g>
          <Stamp className="st1" transform="translate(470 318) rotate(-7)" w={200} h={68} title="APPROVED" titleY={7} sub="CENTRAL WAREHOUSE · 2022" subY={20} />
          <Route id="r1" d="M214 352 C250 280 360 214 440 200 L540 213 L741 213 L741 470 L741 592" />
          <Dot at="214 352" />
        </svg>
      </div>
    </Sheet>
  );
}
