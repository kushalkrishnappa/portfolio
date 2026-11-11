import "@/app/components/manual/field-manual.css";
import { fmFontVars } from "@/app/components/manual/fonts";
import { SvgDefs } from "@/app/components/manual/SvgDefs";
import { PageChrome } from "@/app/components/manual/Chrome";
import Leaf from "@/app/components/manual/Leaf";
import { MANUAL_REV } from "@/data/manual";

/** 404 — a sheet that is not in the issued set, on the manual's paper. */
export default function NotFound() {
  return (
    <div className={`fm fn-page ${fmFontVars}`}>
      <SvgDefs />
      <PageChrome />
      <main>
        <Leaf
          id="not-found"
          as="h1"
          eyebrow="Error 404 · Sheet not in the issued set"
          title="Sheet missing"
          bp="20% 40%"
          titleBlock={{
            no: "—",
            title: "Sheet missing",
            rev: MANUAL_REV,
            cells: [
              { label: "Drawn", value: "K. Krishnappa" },
              { label: "Status", value: "404" },
              { label: "Scale", value: "NTS" },
            ],
          }}
        >
          <p className="log-none nf" data-row>
            <span>This page is not part of the field manual.</span>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full load for the manual's motion gate */}
            <a href="/">
              Back to the manual <span aria-hidden="true">→</span>
            </a>
          </p>
        </Leaf>
      </main>
    </div>
  );
}
