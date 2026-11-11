import type { CSSProperties } from "react";

/**
 * Shared SVG vocabulary for the sheet drawings.
 *
 * Route — an invisible path the request dot travels along. Unless `noTrail`,
 * it is preceded by its orange `.trail` (drawn behind the dot as it moves);
 * the motion hook finds a route's trail as its previous sibling.
 */
export function Route({ id, d, hop, noTrail }: { id?: string; d: string; hop?: boolean; noTrail?: boolean }) {
  return (
    <>
      {!noTrail && <path className="trail" d={d} pathLength={1} />}
      <path className={hop ? "route hop" : "route"} id={id} d={d} data-notrail={noTrail ? "1" : undefined} />
    </>
  );
}

/** The protagonist: the orange request dot. `at` = its initial "x y". */
export function Dot({ at }: { at: string }) {
  return (
    <g className="dot" transform={`translate(${at})`}>
      <circle className="halo" r="14" />
      <circle className="core" r="6.5" />
    </g>
  );
}

interface StampProps {
  className: string;
  transform: string;
  w: number;
  h: number;
  /** Inner-border inset (v3 uses 8, 7 or 10). */
  inset?: number;
  rx?: number;
  irx?: number;
  title: string;
  titleY: number;
  titleStyle?: CSSProperties;
  sub?: string;
  subY?: number;
  subStyle?: CSSProperties;
  borderStyle?: CSSProperties;
  /** Orange (Heat) stamp that breathes between the two accents. */
  hot?: boolean;
}

/** A rubber drafting stamp. It thunks down (`.st-in`) and throws a ring. */
export function Stamp({
  className,
  transform,
  w,
  h,
  inset = 8,
  rx = 6,
  irx = 3,
  title,
  titleY,
  titleStyle,
  sub,
  subY,
  subStyle,
  borderStyle,
  hot,
}: StampProps) {
  const x = -w / 2;
  const y = -h / 2;
  return (
    <g className={`stamp${hot ? " o" : ""} ${className}`} transform={transform}>
      <g className="st-in">
        <g filter="url(#stampTex)">
          <rect className="st-b" x={x} y={y} width={w} height={h} rx={rx} style={borderStyle} />
          <rect className="st-b2" x={x + inset} y={y + inset} width={w - 2 * inset} height={h - 2 * inset} rx={irx} />
          <text className="st-t" x="0" y={titleY} textAnchor="middle" style={titleStyle}>
            {title}
          </text>
          {sub && (
            <text className="st-s" x="0" y={subY} textAnchor="middle" style={subStyle}>
              {sub}
            </text>
          )}
        </g>
      </g>
      <rect className="st-ring" x={x} y={y} width={w} height={h} rx={rx} />
    </g>
  );
}
