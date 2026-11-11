import Sheet from "../Sheet";
import SpecTable from "../SpecTable";
import GeneralNotes from "../GeneralNotes";
import { Dot, Route, Stamp } from "../svgParts";
import { sheetById } from "@/data/manual";


/**
 * Sheet 05 · Durable workflows — Beacon (sole author) and temporal-onprem-stack.
 * The state diagram is labelled illustrative: state names and codes are not from the source.
 */
export default function Workflows() {
  const meta = sheetById("s5");
  return (
    <Sheet meta={meta} z={5}>
      <aside className="notes">
        <SpecTable {...meta.schedule!} />
        <GeneralNotes notes={meta.notes!} />
      </aside>
      <div className="drawing">
        <svg className="dwg" viewBox="0 0 900 620" role="img" aria-label="State diagram of the Beacon notification workflow: the send activity times out three times, retries, then succeeds and the workflow completes. Detail B shows the self-hosted Temporal stack with mTLS between worker and server.">
          <text className="lbl fade" x="60" y="22">DWG 05 · STATE DIAGRAM — BEACON · NOTIFICATION WORKFLOW</text>
          <text className="lbl fade illus" x="60" y="40">Illustrative · state names and codes are not from the source</text>
          <g className="from"><path className="ink" d="M4 188 L30 188 L42 200 L30 212 L4 212 Z" pathLength={1} /><text className="lbl fade" x="4" y="178">FROM SHT 04</text></g>
          <g className="states">
            <circle className="ink b" cx="80" cy="200" r="20" pathLength={1} /><circle className="fade fill-ink" cx="80" cy="200" r="9" />
            <rect className="ink b" x="160" y="172" width="140" height="56" rx="12" pathLength={1} />
            <rect className="ink b" x="380" y="172" width="140" height="56" rx="12" pathLength={1} />
            <rect className="ink b" x="600" y="172" width="140" height="56" rx="12" pathLength={1} />
            <circle className="ink b" cx="820" cy="200" r="22" pathLength={1} /><circle className="ink" cx="820" cy="200" r="14" pathLength={1} />
            <text className="st-name fade" x="230" y="205" textAnchor="middle">ENQUEUE</text>
            <text className="st-name fade" x="450" y="205" textAnchor="middle">SEND()</text>
            <text className="st-name fade" x="670" y="205" textAnchor="middle">RECORD</text>
            <text className="lbl fade" x="80" y="244" textAnchor="middle">START</text>
            <text className="lbl fade" x="820" y="246" textAnchor="middle">DONE</text>
          </g>
          <g className="arrows">
            <path className="ink" markerEnd="url(#arr)" d="M101 200 L157 200" pathLength={1} />
            <path className="ink" markerEnd="url(#arr)" d="M300 200 L377 200" pathLength={1} />
            <path className="ink" markerEnd="url(#arr)" d="M520 200 L597 200" pathLength={1} />
            <path className="ink" markerEnd="url(#arr)" d="M740 200 L795 200" pathLength={1} />
          </g>
          <g className="loop"><path className="ink" markerEnd="url(#arr)" d="M505 172 C525 96 375 96 395 170" pathLength={1} /><text className="lbl fade" x="450" y="104" textAnchor="middle">RETRY POLICY</text></g>
          <g className="fail pop"><path className="sig-ln" d="M530 176 L542 190 L532 196 L546 212" /><text className="hand o" x="552" y="174">timeout</text></g>
          <text className="lbl k att att1" x="450" y="254" textAnchor="middle">ATTEMPT 1</text>
          <text className="lbl k att att2" x="450" y="254" textAnchor="middle">ATTEMPT 2</text>
          <text className="lbl k att att3" x="450" y="254" textAnchor="middle">ATTEMPT 3</text>
          <text className="lbl k att att4" x="450" y="254" textAnchor="middle">ATTEMPT 4 · OK</text>
          <g className="log">
            <path className="ink t" d="M160 290 L520 290 M160 318 L520 318" pathLength={1} />
            <text className="lbl k fade" x="160" y="309">RETRY LOG · send()</text>
            <g className="row pop"><text className="lbl" x="168" y="342">#1</text><text className="lbl" x="214" y="342">send()</text><text className="lbl k" x="512" y="342" textAnchor="end">TIMEOUT</text></g>
            <g className="row pop"><text className="lbl" x="168" y="368">#2</text><text className="lbl" x="214" y="368">send()</text><text className="lbl k" x="512" y="368" textAnchor="end">TIMEOUT</text></g>
            <g className="row pop"><text className="lbl" x="168" y="394">#3</text><text className="lbl" x="214" y="394">send()</text><text className="lbl k" x="512" y="394" textAnchor="end">TIMEOUT</text></g>
            <g className="row pop"><text className="lbl" x="168" y="420">#4</text><text className="lbl" x="214" y="420">send()</text><text className="lbl k" x="512" y="420" textAnchor="end">200 OK</text></g>
            <g className="row pop"><path className="dimln" d="M160 434 L520 434" /><text className="lbl k" x="168" y="456">RECORD ✓ · WORKFLOW COMPLETE</text></g>
          </g>
          <g className="dmark"><circle className="ink" cx="670" cy="254" r="12" pathLength={1} /><text className="lbl k fade" x="670" y="258" textAnchor="middle">B</text><path className="ink t" d="M674 266 L692 334" pathLength={1} /></g>
          <g className="detail">
            <circle className="ink b" cx="720" cy="450" r="118" pathLength={1} />
            <rect className="ink" x="628" y="430" width="78" height="42" rx="4" pathLength={1} /><text className="lbl k fade" x="667" y="455" textAnchor="middle">WORKER</text>
            <rect className="ink" x="734" y="430" width="78" height="42" rx="4" pathLength={1} /><text className="lbl k fade" x="773" y="455" textAnchor="middle">TEMPORAL</text>
            <path className="ink" markerStart="url(#arr)" markerEnd="url(#arr)" d="M709 451 L731 451" pathLength={1} />
            <rect className="ink" x="712" y="404" width="16" height="13" rx="2" pathLength={1} /><path className="ink" d="M715 404 L715 399 A5 5 0 0 1 725 399 L725 404" pathLength={1} />
            <rect className="ink t" x="652" y="388" width="30" height="22" pathLength={1} /><path className="ink t" d="M656 395 L676 395 M656 401 L670 401" pathLength={1} /><circle className="ink t" cx="677" cy="410" r="4" pathLength={1} />
            <rect className="ink t" x="758" y="388" width="30" height="22" pathLength={1} /><path className="ink t" d="M762 395 L782 395 M762 401 L776 401" pathLength={1} /><circle className="ink t" cx="783" cy="410" r="4" pathLength={1} />
            <text className="hand pop" x="646" y="510">mTLS, both ways</text>
            <text className="lbl fade" x="720" y="536" textAnchor="middle">SELF-HOSTED</text>
          </g>
          <text className="lbl fade" x="720" y="596" textAnchor="middle">DETAIL B · TEMPORAL-ONPREM-STACK</text>
          <g className="to"><path className="ink" d="M856 188 L876 188 L888 200 L876 212 L856 212 Z" pathLength={1} /><text className="lbl fade" x="888" y="178" textAnchor="end">TO SHT 06</text></g>
          <Stamp className="st4" transform="translate(250 96) rotate(-8)" w={192} h={68} title="RETRY ×3" titleY={7} sub="DURABLE · NOT DROPPED" subY={20} hot />
          <Stamp className="st4b" transform="translate(820 110) rotate(7)" w={136} h={64} inset={7} title="200 OK" titleY={8} />
          <Route id="r4a" d="M30 200 L505 200" />
          <Route id="r4l" d="M505 200 L505 172 C525 96 375 96 395 172 L395 200 L505 200" />
          <Route id="r4b" d="M505 200 L820 200" />
          <Route id="r4c" d="M820 200 L872 200" />
          <Dot at="30 200" />
        </svg>
      </div>
    </Sheet>
  );
}
