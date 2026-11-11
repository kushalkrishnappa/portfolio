import Sheet from "../Sheet";
import SpecTable from "../SpecTable";
import GeneralNotes from "../GeneralNotes";
import { Dot, Route, Stamp } from "../svgParts";
import { sheetById } from "@/data/manual";
import { ImageGroup } from "./geometry";


/**
 * Sheet 03 · Rollout safety — Pure's internal disruption manager, the
 * rollout-safety control point Dominator consults. DENIED / REQUESTED /
 * PERMITTED are Dominator's existing protocol; "N = 2" is illustrative.
 * Wording is binding (see the spec's Content rules).
 */
export default function Rollout() {
  const meta = sheetById("s3");
  return (
    <Sheet meta={meta} z={3}>
      <aside className="notes notes-tight">
        <SpecTable {...meta.schedule!} />
        <GeneralNotes notes={meta.notes!} />
      </aside>
      <div className="drawing">
        <svg className="dwg" viewBox="0 0 900 620" role="img" aria-label="Elevation of one image group. Dominator consults the disruption manager before a disruptive update. A per-group budget (two, illustrative) lets machines through the gate a couple at a time, canary first, while the rest wait as requested and a machine with running tests holds. An incident report overlay charts the retry storm of the first disruptive rollout and the lessons from it.">
          <text className="lbl fade" x="60" y="22">DWG 03 · ELEVATION — ONE IMAGE GROUP · NTS</text>
          <g className="from"><path className="ink" d="M4 88 L30 88 L42 100 L30 112 L4 112 Z" pathLength={1} /><text className="lbl fade" x="4" y="58">FROM SHT 02</text></g>
          <g className="infra">
            <path className="ink" d="M540 92 L598 92" pathLength={1} />
            <path className="ink" d="M540 132 L770 132 L770 123" pathLength={1} />
            <path className="rel fade" d="M813 90 L835 90" />
            <path className="ink" d="M420 152 L420 196" pathLength={1} />
            <path className="ink" markerEnd="url(#arr)" d="M220 100 L297 100" pathLength={1} />
            <rect className="ink b solid" x="60" y="70" width="160" height="60" rx="4" pathLength={1} />
            <rect className="ink b solid" x="300" y="56" width="240" height="96" rx="4" pathLength={1} />
            <path className="ink solid" d="M598 66 L598 112 A42 10 0 0 0 682 112 L682 66" pathLength={1} /><ellipse className="ink solid" cx="640" cy="66" rx="42" ry="10" pathLength={1} />
            <path className="ink solid" d="M728 66 L728 112 A42 10 0 0 0 812 112 L812 66" pathLength={1} /><ellipse className="ink solid" cx="770" cy="66" rx="42" ry="10" pathLength={1} />
            <path className="ink t" d="M836 76 L836 106 A26 7 0 0 0 888 106 L888 76" pathLength={1} /><ellipse className="ink t" cx="862" cy="76" rx="26" ry="7" pathLength={1} />
            <text className="st-name fade" x="140" y="98" textAnchor="middle">DOMINATOR</text>
            <text className="lbl fade" x="140" y="117" textAnchor="middle">IMAGE UPDATER</text>
            <text className="lbl fade" x="258" y="90" textAnchor="middle" style={{ fontSize: "8px" }}>ASKS</text>
            <text className="st-name fade" x="420" y="90" textAnchor="middle">DISRUPTION MANAGER</text>
            <text className="lbl fade" x="420" y="111" textAnchor="middle" style={{ fontSize: "8.2px", letterSpacing: ".1em" }}>ROLLOUT-SAFETY CONTROL POINT</text>
            <text className="lbl fade" x="420" y="131" textAnchor="middle" style={{ fontSize: "8.5px" }}>PURE · INTERNAL SERVICE</text>
            <text className="st-name sm fade" x="640" y="97" textAnchor="middle">CONSUL</text>
            <text className="st-name sm fade" x="770" y="97" textAnchor="middle">REDIS</text>
            <text className="lbl fade" x="862" y="98" textAnchor="middle" style={{ fontSize: "8.5px" }}>DB</text>
            <text className="lbl fade" x="640" y="152" textAnchor="middle" style={{ fontSize: "8.5px" }}>SEMAPHORE / GROUP</text>
            <text className="lbl fade" x="770" y="152" textAnchor="middle" style={{ fontSize: "8.5px" }}>TTL 100 S</text>
          </g>
          <g className="metric"><path className="ink t" d="M770 158 L770 176" pathLength={1} /><text className="lbl-b pop" x="640" y="200">~7× FEWER DB READS</text><text className="lbl pop" x="640" y="220" style={{ fontSize: "8.5px" }}>TTL CACHE + NEGOTIATED BACKOFF</text></g>
          <g className="gauge">
            <rect className="ink" x="352" y="196" width="136" height="60" rx="3" pathLength={1} />
            <text className="lbl k fade" x="420" y="213" textAnchor="middle" style={{ fontSize: "9px" }}>BUDGET 2 / GROUP</text>
            <rect className="ink t" x="384" y="223" width="22" height="22" pathLength={1} /><rect className="ink t" x="434" y="223" width="22" height="22" pathLength={1} />
            <rect className="tok" x="387" y="226" width="16" height="16" /><rect className="tok" x="437" y="226" width="16" height="16" />
            <text className="lbl fade illus" x="496" y="250">N = 2 · illustrative</text>
          </g>
          <g className="c-n"><path className="ink t" d="M286 214 L350 224" pathLength={1} /><text className="hand pop" x="60" y="198">N at a time,</text><text className="hand pop" x="60" y="226">never the whole group.</text></g>
          <text className="lbl fade lanelbl" x="40" y="250" style={{ fontSize: "8.5px" }}>QUEUE · IMAGE v1</text>
          <text className="lbl fade lanelbl" x="806" y="250" textAnchor="end" style={{ fontSize: "8.5px" }}>UPDATED · IMAGE v2</text>
          <g className="gate">
            <rect className="ink b solid" x="402" y="268" width="8" height="114" pathLength={1} />
            <rect className="ink b solid" x="430" y="268" width="8" height="114" pathLength={1} />
          </g>
          <path className="ink t ground" d="M20 382 L880 382" pathLength={1} />
          <rect className="fade groundf" x="20" y="382" width="860" height="9" fill="url(#hatch)" />
          <ImageGroup />
          <g className="arms"><path className="ink" d="M420 326 L420 290 M420 326 L451 344 M420 326 L389 344" pathLength={1} /><circle className="ink solid" cx="420" cy="326" r="5" pathLength={1} /></g>
          <g className="hold pop"><path className="tagbox" d="M219 292 L219 300" /><rect className="tagbox" x="164" y="252" width="110" height="40" rx="3" />
            <text className="lbl k h1" x="219" y="268" textAnchor="middle" style={{ fontSize: "9px" }}>TESTS RUNNING</text>
            <text className="lbl h2" x="219" y="284" textAnchor="middle" style={{ fontSize: "9px" }}>· HOLD ·</text>
            <text className="lbl k h3" x="219" y="276" textAnchor="middle" style={{ fontSize: "9px" }}>TESTS DONE ✓</text></g>
          <g className="c-rev"><path className="ink" markerEnd="url(#arr)" d="M765 392 C720 458 384 458 341 394" pathLength={1} /><text className="lbl k pop" x="552" y="468" textAnchor="middle">FAST REVERT</text></g>
          <g className="to"><path className="ink" d="M850 264 L876 264 L888 276 L876 288 L850 288 Z" pathLength={1} /><text className="lbl fade" x="888" y="256" textAnchor="end">TO SHT 04</text></g>
          <g className="detc">
            <text className="lbl k fade" x="40" y="492">DETAIL C · PLUGGABLE INTERFACE</text>
            <rect className="ink" x="40" y="502" width="292" height="104" rx="3" pathLength={1} />
            <text className="code fade" x="58" y="532">{"check(machine)   { … }"}</text>
            <text className="code fade" x="58" y="560">{"request(machine) { … }"}</text>
            <text className="code fade" x="58" y="588">{"cancel(machine)  { … }"}</text>
          </g>
          <g className="c-plug"><path className="ink t" d="M332 538 L352 538" pathLength={1} /><text className="hand pop" x="358" y="530">three methods →</text><text className="hand pop" x="358" y="558">your own manager</text></g>
          <g className="after"><text className="illus fade" x="358" y="588">Later: a generic Go version was</text><text className="illus fade" x="358" y="602">open-sourced by the Dominator maintainer</text></g>
          <g className="legend">
            <text className="lbl k fade" x="650" y="492" style={{ fontSize: "8.5px" }}>STATES · DOMINATOR PROTOCOL</text>
            <rect className="ink t" x="650" y="503" width="10" height="10" pathLength={1} /><text className="lbl fade" x="668" y="512" style={{ fontSize: "8.5px" }}>DENIED</text>
            <rect className="ink t" x="746" y="503" width="10" height="10" pathLength={1} /><text className="lbl fade" x="764" y="512" style={{ fontSize: "8.5px" }}>REQUESTED</text>
            <rect className="lg-p fade" x="650" y="521" width="10" height="10" /><text className="lbl fade" x="668" y="530" style={{ fontSize: "8.5px" }}>PERMITTED</text>
          </g>
          <Stamp className="st-rs" transform="translate(766 578) rotate(-6)" w={208} h={60} inset={7} title="STAGGERED ✓" titleY={4} titleStyle={{ fontSize: "28px" }} sub="NEVER THE WHOLE GROUP" subY={17} />
          <g className="incident">
            <rect className="film" x="-14" y="312" width="928" height="318" />
            <rect className="film-tape" x="-36" y="306" width="98" height="22" transform="rotate(-24 13 317)" />
            <rect className="film-tape" x="846" y="606" width="98" height="22" transform="rotate(-24 895 617)" />
            <rect className="film-tab" x="700" y="294" width="198" height="18" />
            <text className="film-tag" x="799" y="307" textAnchor="middle">INCIDENT REPORT · OVERLAY B</text>
            <text className="lbl k fade" x="24" y="334">INCIDENT · RETRY STORM · FIRST DISRUPTIVE ROLLOUT</text>
            <path className="ink t" d="M40 354 L40 520 L572 520" pathLength={1} />
            <text className="lbl fade" x="46" y="352" style={{ fontSize: "7.5px" }}>DB LOAD</text>
            <text className="lbl fade" x="572" y="536" textAnchor="end" style={{ fontSize: "7.5px" }}>TIME →</text>
            <path className="ink" d="M44 512 L60 470 L66 512 L90 470 L96 512 L120 470 L126 512 L150 470 L156 512 L172 506 L250 506" pathLength={1} />
            <text className="lbl fade" x="46" y="456" style={{ fontSize: "7.5px" }}>CHECK PEAKS · EVERY 15 MIN</text>
            <path className="rel fade" d="M168 380 L168 520" />
            <text className="lbl fade" x="174" y="392" style={{ fontSize: "7.5px" }}>CACHE ~100 S</text>
            <text className="lbl fade" x="174" y="404" style={{ fontSize: "7.5px" }}>+ BACKOFF</text>
            <path className="sig-ln storm sdraw" d="M250 506 C272 500 282 420 302 366" pathLength={1} />
            <path className="sig-ln storm sdraw" d="M306 356 L306 520" pathLength={1} />
            <text className="lbl k fade" x="312" y="366" style={{ fontSize: "8px" }}>DB DOWN</text>
            <path className="ink" d="M342 446 A20 20 0 1 1 366 452" markerEnd="url(#arr)" pathLength={1} />
            <text className="lbl fade" x="318" y="484" style={{ fontSize: "7.5px" }}>500 → RETRY FASTER</text>
            <path className="sig-ln storm sdraw" d="M380 506 L398 396 L404 506" pathLength={1} />
            <text className="lbl k fade" x="406" y="404" style={{ fontSize: "8px" }}>REDIS DOWN</text>
            <path className="rel fade" d="M452 380 L452 520" />
            <text className="lbl fade" x="458" y="392" style={{ fontSize: "7.5px" }}>REDIS UPGRADED</text>
            <path className="ink b" d="M404 506 L452 498 L566 498" pathLength={1} />
            <text className="lbl k fade" x="458" y="488" style={{ fontSize: "8px" }}>STEADY ✓</text>
            <text className="lbl k fade" x="604" y="352">LESSONS · WRITTEN DOWN</text>
            <path className="ink t" d="M604 362 L880 362 M604 388 L880 388 M604 414 L880 414 M604 440 L880 440 M604 466 L880 466 M604 492 L880 492" pathLength={1} />
            {["Back-of-envelope load math", "Caching", "Rate limits", "SLAs and SLOs", "Alerts and metrics"].map((l, i) => (
              <g key={l} className="lesson pop">
                <text className="lbl" x="606" y={380 + i * 26} style={{ fontSize: "7.5px" }}>{`0${i + 1}`}</text>
                <text className="lbl k" x="632" y={380 + i * 26} style={{ fontSize: "8px" }}>{l.toUpperCase()}</text>
              </g>
            ))}
            <g className="metric2"><text className="lbl-b pop" x="40" y="572">5 MACHINES AT A TIME</text><text className="lbl pop" x="40" y="592" style={{ fontSize: "8.5px" }}>NEXT DISRUPTIVE ROLLOUT · CACHE + BACKOFF</text></g>
            <g className="c-inc"><text className="hand pop" x="372" y="570">load math</text><text className="hand pop" x="372" y="598">before deploy.</text></g>
            <Stamp className="st-inc" transform="translate(754 566) rotate(-6)" w={212} h={58} inset={7} title="RESOLVED" titleY={3} titleStyle={{ fontSize: "26px" }} sub="NEXT ROLLOUT · 5 AT A TIME" subY={17} />
          </g>
          <Route id="rsa" d="M42 100 L60 100 L300 100 L420 104 L420 196 L420 262" />
          <Route id="rsb" d="M420 262 L420 276 L850 276" />
          <Dot at="42 100" />
        </svg>
      </div>
    </Sheet>
  );
}
