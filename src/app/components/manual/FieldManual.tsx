"use client";

import { useRef, type ReactNode } from "react";
import "./field-manual.css";
import { fmFontVars } from "./fonts";
import { SheenDefs, SvgDefs } from "./SvgDefs";
import Chrome from "./Chrome";
import SheetIndex from "./SheetIndex";
import Cover from "./sheets/Cover";
import Ingestion from "./sheets/Ingestion";
import Fleet from "./sheets/Fleet";
import Rollout from "./sheets/Rollout";
import Tenant from "./sheets/Tenant";
import Workflows from "./sheets/Workflows";
import Contact, { RfiSheet } from "./sheets/Contact";
import { useFieldManual } from "./motion/useFieldManual";

interface FieldManualProps {
  /**
   * APPENDICES SLOT — A · Parts list, B · Specifications, C · Field notes
   * (sheets/Appendices.tsx; page.tsx passes them in with the server-fetched
   * blog posts). Rendered between sheet 05 and sheet 06: same paper and title
   * block, NOT pinned.
   */
  appendices?: ReactNode;
}

/** The homepage: a field manual of drafting sheets, 00 Cover → 06 Issued for hire. */
export default function FieldManual({ appendices }: FieldManualProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useFieldManual(rootRef);
  return (
    <div className={`fm ${fmFontVars}`} ref={rootRef}>
      <SvgDefs />
      <Chrome />
      <SheetIndex />
      <Cover />
      <main>
        <Ingestion />
        <Fleet />
        <Rollout />
        <Tenant />
        <Workflows />
        {appendices}
        <Contact />
        <RfiSheet />
      </main>
      <SheenDefs />
    </div>
  );
}
