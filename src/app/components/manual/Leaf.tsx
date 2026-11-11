import type { CSSProperties, ReactNode } from "react";
import Zones from "./Zones";
import TitleBlock from "./TitleBlock";
import type { TitleCell } from "@/data/manual";

interface LeafProps {
  id?: string;
  className?: string;
  eyebrow: string;
  title: string;
  /** Heading level: h2 inside the manual, h1 when the leaf is the page (/blogs). */
  as?: "h1" | "h2";
  edge?: "torn" | "deckle";
  /** Paper blotch offset (background-position). */
  bp: string;
  z?: number;
  /** The shade the lifting cover casts (the general-data band, the first leaf under the cover). */
  shadeCover?: boolean;
  titleBlock: {
    no: string;
    noLabel?: string;
    of?: string;
    title: string;
    rev: string;
    cells: [TitleCell, TitleCell, TitleCell];
  };
  children: ReactNode;
}

/**
 * A LEAF — an unpinned drafting sheet: the same paper, frame, zone markers,
 * header and title block as a pinned Sheet, but as tall as its content.
 * Used for the appendices (inside the manual) and for /blogs.
 *
 * Inside the live manual (html.fm-live) a leaf stacks like a sheet: it slides
 * over its predecessor, and its stage sticks once its end is reached so the
 * next sheet can slide over it in turn (the motion hook sets the stage's
 * negative sticky `top`; `.leaf-tail` adds the 100vh of overlap).
 */
export default function Leaf({ id, className, eyebrow, title, as: H = "h2", edge, bp, z, shadeCover, titleBlock, children }: LeafProps) {
  const titleId = `t-${id ?? "leaf"}`;
  return (
    <section
      className={["leaf", className].filter(Boolean).join(" ")}
      id={id}
      aria-labelledby={titleId}
      data-edge={edge}
      style={z === undefined ? undefined : { zIndex: z }}
    >
      <div className="leaf-stage">
        <div className="tear-shadow">
          <i />
        </div>
        <div className="paper-fringe" />
        <div className="paper-bg" style={{ "--bp": bp } as CSSProperties} />
        <div className="frame">
          <Zones />
          <header className="leaf-head">
            <p className="eyebrow">{eyebrow}</p>
            <H className="sheet-title" id={titleId}>
              {title}
            </H>
          </header>
          <div className="leaf-body">{children}</div>
          <TitleBlock {...titleBlock} />
        </div>
        {shadeCover && <div className="shade-cover" />}
        <div className="shade" />
      </div>
      <div className="leaf-tail" aria-hidden="true" />
    </section>
  );
}
