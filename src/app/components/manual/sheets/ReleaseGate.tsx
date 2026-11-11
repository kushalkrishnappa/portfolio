import { Fragment } from "react";
import Sheet from "../Sheet";
import SpecTable from "../SpecTable";
import GeneralNotes from "../GeneralNotes";
import { Dot, Route, Stamp } from "../svgParts";
import { sheetById } from "@/data/manual";

/** Rack of the fleet: 4 × 5 environments that take the new image. */
const RACK = Array.from({ length: 20 }, (_, i) => ({ x: 702 + (i % 4) * 31, y: 190 + Math.floor(i / 4) * 27 }));
/** Gate lamps: the test corpus, 2 × 4. */
const LAMPS = Array.from({ length: 8 }, (_, i) => ({ cx: 574 + (i % 2) * 32, cy: 186 + Math.floor(i / 2) * 26 }));
const INVENTORY = ["Team scripts", "Validation cmds", "DE sessions", "Command corpus"];
const PRESS_STATES = ["Beta 1 · 1 month", "Beta 2", "Published ✓"];

/**
 * Sheet 04 · Release gate — Pure Storage / Everpure: Ubuntu 14 → 22 for the
 * dev and test fleet, and the pytest gate every golden image passes since.
 * An elevation of the line: intake board, Packer press, the gate, the fleet.
 */
export default function ReleaseGate() {
  const meta = sheetById("s4");
  return (
    <Sheet meta={meta} z={4}>
      <aside className="notes notes-tight">
        <SpecTable {...meta.schedule!} />
        <GeneralNotes notes={meta.notes!} />
      </aside>
      <div className="drawing">
        <svg className="dwg" viewBox="0 0 900 620" role="img" aria-label="Elevation of a release line. A crate of Ubuntu 14 machines, running since 2014, is retired off the line. A Packer press stamps one golden Ubuntu 22 image through two betas to published. The image passes a permanent gate of pytest lamps (the team's whole command corpus) and lands in a rack of 1,500+ environments. A second image passes the same gate.">
          <text className="lbl fade" x="60" y="22">DWG 04 · ELEVATION — RELEASE LINE · NTS</text>
          <g className="from"><path className="ink" d="M4 288 L30 288 L42 300 L30 312 L4 312 Z" pathLength={1} /><text className="lbl fade" x="4" y="278">FROM SHT 03</text></g>

          {/* the line: belt, rollers, legs, ground */}
          <g className="line">
            <path className="ink b" d="M40 380 L840 380" pathLength={1} />
            <path className="ink" d="M40 394 L840 394" pathLength={1} />
            <path className="ink t" d="M70 394 L70 446 M300 394 L300 446 M520 394 L520 446 M760 394 L760 446" pathLength={1} />
            <path className="ink t" d="M20 446 L860 446" pathLength={1} />
          </g>
          <rect className="fade" x="20" y="446" width="840" height="9" fill="url(#hatch)" />
          <g className="rollers">
            {Array.from({ length: 20 }, (_, k) => (
              <circle key={k} className="ink t" cx={60 + k * 40} cy="387" r="4" pathLength={1} />
            ))}
          </g>

          {/* intake board: every team's workflow, inventoried */}
          <g className="intake">
            <rect className="ink b solid" x="60" y="54" width="196" height="196" rx="4" pathLength={1} />
            <rect className="ink solid" x="128" y="44" width="60" height="18" rx="3" pathLength={1} />
            <text className="lbl k fade" x="76" y="88" style={{ fontSize: "9px" }}>WORKFLOW INVENTORY</text>
            <path className="ink t" d="M76 98 L240 98" pathLength={1} />
            {INVENTORY.map((t, i) => (
              <Fragment key={t}>
                <text className="lbl fade" x="76" y={128 + i * 32} style={{ fontSize: "9px" }}>{t.toUpperCase()}</text>
                <rect className="ink t" x="222" y={117 + i * 32} width="14" height="14" pathLength={1} />
                <path className="sig-ln chk nf" d={`M224 ${125 + i * 32} L228 ${129 + i * 32} L235 ${120 + i * 32}`} />
              </Fragment>
            ))}
          </g>

          {/* the old fleet image: a crate on the line, retired off it */}
          <g className="crate-live">
            <rect className="fade" x="56" y="322" width="92" height="58" fill="url(#hatchFine)" />
            <rect className="ink b" x="56" y="322" width="92" height="58" pathLength={1} />
            <text className="lbl k fade" x="102" y="346" textAnchor="middle" style={{ fontSize: "9px" }}>UBUNTU 14</text>
            <text className="lbl fade" x="102" y="364" textAnchor="middle" style={{ fontSize: "8px" }}>SINCE 2014</text>
          </g>
          <g className="crate-ghost">
            <rect className="gh-box" x="40" y="474" width="120" height="50" />
            <text className="lbl" x="100" y="496" textAnchor="middle" style={{ fontSize: "8.5px" }}>UBUNTU 14 · 2014</text>
            <text className="lbl k" x="100" y="512" textAnchor="middle" style={{ fontSize: "8.5px" }}>RETIRED</text>
          </g>

          {/* Packer press: one golden image, two betas, then published */}
          <g className="press">
            <rect className="ink b solid" x="290" y="80" width="160" height="20" pathLength={1} />
            <rect className="ink solid" x="300" y="100" width="12" height="280" pathLength={1} />
            <rect className="ink solid" x="428" y="100" width="12" height="280" pathLength={1} />
            <rect className="ink b solid" x="348" y="100" width="44" height="42" pathLength={1} />
            <text className="st-name sm fade" x="370" y="72" textAnchor="middle">PACKER</text>
          </g>
          <g className="ram">
            <path className="ink" d="M370 142 L370 200" pathLength={1} />
            <rect className="ink b solid" x="324" y="200" width="92" height="30" pathLength={1} />
            <path className="ink t" d="M332 215 L408 215" pathLength={1} />
          </g>
          <g className="tagp">
            <rect className="tagbox" x="300" y="460" width="140" height="30" rx="3" />
            {PRESS_STATES.map((s, i) => (
              <text key={s} className={`lbl k pst pst${i}`} x="370" y="479" textAnchor="middle" style={{ fontSize: "9px" }}>
                {s.toUpperCase()}
              </text>
            ))}
          </g>

          {/* the gate: the whole command corpus, as a pytest suite, on every image */}
          <g className="gate">
            <rect className="ink b solid" x="516" y="124" width="148" height="28" pathLength={1} />
            <rect className="ink solid" x="530" y="152" width="12" height="228" pathLength={1} />
            <rect className="ink solid" x="638" y="152" width="12" height="228" pathLength={1} />
            <rect className="ink t" x="556" y="168" width="68" height="120" rx="3" pathLength={1} />
            <text className="st-name sm fade" x="590" y="143" textAnchor="middle">RELEASE GATE</text>
            <text className="lbl fade" x="590" y="306" textAnchor="middle" style={{ fontSize: "8.5px" }}>PYTEST · CORPUS</text>
            {LAMPS.map((l, i) => (
              <circle key={i} className="ink t" cx={l.cx} cy={l.cy} r="7" pathLength={1} />
            ))}
          </g>
          <g className="lamps">
            {LAMPS.map((l, i) => (
              <circle key={i} className="lamp hot" cx={l.cx} cy={l.cy} r="4.5" />
            ))}
          </g>

          {/* the fleet: 1,500+ environments take the image */}
          <g className="rack">
            <rect className="ink b solid" x="690" y="176" width="140" height="156" rx="3" pathLength={1} />
            <path className="ink t" d="M696 332 L696 380 M824 332 L824 380" pathLength={1} />
            <text className="lbl fade" x="690" y="166" style={{ fontSize: "8.5px" }}>FLEET · DEV + TEST VMs</text>
            {RACK.map((b, i) => (
              <rect key={i} className="ink t" x={b.x} y={b.y} width="24" height="18" pathLength={1} />
            ))}
          </g>
          <g className="rackfill">
            {RACK.map((b, i) => (
              <rect key={i} className="rk2" x={b.x + 2} y={b.y + 2} width="20" height="14" />
            ))}
          </g>
          <g className="dim4">
            <path className="dimln" d="M836 176 L858 176 M836 332 L858 332" />
            <path className="dimln" d="M850 176 L850 332" markerStart="url(#tk)" markerEnd="url(#tk)" />
            <text className="dimtxt" transform="translate(872 254) rotate(-90)" textAnchor="middle">1,500+</text>
          </g>

          {/* the golden image, and the next one through the same gate */}
          <g className="billet b1">
            <rect className="ink b solid" x="326" y="330" width="88" height="50" pathLength={1} />
            <rect x="330" y="334" width="80" height="12" fill="url(#hatchO)" />
            <text className="lbl k fade" x="370" y="362" textAnchor="middle" style={{ fontSize: "8.5px" }}>GOLDEN · U22</text>
          </g>
          <g className="billet b2">
            <rect className="b2box" x="326" y="330" width="88" height="50" />
            <text className="lbl" x="370" y="352" textAnchor="middle" style={{ fontSize: "8px" }}>NEXT IMAGE</text>
            <text className="lbl k" x="370" y="368" textAnchor="middle" style={{ fontSize: "8px" }}>SAME GATE</text>
          </g>

          <g className="c-one"><path className="ink t" d="M452 92 L458 104" pathLength={1} /><text className="hand pop" x="458" y="118" style={{ fontSize: "24px" }}>one golden image</text></g>
          <g className="c-ret"><path className="ink t" d="M100 528 L100 538" pathLength={1} /><text className="hand pop" x="40" y="562">ten years of 14,</text><text className="hand pop" x="40" y="590">retired.</text></g>
          <g className="c-gate"><path className="ink t" d="M640 84 L626 122" pathLength={1} /><text className="hand pop" x="600" y="48">migrate once.</text><text className="hand pop" x="600" y="78">gate every image after.</text></g>
          <g className="to"><path className="ink" d="M848 368 L874 368 L886 380 L874 392 L848 392 Z" pathLength={1} /><text className="lbl fade" x="886" y="414" textAnchor="end">TO SHT 05</text></g>
          <Stamp className="st-gate" transform="translate(560 528) rotate(-4)" w={196} h={56} inset={7} title="PERMANENT" titleY={3} titleStyle={{ fontSize: "26px" }} sub="RUNS ON EVERY IMAGE" subY={16} />
          <Stamp className="st-vp" transform="translate(772 572) rotate(-6)" w={204} h={62} inset={7} title="VP RECOGNITION" titleY={4} titleStyle={{ fontSize: "24px" }} sub="1,500+ ENVS · 100% COMPATIBLE" subY={18} hot />
          <Route id="r4a" d="M42 300 L250 300 Q370 300 370 324" />
          <Route id="r4b" d="M370 324 L590 324 L760 324" />
          <Route id="r4c" d="M760 324 C806 324 818 380 848 380" />
          <Dot at="42 300" />
        </svg>
      </div>
    </Sheet>
  );
}
