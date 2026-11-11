import type { CSSProperties } from "react";
import Sheet from "../Sheet";
import SpecTable from "../SpecTable";
import { RESUME_HREF } from "../Chrome";
import { Dot, Route, Stamp } from "../svgParts";
import { IssuedSet } from "./geometry";
import ContactForm from "../ContactForm";
import { sheetById } from "@/data/manual";
import { profile } from "@/data/profile";

function socials() {
  // v3 order: GitHub, then LinkedIn.
  const order = ["github", "linkedin"];
  return [...profile.socials].sort((a, b) => order.indexOf(a.icon) - order.indexOf(b.icon));
}

/**
 * Sheet 06 · Issued for hire — the transmittal drawing and the ending: the
 * request dot exits "TO: YOU", punches the Email tag, and the ISSUED FOR HIRE
 * stamp lands. Desktop carries the RFI form in the notes column; on mobile it
 * moves to the continuation sheet below (see RfiSheet).
 */
export default function Contact() {
  const meta = sheetById("s6");
  return (
    <Sheet meta={meta} z={6} className="sclose" heading="Contact">
      <aside className="notes">
        <SpecTable {...meta.schedule!} />
        <ContactForm className="rfi-stage" />
      </aside>
      <div className="drawing">
        <svg className="dwg" viewBox="0 0 900 380" role="img" aria-label="Transmittal: the five drawing sheets bound as one set and routed to you.">
          <text className="lbl fade" x="60" y="20">DWG 06 · TRANSMITTAL · ISSUED SET</text>
          <g className="from"><path className="ink" d="M4 158 L30 158 L42 170 L30 182 L4 182 Z" pathLength={1} /><text className="lbl fade" x="4" y="150">FROM SHT 05</text></g>
          <IssuedSet />
          <g className="tx">
            <text className="lbl k fade" x="620" y="50">TRANSMITTAL</text>
            <path className="ink t" d="M620 60 L880 60 M620 84 L880 84 M620 236 L880 236" pathLength={1} />
            <text className="lbl fade" x="628" y="77" style={{ fontSize: "8px" }}>SHT</text><text className="lbl fade" x="668" y="77" style={{ fontSize: "8px" }}>TITLE</text><text className="lbl fade" x="872" y="77" textAnchor="end" style={{ fontSize: "8px" }}>REV</text>
            <g className="row pop"><text className="lbl" x="628" y="108">01</text><text className="lbl k" x="668" y="108">INGESTION</text><text className="lbl k" x="872" y="108" textAnchor="end">A</text></g>
            <g className="row pop"><text className="lbl" x="628" y="134">02</text><text className="lbl k" x="668" y="134">FLEET RECONCILIATION</text><text className="lbl k" x="872" y="134" textAnchor="end">B</text></g>
            <g className="row pop"><text className="lbl" x="628" y="160">03</text><text className="lbl k" x="668" y="160">ROLLOUT SAFETY</text><text className="lbl k" x="872" y="160" textAnchor="end">C</text></g>
            <g className="row pop"><text className="lbl" x="628" y="186">04</text><text className="lbl k" x="668" y="186">TENANT ISOLATION</text><text className="lbl k" x="872" y="186" textAnchor="end">D</text></g>
            <g className="row pop"><text className="lbl" x="628" y="212">05</text><text className="lbl k" x="668" y="212">DURABLE WORKFLOWS</text><text className="lbl k" x="872" y="212" textAnchor="end">—</text></g>
            <text className="lbl k fade" x="620" y="258" style={{ fontSize: "8.5px" }}>STATUS · ISSUED FOR HIRE</text>
          </g>
          <g className="c6"><text className="hand pop" x="24" y="338">questions? send redlines</text><path className="ink t" d="M222 332 L282 346" pathLength={1} /></g>
          <g className="to"><path className="ink" d="M286 342 L314 342 L314 358 L300 372 L286 358 Z" pathLength={1} /><text className="lbl k fade" x="324" y="364">TO: YOU ↓</text></g>
          <Route id="r6a" d="M42 170 L96 170 C220 170 300 250 300 350" />
          <Dot at="42 170" />
        </svg>
      </div>
      <div className="cta-block">
        <p className="eyebrow">Issue to · open to backend / platform / infra / SRE roles</p>
        <div className="cta-row">
          <a className="btn-mail" href={`mailto:${profile.email}`}>
            <span className="hole" aria-hidden="true" />
            <span>Email me</span>
            <span className="arr" aria-hidden="true">
              →
            </span>
          </a>
          <a className="btn-cv" href={RESUME_HREF} download="KushalKrishnappa.pdf">
            Résumé <small>PDF</small>
          </a>
        </div>
        <div className="links">
          {socials().map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">
              {s.name} ↗<span>{s.handle}</span>
            </a>
          ))}
        </div>
      </div>
      <svg className="final-stamp" viewBox="0 0 330 140" aria-hidden="true">
        <Stamp
          className="st5"
          transform="translate(165 70) rotate(-9)"
          w={304}
          h={104}
          rx={8}
          irx={4}
          inset={10}
          borderStyle={{ strokeWidth: 4.5 }}
          title="ISSUED FOR HIRE"
          titleY={9}
          titleStyle={{ fontSize: "38px", letterSpacing: ".04em" }}
          sub="K. KRISHNAPPA · MS CS · MAY 2027"
          subY={30}
          subStyle={{ fontSize: "8px" }}
          hot
        />
      </svg>
    </Sheet>
  );
}

/**
 * Mobile-only continuation of sheet 06 (≤760px): the pinned stage has no room
 * for a form, so the RFI sits on its own unpinned paper below. Hidden on
 * desktop, where the form lives in the sheet's notes column.
 */
export function RfiSheet() {
  return (
    <section className="rfi-sheet" aria-labelledby="t6b">
      <div className="tear-shadow">
        <i />
      </div>
      <div className="paper-fringe" />
      <div className="paper-bg" style={{ "--bp": "60% 60%" } as CSSProperties} />
      <div className="rfi-inner">
        <p className="eyebrow">Sheet 06 · cont. · Transmittal</p>
        <h2 className="sheet-title" id="t6b">
          Request for information
        </h2>
        <ContactForm />
      </div>
    </section>
  );
}
