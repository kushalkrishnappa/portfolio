import { Fragment } from "react";
import Leaf from "../Leaf";
import SpecTable from "../SpecTable";
import ClientPlate from "../ClientPlate";
import FieldNotesLog from "../FieldNotesLog";
import { rich } from "../rich";
import { appendices, APPENDIX_TOTAL, MANUAL_REV, PARTS_TOTAL, type AppendixMeta } from "@/data/manual";
import { skillGroups } from "@/data/skills";
import { education } from "@/data/education";
import { publications } from "@/data/publications";
import { certifications } from "@/data/certifications";
import { profile } from "@/data/profile";
import type { BlogPostMeta } from "@/types";

const pad2 = (n: number) => String(n).padStart(2, "0");
const meta = (letter: AppendixMeta["letter"]) => appendices.find((a) => a.letter === letter)!;

/**
 * An appendix: a Leaf (unpinned sheet) in the manual's stack. z 9 = above
 * sheet 09, below sheet 10; later appendices paint over earlier ones.
 */
function Appendix({ m, children }: { m: AppendixMeta; children: React.ReactNode }) {
  return (
    <Leaf
      id={m.id}
      className={`appx appx-${m.letter.toLowerCase()}`}
      eyebrow={m.eyebrow}
      title={m.title}
      edge={m.edge}
      bp={m.bp}
      z={9}
      titleBlock={{ no: m.letter, noLabel: "Appendix", of: APPENDIX_TOTAL, title: m.title, rev: MANUAL_REV, cells: m.titleCells }}
    >
      {children}
    </Leaf>
  );
}

/** The headline stack (profile chips) — these parts are underlined in the BOM. */
const PRIMARY = new Set(profile.chips);
const primaryParts = skillGroups.flatMap((g) => g.skills).filter((s) => PRIMARY.has(s));

/** Appendix A · Parts list — the skills as a bill of materials, one assembly per row. */
function PartsList() {
  const m = meta("A");
  return (
    <Appendix m={m}>
      <div className="leaf-grid">
        <aside className="leaf-notes">
          <SpecTable
            caption="Schedule A — Summary"
            rows={[
              ["Primary", primaryParts.join(" · ")],
              ["Assemblies", pad2(skillGroups.length)],
              ["Parts", pad2(PARTS_TOTAL)],
            ]}
          />
          <div className="gnotes">
            <h3>General notes</h3>
            <ol>
              {[
                "Parts are grouped into **assemblies** by the layer of the stack they serve.",
                "**Primary parts** are underlined in the list.",
                "**Qty** is the number of parts in each assembly.",
              ].map((n) => (
                <li key={n} data-note>
                  {rich(n)}
                </li>
              ))}
            </ol>
          </div>
        </aside>
        <div className="leaf-main">
          <p className="hand-note" aria-hidden="true">
            underlined = primary
          </p>
          <div className="bom" role="table" aria-label="Parts list: skills by assembly">
            <div className="bom-h" role="row" data-row>
              <span role="columnheader">Item</span>
              <span role="columnheader">Assembly</span>
              <span role="columnheader">Parts</span>
              <span role="columnheader" className="bom-q">
                Qty
              </span>
            </div>
            {skillGroups.map((g, i) => (
              <div className="bom-r" role="row" data-row key={g.label}>
                <span role="cell" className="bom-i">
                  <span className="balloon">{pad2(i + 1)}</span>
                </span>
                <span role="cell" className="bom-a">
                  {g.label}
                </span>
                <span role="cell" className="bom-p">
                  {g.skills.map((s, j) => (
                    <Fragment key={s}>
                      {j > 0 && (
                        <span className="sep" aria-hidden="true">
                          {"\u00a0· "}
                        </span>
                      )}
                      {j > 0 && <span className="vh">, </span>}
                      {PRIMARY.has(s) ? <b className="hl">{s}</b> : <span>{s}</span>}
                    </Fragment>
                  ))}
                </span>
                <span role="cell" className="bom-q">
                  {pad2(g.skills.length)}
                </span>
              </div>
            ))}
            <div className="bom-t" role="row" data-row>
              <span role="cell" className="bom-tl">
                Total · {pad2(skillGroups.length)} assemblies
              </span>
              <span role="cell" className="bom-q bom-tq">
                {PARTS_TOTAL}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Appendix>
  );
}

/** Appendix B · Specifications — education, the IEEE publication, certifications. */
function Specifications() {
  const m = meta("B");
  const [ms, ...prior] = education;
  const pub = publications[0];
  return (
    <Appendix m={m}>
      <div className="leaf-grid leaf-grid-2">
        <div className="spec-col">
          <h3 className="cap">Spec B.1 — Education</h3>
          <article className="deg deg-ms">
            <div className="deg-head" data-row>
              <ClientPlate client="northeastern" plate="B.1" role="School" />
              <div className="deg-id">
                <p className="deg-n">{ms.degree}</p>
                <p className="deg-s">{ms.school}</p>
              </div>
            </div>
            <dl className="kv">
              <div data-row>
                <dt>Period</dt>
                <dd>{ms.period}</dd>
              </div>
              {ms.gpa && (
                <div data-row>
                  <dt>GPA</dt>
                  <dd>
                    <b className="hl">{ms.gpa.replace("/", " / ")}</b>
                  </dd>
                </div>
              )}
              <div data-row>
                <dt>Coursework</dt>
                <dd>{ms.coursework.join(" · ")}</dd>
              </div>
              {ms.projects && (
                <div data-row>
                  <dt>Projects</dt>
                  <dd>
                    <ul className="kv-list">
                      {ms.projects.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>
          </article>
          {prior.map((e) => (
            <article className="deg" key={e.degree}>
              <div className="deg-head" data-row>
                <div className="deg-id">
                  <p className="deg-n">{e.degree}</p>
                  <p className="deg-s">{e.school}</p>
                </div>
              </div>
              <dl className="kv">
                <div data-row>
                  <dt>Period</dt>
                  <dd>{e.period}</dd>
                </div>
                <div data-row>
                  <dt>Coursework</dt>
                  <dd>{e.coursework.join(" · ")}</dd>
                </div>
                {e.research && (
                  <div data-row>
                    <dt>Research</dt>
                    <dd>
                      <ul className="kv-list">
                        {e.research.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
                {e.honors && (
                  <div data-row>
                    <dt>Honors</dt>
                    <dd>{e.honors}</dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </div>
        <div className="spec-col">
          <h3 className="cap">Spec B.2 — Publication</h3>
          <article className="pub" data-row>
            <p className="pub-v">
              {pub.venue.split(" ").map((w) => (
                <span key={w} className="sheen">
                  {w}
                </span>
              ))}
              <span className="pub-y">{pub.year}</span>
            </p>
            <div className="pub-b">
              <p className="pub-t">
                {pub.url ? (
                  <a href={pub.url} target="_blank" rel="noopener noreferrer">
                    {pub.title} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  pub.title
                )}
              </p>
              <p className="pub-d">{pub.description}</p>
            </div>
          </article>
          <h3 className="cap cap-2">Spec B.3 — Certifications</h3>
          <ol className="certs">
            {certifications.map((c, i) => (
              <li key={c.name} data-row>
                <span className="cert-n">{`B.3.${i + 1}`}</span>
                <span className="cert-t">
                  {c.featured ? <b className="hl">{c.name}</b> : c.name}
                  {(c.issuer || c.date) && <span className="cert-m">{[c.issuer, c.date].filter(Boolean).join(" · ")}</span>}
                </span>
                {c.url ? (
                  <a className="cert-v" href={c.url} target="_blank" rel="noopener noreferrer" aria-label={`Verify ${c.name}`}>
                    Verify <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="cert-v" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Appendix>
  );
}

/** Appendix C · Field notes — the latest posts from the blog manifest, as a drafting log. */
function FieldNotes({ posts, total }: { posts: BlogPostMeta[]; total: number }) {
  const m = meta("C");
  return (
    <Appendix m={m}>
      <div className="leaf-grid">
        <aside className="leaf-notes">
          <SpecTable
            caption="Schedule C — Log"
            rows={[
              ["Entries", total ? pad2(total) : "None filed yet"],
              ["Latest", posts[0]?.date || "—"],
              ["Subjects", "Distributed systems · infrastructure · security"],
            ]}
          />
          {posts.length > 0 && (
            <p className="leaf-more" data-row>
              <a href="/blogs">
                All field notes <span aria-hidden="true">→</span>
              </a>
            </p>
          )}
        </aside>
        <div className="leaf-main">
          <FieldNotesLog posts={posts} total={total} />
        </div>
      </div>
    </Appendix>
  );
}

interface AppendicesProps {
  /** Latest posts (newest first) for Appendix C, fetched server-side. */
  posts: BlogPostMeta[];
  /** Total posts in the manifest. */
  total: number;
}

/** Appendices A · Parts list, B · Specifications, C · Field notes (between sheets 09 and 10). */
export default function Appendices({ posts, total }: AppendicesProps) {
  return (
    <>
      <PartsList />
      <Specifications />
      <FieldNotes posts={posts} total={total} />
    </>
  );
}
