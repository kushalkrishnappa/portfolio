import type { CSSProperties, ReactNode } from "react";
import Zones from "./Zones";
import TitleBlock from "./TitleBlock";
import ClientPlate from "./ClientPlate";
import type { SheetMeta } from "@/data/manual";

interface SheetProps {
  meta: SheetMeta;
  z: number;
  className?: string;
  /** Sheet 01 carries an extra shade that the lifting cover casts. */
  shadeCover?: boolean;
  /** Heading text when it differs from the title-block title (sheet 06). */
  heading?: string;
  children: ReactNode;
}

/**
 * A pinned drafting sheet: tall scroll section with a sticky 100vh stage that
 * holds the paper (torn/deckled top edge, clipped by the motion hook), the
 * frame with zone markers, the sheet header, its content and title block.
 */
export default function Sheet({ meta, z, className, shadeCover, heading, children }: SheetProps) {
  const n = String(Number(meta.no));
  const style = { "--h": meta.height, zIndex: z } as CSSProperties;
  return (
    <section
      className={["sheet", meta.client && "has-plate", className].filter(Boolean).join(" ")}
      id={meta.id}
      style={style}
      aria-labelledby={`t${n}`}
      data-edge={meta.edge}
    >
      <div className="stage">
        <div className="tear-shadow">
          <i />
        </div>
        <div className="paper-fringe" />
        <div className="paper-bg" style={{ "--bp": meta.bp } as CSSProperties} />
        <div className="frame">
          <Zones />
          <header className={meta.client ? "sheet-head has-plate" : "sheet-head"}>
            <p className="eyebrow">{meta.eyebrow}</p>
            {meta.client ? (
              <div className="head-row">
                <h2 className="sheet-title" id={`t${n}`}>
                  {heading ?? meta.title}
                </h2>
                <ClientPlate client={meta.client} plate={meta.no} />
              </div>
            ) : (
              <h2 className="sheet-title" id={`t${n}`}>
                {heading ?? meta.title}
              </h2>
            )}
          </header>
          {children}
          <TitleBlock no={meta.no} title={meta.title} rev={meta.rev} cells={meta.titleCells} client={meta.client} />
        </div>
        {shadeCover && <div className="shade-cover" />}
        <div className="shade" />
      </div>
    </section>
  );
}
