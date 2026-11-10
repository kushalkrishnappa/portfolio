"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { getLenis } from "@/app/components/motion/SmoothScroll";
import { useReducedMotion } from "@/app/components/motion/useReducedMotion";

/**
 * The through-lines of the work — the threads that connect every system,
 * role and project. Rendered as one flowing, full-bleed marquee.
 */
const THROUGH_LINES = [
  "MULTI-TENANCY",
  "TEMPORAL",
  "RELIABILITY",
  "AI-SDLC",
  "DISTRIBUTED SYSTEMS",
] as const;

// Number of identical units laid end-to-end in the track. One unit is wrapped
// seamlessly; the extras keep the viewport filled on wide screens.
const UNIT_COPIES = 4;

/** One full pass of the through-lines, filled/outlined in alternation. */
function MarqueeUnit({
  unitRef,
}: {
  unitRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={unitRef}
      aria-hidden="true"
      className="flex shrink-0 items-center"
    >
      {THROUGH_LINES.map((line, idx) => (
        <span key={`${line}-${idx}`} className="flex items-center">
          <span
            className="display select-none whitespace-nowrap font-black uppercase leading-none"
            style={{
              fontSize: "clamp(2.1rem, 8vw, 6.25rem)",
              letterSpacing: "-0.02em",
              // Alternate solid and hairline-outlined words for editorial rhythm.
              color: idx % 2 === 0 ? "var(--bone)" : "transparent",
              WebkitTextStroke:
                idx % 2 === 0 ? undefined : "1.4px var(--faint)",
            }}
          >
            {line}
          </span>
          <span
            aria-hidden="true"
            className="mx-6 select-none leading-none sm:mx-10"
            style={{
              color: "var(--accent)",
              fontSize: "clamp(1.4rem, 4vw, 3rem)",
              opacity: 0.85,
            }}
          >
            ·
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Statement() {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const unitRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const track = trackRef.current;
    const unit = unitRef.current;
    if (!track || !unit) return;

    let unitWidth = unit.getBoundingClientRect().width || 1;
    const measure = () => {
      unitWidth = unit.getBoundingClientRect().width || unitWidth;
    };
    window.addEventListener("resize", measure);

    const setX = gsap.quickSetter(track, "x", "px");
    // Base auto-scroll (px/sec, leftward) plus a scroll-velocity reaction.
    const BASE = 46;
    const VEL_FACTOR = 0.5;
    const VEL_MAX = 42;
    let x = 0;

    const tick = (_time: number, deltaMs: number) => {
      const lenis = getLenis();
      // Lenis exposes `velocity` (px/frame-ish); type defs vary, so read safely.
      const v = lenis ? (lenis as { velocity?: number }).velocity ?? 0 : 0;
      const velStep = Math.max(-VEL_MAX, Math.min(VEL_MAX, v * VEL_FACTOR));
      x -= BASE * (deltaMs / 1000) + velStep;
      // Wrap within one unit so the loop is seamless in both directions.
      x = ((x % unitWidth) + unitWidth) % unitWidth;
      setX(x - unitWidth);
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", measure);
    };
  }, [reducedMotion]);

  return (
    <section
      aria-label="Through-lines of the work"
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden border-y py-16 sm:py-24"
      style={{ borderColor: "var(--line)" }}
    >
      {/* Spoken content for assistive tech; the marquee itself is decorative. */}
      <p className="sr-only">
        Through-lines across the work: {THROUGH_LINES.join(", ").toLowerCase()}.
      </p>

      <p
        className="mono mb-9 px-5 text-center text-[11px] uppercase tracking-[0.3em] sm:mb-12 sm:px-8"
        style={{ color: "var(--faint)" }}
      >
        What runs through the work
      </p>

      <div
        ref={trackRef}
        className="flex w-max flex-nowrap items-center will-change-transform"
      >
        {Array.from({ length: UNIT_COPIES }).map((_, i) => (
          <MarqueeUnit key={i} unitRef={i === 0 ? unitRef : undefined} />
        ))}
      </div>

      {/* Edge fades so words dissolve into the band rather than hard-clip. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-40"
        style={{
          background:
            "linear-gradient(90deg, var(--bg) 0%, rgba(10,10,10,0) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-40"
        style={{
          background:
            "linear-gradient(270deg, var(--bg) 0%, rgba(10,10,10,0) 100%)",
        }}
      />
    </section>
  );
}
