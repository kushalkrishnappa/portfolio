import Leaf from "./Leaf";
import { generalData, generalDataMore, GENERAL_DATA_ID, MANUAL_DATE, MANUAL_REV, type DataStat } from "@/data/manual";

/** Format a counted value the way the band sets it (the motion hook uses the same rules). */
export function fmtStat(v: number, fmt: DataStat["fmt"]): string {
  if (fmt === "dec1") return v.toFixed(1);
  if (fmt === "mttr") {
    if (v >= 59.5) {
      let h = Math.floor(v / 60), m = Math.round(v - h * 60);
      if (m === 60) { h++; m = 0; }
      return `${h}h ${m < 10 ? "0" : ""}${m}m`;
    }
    return `${Math.round(v)} min`;
  }
  return Math.round(v).toLocaleString("en-US");
}

function Num({ from, to, fmt }: { from: number; to: number; fmt: DataStat["fmt"] }) {
  return (
    <span className="gd-c" data-from={from} data-to={to} data-fmt={fmt}>
      {fmtStat(to, fmt)}
    </span>
  );
}

/**
 * GENERAL DATA — the spec-summary band between the cover and sheet 01. An
 * unpinned leaf that sits under the cover: the cover lifts off it, the
 * request dot lands on its datum, the numbers count up, and sheet 01 slides
 * over it. Every figure links to the sheet that draws it.
 */
export default function GeneralData() {
  return (
    <Leaf
      id={GENERAL_DATA_ID}
      className="band"
      eyebrow="Sheet 00 · cont. · General data · Spec summary"
      title="General data"
      edge="torn"
      bp="55% 25%"
      z={0}
      shadeCover
      titleBlock={{
        no: "00",
        title: "General data",
        rev: MANUAL_REV,
        cells: [
          { label: "Drawn", value: "K. Krishnappa" },
          { label: "Date", value: MANUAL_DATE },
          { label: "Units", value: "As noted" },
        ],
      }}
    >
      <div className="gd">
        <span className="gd-datum" aria-hidden="true">
          <i />
        </span>
        <p className="gd-cap">
          <span>Spec summary · read before the sheets</span>
          <span className="gd-hand" aria-hidden="true">
            the numbers first. the drawings follow.
          </span>
        </p>
        <dl className="gd-grid">
          {generalData.map((s) => (
            <div className="gd-cell" key={s.k}>
              <dt>
                <span className="gd-k">{s.k}</span>
                <span className="gd-l">{s.label}</span>
                <a className="gd-go" href={`#${s.sheet}`} data-go={s.sheet} aria-label={`${s.label}: see the drawing`}>
                  {s.sheet.startsWith("appx") ? "APX B" : `SHT ${s.sheet.slice(1).padStart(2, "0")}`} <span aria-hidden="true">↗</span>
                </a>
              </dt>
              <dd>
                <span className="gd-n sheen">
                  {s.pre && <span className="gd-pre">{s.pre}</span>}
                  <Num from={s.from} to={s.to} fmt={s.fmt} />
                  {s.post}
                  {s.and && (
                    <>
                      {s.and.pre}
                      <Num from={s.and.from} to={s.and.to} fmt="int" />
                      {s.and.post}
                    </>
                  )}
                </span>
                <span className="gd-u">{s.unit}</span>
                <span className="gd-d">{s.note}</span>
              </dd>
            </div>
          ))}
        </dl>
        <dl className="gd-more">
          {generalDataMore.map((m) => (
            <div key={m.k}>
              <dt>
                <span className="gd-k">{m.k}</span>
                <a className="gd-go" href={`#${m.sheet}`} data-go={m.sheet}>
                  {`SHT ${m.sheet.slice(1).padStart(2, "0")}`} <span aria-hidden="true">↗</span>
                </a>
              </dt>
              <dd>
                <b>{m.v}</b>
                <span>{m.d}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Leaf>
  );
}
