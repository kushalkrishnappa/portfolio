import Image from "next/image";
import type { CSSProperties } from "react";
import type { MarkName } from "@/data/manual";

export type { MarkName };

/**
 * CompanyMark — an employer's (or the school's) official logo, rendered PURE: the original,
 * unmodified file from `public/logos/<name>.svg`, in its own colours, on a
 * solid chip of its native background ("the logo's own ground"), like a
 * manufacturer's nameplate fixed to the drawing.
 *
 * Rules (brand): never recolour, crop, stretch, filter, blend, mask, clip or
 * fade the logo itself; it keeps its aspect ratio (object-fit: contain).
 * Animate the plate around it, never the mark.
 */
interface MarkDef {
  label: string;
  src: string;
  /** Intrinsic size from the file's viewBox. */
  w: number;
  h: number;
  /** The chip: the logo's native background colour. */
  ground: string;
}

const MARKS: Record<MarkName, MarkDef> = {
  mercedes: { label: "Mercedes-Benz", src: "/logos/mercedes.svg", w: 64, h: 64, ground: "#000" },
  everpure: { label: "Everpure (Pure Storage)", src: "/logos/everpure.svg", w: 177, h: 31, ground: "#fff" },
  rooncyber: { label: "RoonCyber", src: "/logos/rooncyber.svg", w: 675, h: 66, ground: "#fff" },
  // Official lockup (red N, white wordmark), shown on its native black ground.
  northeastern: { label: "Northeastern University", src: "/logos/northeastern.svg", w: 486, h: 180, ground: "#000" },
};

/**
 * Optical fit: logo height as a share of the chip's height, tuned by eye so the
 * three marks read at equal visual weight inside identical chips. A wide mark
 * is additionally capped at the chip width minus its clear space
 * (object-fit: contain inside that box — never stretched).
 */
export const LOGO_FIT: Record<MarkName, number> = {
  mercedes: 0.82,
  everpure: 0.52,
  rooncyber: 0.4,
  northeastern: 0.9,
};

/** Chip contexts. Every chip in one context has the SAME outer box. */
export type ChipSize = "plate" | "rev" | "tb";

export function markLabel(name: MarkName): string {
  return MARKS[name].label;
}

interface CompanyMarkProps {
  name: MarkName;
  /** Which fixed chip box to use (sizes live in field-manual.css, `.chip-<size>`). */
  size: ChipSize;
  className?: string;
}

/**
 * The logo on its native-colour chip. The chip is a fixed box per context with
 * a 1px --ink3 hairline (so the black Mercedes chip still reads on our ground);
 * the logo is centred inside it with object-fit: contain.
 */
export default function CompanyMark({ name, size, className }: CompanyMarkProps) {
  const m = MARKS[name];
  return (
    <span
      className={["chip", `chip-${size}`, `chip-${name}`, className].filter(Boolean).join(" ")}
      style={{ "--fit": LOGO_FIT[name], background: m.ground } as CSSProperties}
    >
      <Image
        className="chip-logo"
        src={m.src}
        alt={m.label}
        width={m.w}
        height={m.h}
        unoptimized
        draggable={false}
        loading="eager"
      />
    </span>
  );
}
