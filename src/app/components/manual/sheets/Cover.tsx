import type { CSSProperties } from "react";
import Zones from "../Zones";
import TitleBlock from "../TitleBlock";
import CompanyMark from "../CompanyMark";
import { profile } from "@/data/profile";
import { coverRevisions, MANUAL_DATE, MANUAL_REV } from "@/data/manual";

function Chars({ word }: { word: string }) {
  return (
    <>
      {Array.from(word).map((c, i) => (
        <span key={i} className="ch">
          {c}
        </span>
      ))}
    </>
  );
}

/** Sheet 00 · Cover: the name reveal, role, tagline, revisions and title block. */
export default function Cover() {
  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");
  return (
    <>
      <div className="cover" id="cover">
        <div className="tear-shadow">
          <i />
        </div>
        <div className="paper-fringe" />
        <div className="paper-bg" style={{ "--bp": "30% 10%" } as CSSProperties} />
        <div className="frame">
          <Zones />
          <p className="eyebrow cover-eyebrow">Field manual · Sheet 00 / 06 · Cover</p>
          <h1 className="name" id="top" aria-label={profile.name}>
            <span className="nline" aria-hidden="true">
              <span className="guides">
                <i className="g-cap" />
                <i className="g-base" />
              </span>
              <span className="cap-dim">
                <b>Cap ht.</b>
              </span>
              <span className="word">
                <Chars word={first} />
              </span>
            </span>
            <span className="nline" aria-hidden="true">
              <span className="guides">
                <i className="g-cap" />
                <i className="g-base" />
              </span>
              <span className="word">
                <Chars word={last} />
              </span>
              <span className="dot-anchor" />
              <span className="dot-note">this is a request. follow it.</span>
            </span>
          </h1>
          <div className="cover-sub">
            <p className="role">{profile.role}</p>
            <p className="tagline">{profile.tagline}</p>
          </div>
          <div className="scroll-cue" aria-hidden="true">
            Scroll to unfold
            <i />
          </div>
          <table className="revs">
            <caption>Revisions</caption>
            <tbody>
              <tr>
                <th>Rev</th>
                <th className="rv-m">
                  <span className="vh">Client</span>
                </th>
                <th>Description</th>
                <th>Date</th>
              </tr>
              {coverRevisions.map((r) => (
                <tr key={r.rev}>
                  <td>{r.rev}</td>
                  <td className="rv-m">
                    <CompanyMark name={r.client} size="rev" />
                  </td>
                  <td>{r.description}</td>
                  <td>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <TitleBlock
            no="00"
            title="Cover sheet"
            rev={MANUAL_REV}
            cells={[
              { label: "Drawn", value: "K. Krishnappa" },
              { label: "Date", value: MANUAL_DATE },
              { label: "Scale", value: "1 : 1" },
            ]}
          />
        </div>
      </div>
      <div id="herodot" aria-hidden="true">
        <i className="h" />
        <i className="c" />
      </div>
    </>
  );
}
