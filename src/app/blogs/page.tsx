import type { Metadata } from "next";
import "@/app/components/manual/field-manual.css";
import { fmFontVars } from "@/app/components/manual/fonts";
import { SvgDefs } from "@/app/components/manual/SvgDefs";
import { PageChrome } from "@/app/components/manual/Chrome";
import Leaf from "@/app/components/manual/Leaf";
import SpecTable from "@/app/components/manual/SpecTable";
import FieldNotesLog from "@/app/components/manual/FieldNotesLog";
import { getAllPosts } from "@/lib/blog";
import { APPENDIX_TOTAL, MANUAL_REV } from "@/data/manual";

const DESCRIPTION = "Writing on distributed systems, infrastructure automation, and security.";

export const metadata: Metadata = {
  title: "Field notes",
  description: DESCRIPTION,
};

/**
 * /blogs — "Field Notes": the full log of posts from the blog manifest, on the
 * Field Manual's paper as an expanded Appendix C. Each entry links out to the
 * post (same links as before); an empty or failed manifest shows a quiet line.
 */
export default async function BlogIndex() {
  const posts = await getAllPosts();
  const n = posts.length;
  return (
    <div className={`fm fn-page ${fmFontVars}`}>
      <SvgDefs />
      <PageChrome />
      <main>
        <Leaf
          id="field-notes"
          as="h1"
          eyebrow="Appendix C · Field notes · Complete log"
          title="Field notes"
          bp="50% 80%"
          titleBlock={{
            no: "C",
            noLabel: "Appendix",
            of: APPENDIX_TOTAL,
            title: "Field notes",
            rev: MANUAL_REV,
            cells: [
              { label: "Drawn", value: "K. Krishnappa" },
              { label: "Entries", value: n ? String(n).padStart(2, "0") : "None" },
              { label: "Status", value: "Open" },
            ],
          }}
        >
          <div className="leaf-grid">
            <aside className="leaf-notes">
              <SpecTable
                caption="Schedule C — Log"
                rows={[
                  ["Subjects", "Distributed systems · infrastructure automation · security"],
                  ["Entries", n ? String(n).padStart(2, "0") : "None filed yet"],
                  ["Latest", posts[0]?.date || "—"],
                ]}
              />
              <p className="leaf-more" data-row>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full load for the manual's motion gate */}
                <a href="/">
                  <span aria-hidden="true">←</span> Back to the manual
                </a>
              </p>
            </aside>
            <div className="leaf-main">
              <FieldNotesLog
                posts={posts}
                tags
                emptyLink={false}
                emptyNote="First entries on distributed systems, infrastructure automation and security are in progress."
              />
            </div>
          </div>
        </Leaf>
      </main>
    </div>
  );
}
