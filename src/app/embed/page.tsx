import type { Metadata } from "next";
import "@/app/components/manual/field-manual.css";
import { fmFontVars } from "@/app/components/manual/fonts";
import Zones from "@/app/components/manual/Zones";
import { profile } from "@/data/profile";
import { MANUAL_PROJECT, MANUAL_REV, SHEET_TOTAL } from "@/data/manual";

// Standalone signature for iframe embedding (recruiter messages, email, etc.):
// a cropped Field Manual cover. Self-contained: no nav, no scroll, no Lenis,
// no pinning; the only motion is the name settling in (off under reduced
// motion). Fluid sizing keeps the one-line name dominant from ~600×200 up.
export const metadata: Metadata = {
  title: "Signature",
  description: `${profile.name} — ${profile.role}`,
  robots: { index: false, follow: false },
};

const SITE_URL = "https://kushalkrishnappa.com";

export default function EmbedSignature() {
  const [first, ...rest] = profile.name.split(" ");
  return (
    <main className={`fm emb ${fmFontVars}`}>
      <div className="paper-bg" />
      <div className="emb-frame">
        <Zones />
        <p className="eyebrow">Field manual · Sheet 00 · Signature</p>
        <a className="emb-name" href={SITE_URL} target="_blank" rel="noopener noreferrer" aria-label={`${profile.name} — open the field manual`}>
          <span className="w">{first}</span>
          <span className="w">
            {rest.join(" ")}
            <i className="emb-dot" aria-hidden="true" />
          </span>
        </a>
        <div className="emb-sub">
          <p className="role">{profile.role}</p>
          <p className="emb-now">{profile.nowLine}</p>
        </div>
        <div className="emb-tb">
          <div className="c opt">
            <span>Project</span>
            <b>{MANUAL_PROJECT}</b>
          </div>
          <div className="c big">
            <span>Sheet</span>
            <b>
              00<small>/{SHEET_TOTAL}</small>
            </b>
          </div>
          <div className="c big">
            <span>Rev</span>
            <b>{MANUAL_REV}</b>
          </div>
          <div className="c">
            <span>Issued</span>
            <b>
              <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
                kushalkrishnappa.com ↗
              </a>
            </b>
          </div>
        </div>
      </div>
    </main>
  );
}
