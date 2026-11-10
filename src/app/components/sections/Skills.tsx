"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { skillGroups } from "@/data/skills";
import SectionHeader from "@/app/components/SectionHeader";
import { getLenis } from "@/app/components/motion/SmoothScroll";
import { useReducedMotion } from "@/app/components/motion/useReducedMotion";

/**
 * Skills — a living, flowing field, not a chip grid.
 *
 * Each SkillGroup is a row: a fixed mono label on the left and, to the right, a
 * horizontal marquee of that group's skills (big display words, accent-dot
 * separated). Rows alternate scroll direction and the drift is velocity-aware —
 * it speeds and nudges with Lenis scroll, then settles back to a slow base.
 *
 * Reduced motion / no-JS / SSR: each track renders once, wrapping (flex-wrap),
 * so every skill is fully visible and legible with no clipping and no motion.
 * The marquee effect only runs when motion is allowed: it switches the track to
 * a single line, clones the unit to fill the viewport, and drives the drift on
 * the GSAP ticker. All of it is torn down on unmount. A visually-hidden list
 * carries the same skills for assistive tech.
 */
export default function Skills() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const root = rootRef.current;
    if (!root) return;

    const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root);
    const tickers: Array<(time: number, deltaMs: number) => void> = [];
    const cleanups: Array<() => void> = [];

    rows.forEach((row, i) => {
      const viewport = row.querySelector<HTMLElement>("[data-viewport]");
      const track = row.querySelector<HTMLElement>("[data-track]");
      const unit = row.querySelector<HTMLElement>("[data-unit]");
      if (!viewport || !track || !unit) return;

      // Switch from the wrapping fallback to a single-line marquee: the track
      // stops wrapping and the unit stops shrinking so it keeps its full width.
      track.style.flexWrap = "nowrap";
      track.style.width = "max-content";
      unit.style.flexShrink = "0";

      const unitWidth = unit.getBoundingClientRect().width || 1;
      const viewWidth = viewport.getBoundingClientRect().width || 1;

      // Clone the unit enough times to overflow the viewport (seamless wrap).
      const copies = Math.max(2, Math.ceil(viewWidth / unitWidth) + 1);
      const clones: HTMLElement[] = [];
      for (let c = 1; c < copies; c++) {
        const clone = unit.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
        clones.push(clone);
      }

      const dir = i % 2 === 0 ? -1 : 1; // alternate direction per row
      const BASE = 34; // px/sec base drift
      const VEL_FACTOR = 0.45;
      const VEL_MAX = 40;
      const setX = gsap.quickSetter(track, "x", "px");
      // Start odd (rightward) rows shifted left by one unit so there's no gap.
      let x = dir === 1 ? -unitWidth : 0;

      const tick = (_time: number, deltaMs: number) => {
        const lenis = getLenis();
        const v = lenis ? (lenis as { velocity?: number }).velocity ?? 0 : 0;
        const velStep = Math.max(-VEL_MAX, Math.min(VEL_MAX, v * VEL_FACTOR));
        x += dir * (BASE * (deltaMs / 1000)) + dir * Math.abs(velStep);
        // Wrap within one unit so the loop is seamless in both directions.
        x = ((x % unitWidth) + unitWidth) % unitWidth;
        setX(x - unitWidth);
      };
      gsap.ticker.add(tick);
      tickers.push(tick);

      cleanups.push(() => {
        gsap.ticker.remove(tick);
        clones.forEach((clone) => clone.remove());
        gsap.set(track, { x: 0 });
        track.style.flexWrap = "";
        track.style.width = "";
        unit.style.flexShrink = "";
      });
    });

    return () => {
      tickers.forEach((t) => gsap.ticker.remove(t));
      cleanups.forEach((fn) => fn());
    };
  }, [reducedMotion]);

  return (
    <section id="skills" className="mb-16 sm:mb-24">
      <SectionHeader index="04" title="SKILLS" />

      <div
        ref={rootRef}
        className="border-t"
        style={{ borderColor: "var(--line)" }}
      >
        {skillGroups.map((group, i) => (
          <div
            key={group.label}
            data-row
            className="grid items-center gap-x-6 gap-y-3 border-b py-6 sm:py-7 md:grid-cols-[180px_1fr] md:gap-x-8"
            style={{ borderColor: "var(--line)" }}
          >
            {/* Fixed mono label at left. */}
            <div
              className="mono text-[11px] uppercase leading-snug tracking-[0.18em]"
              style={{ color: "var(--dim)" }}
            >
              <span style={{ color: "var(--accent)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>{" "}
              {group.label}
            </div>

            {/* Marquee viewport. Wraps by default (no-JS / reduced-motion). */}
            <div data-viewport className="relative min-w-0 overflow-hidden">
              {/* Accessible list of the same skills. */}
              <span className="sr-only">
                {group.label}: {group.skills.join(", ")}.
              </span>

              <div
                data-track
                aria-hidden="true"
                className="flex flex-wrap items-center gap-x-0 gap-y-2 will-change-transform"
              >
                <div data-unit className="flex flex-wrap items-center">
                  {group.skills.map((skill, s) => (
                    <span key={`${skill}-${s}`} className="flex items-center">
                      <span
                        className="display select-none whitespace-nowrap font-semibold leading-none"
                        style={{
                          fontSize: "clamp(1.25rem, 2.6vw, 2rem)",
                          letterSpacing: "-0.01em",
                          color: "var(--bone)",
                        }}
                      >
                        {skill}
                      </span>
                      <span
                        aria-hidden="true"
                        className="mx-5 select-none leading-none sm:mx-7"
                        style={{
                          color: "var(--accent)",
                          fontSize: "clamp(0.9rem, 2vw, 1.4rem)",
                          opacity: 0.8,
                        }}
                      >
                        ·
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Edge fades so words dissolve at the rails while scrolling. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16"
                style={{
                  background:
                    "linear-gradient(90deg, var(--bg) 0%, rgba(10,10,10,0) 100%)",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16"
                style={{
                  background:
                    "linear-gradient(270deg, var(--bg) 0%, rgba(10,10,10,0) 100%)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
