"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { experiences } from "@/data/experience";
import SectionHeader from "@/app/components/SectionHeader";
import { useReducedMotion } from "@/app/components/motion/useReducedMotion";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Experience — one continuous signal-trace timeline.
 *
 * The three roles (RoonCyber → Pure Storage/Everpure → Mercedes-Benz) hang off a
 * single vertical "signal line" that runs the full height of the section. A faint
 * ghost track is always present; over it a brighter trace draws itself top-to-bottom
 * (strokeDashoffset, scrubbed to the section's scroll) while a glowing accent packet
 * travels down the line. Each role's node lights (an accent core pops into its ring)
 * as the trace reaches it, and that role's content reveals in sequence beside it.
 *
 * Editorial layout: the line sits in a generous left margin; all content flows right
 * of it — no boxed cards. Strong type hierarchy, one accent, airy spacing.
 *
 * Reduced motion / no-JS / SSR: the default markup IS the final state — line fully
 * drawn, every node lit, all text present and opaque. The motion effect only runs
 * when motion is allowed: it sets the start states before paint (no flash) and lives
 * in a single gsap.context reverted on unmount. No pins, no hidden content, no shift.
 */
export default function Experience() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const trace = root.querySelector<SVGPathElement>("[data-trace]");
      const flow = root.querySelector<SVGPathElement>("[data-flow]");
      const roles = gsap.utils.toArray<HTMLElement>("[data-role]", root);

      // --- Start states (set before paint; no flash). ---------------------
      if (trace) gsap.set(trace, { strokeDashoffset: 1 });
      if (flow) gsap.set(flow, { opacity: 0 });
      roles.forEach((role) => {
        const blocks = gsap.utils.toArray<HTMLElement>("[data-rev]", role);
        const core = role.querySelector<HTMLElement>("[data-core]");
        gsap.set(blocks, { opacity: 0, y: 22 });
        if (core) gsap.set(core, { opacity: 0, scale: 0 });
      });

      // --- The trace draws itself along the whole section as you scroll. ---
      if (trace) {
        gsap.to(trace, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 72%",
            end: "bottom 78%",
            scrub: 0.6,
          },
        });
      }

      // --- The travelling accent signal (loops once the line is in view). --
      if (flow) {
        ScrollTrigger.create({
          trigger: root,
          start: "top 70%",
          once: true,
          onEnter: () => {
            gsap.to(flow, { opacity: 1, duration: 0.8, ease: "power2.out" });
            gsap.fromTo(
              flow,
              { strokeDashoffset: 0 },
              { strokeDashoffset: -1, duration: 3.4, repeat: -1, ease: "none" },
            );
          },
        });
      }

      // --- Per-role: light the node + reveal content in sequence. ----------
      roles.forEach((role) => {
        const blocks = gsap.utils.toArray<HTMLElement>("[data-rev]", role);
        const core = role.querySelector<HTMLElement>("[data-core]");
        const pulse = role.querySelector<HTMLElement>("[data-pulse]");

        const tl = gsap.timeline({
          scrollTrigger: { trigger: role, start: "top 80%", once: true },
        });

        if (core) {
          tl.to(core, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, 0);
        }
        if (pulse) {
          tl.fromTo(
            pulse,
            { opacity: 0.55, scale: 0.6 },
            { opacity: 0, scale: 1.9, duration: 1.1, ease: "sine.out" },
            0.05,
          );
        }
        tl.to(
          blocks,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.08,
          },
          0.08,
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="experience" className="mb-16 sm:mb-24">
      <SectionHeader index="02" title="EXPERIENCE" />

      {/* The timeline. The rail center sits at --rail; content is inset by --pad. */}
      <div
        ref={rootRef}
        className="relative [--rail:14px] [--pad:44px] sm:[--rail:18px] sm:[--pad:92px]"
      >
        {/* Continuous signal line, from the first node to the section's end. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-[var(--rail)] top-[11px] w-[2px] -translate-x-1/2 sm:top-[15px]"
        >
          <svg
            className="h-full w-full overflow-visible"
            viewBox="0 0 2 1000"
            preserveAspectRatio="none"
          >
            {/* Faint ghost track — always present (the signal's path). */}
            <path
              d="M1 0 L1 1000"
              stroke="var(--line-2)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              fill="none"
            />
            {/* Brighter trace — self-draws top→bottom on scroll. */}
            <path
              data-trace
              d="M1 0 L1 1000"
              pathLength={1}
              stroke="var(--dim)"
              strokeWidth={1.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              fill="none"
              style={{ strokeDasharray: 1, strokeDashoffset: 0, opacity: 0.6 }}
            />
            {/* Travelling accent packet. */}
            <path
              data-flow
              d="M1 0 L1 1000"
              pathLength={1}
              stroke="var(--accent)"
              strokeWidth={2.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              fill="none"
              style={{
                strokeDasharray: "0.07 0.93",
                strokeDashoffset: 0,
                opacity: 0,
                filter: "drop-shadow(0 0 4px var(--accent))",
              }}
            />
          </svg>
        </div>

        {/* Terminal cap — a faint endpoint where the signal settles. */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[var(--rail)] h-[5px] w-[5px] -translate-x-1/2 translate-y-1/2 rounded-full"
          style={{ background: "var(--line-2)" }}
        />

        <div>
          {experiences.map((exp, i) => (
            <article
              key={`${exp.company}-${exp.period}`}
              data-role
              className="relative pb-14 pl-[var(--pad)] last:pb-2 sm:pb-20"
            >
              {/* Node marker on the rail — ring + accent core that lights up. */}
              <span
                aria-hidden="true"
                className="absolute left-[var(--rail)] top-[7px] z-10 grid h-[14px] w-[14px] -translate-x-1/2 place-items-center rounded-full sm:top-[11px]"
                style={{
                  background: "var(--bg)",
                  border: "1.5px solid var(--line-2)",
                }}
              >
                <span
                  data-pulse
                  className="absolute h-[14px] w-[14px] rounded-full"
                  style={{ border: "1.5px solid var(--accent)", opacity: 0 }}
                />
                <span
                  data-core
                  className="h-[6px] w-[6px] rounded-full"
                  style={{
                    background: "var(--accent)",
                    boxShadow: "0 0 7px var(--accent)",
                  }}
                />
              </span>

              {/* Index + period, as a quiet mono eyebrow. */}
              <div
                data-rev
                className="mono flex items-center gap-3 text-[11px] uppercase tracking-[0.18em]"
              >
                <span style={{ color: "var(--accent)" }}>{pad2(i + 1)}</span>
                <span aria-hidden="true" style={{ color: "var(--faint)" }}>
                  /
                </span>
                <span style={{ color: "var(--dim)" }}>{exp.period}</span>
              </div>

              {/* Company — prominent, display face. */}
              <h3
                data-rev
                className="display mt-3 font-black leading-[1.02]"
                style={{
                  fontSize: "clamp(1.5rem, 3.6vw, 2.5rem)",
                  letterSpacing: "-0.02em",
                  color: "var(--bone)",
                }}
              >
                {exp.company}
              </h3>

              {/* Role + location — mono meta. */}
              <p
                data-rev
                className="mono mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.14em]"
                style={{ color: "var(--dim)" }}
              >
                <span style={{ color: "var(--bone)" }}>{exp.role}</span>
                <span aria-hidden="true" style={{ color: "var(--line-2)" }}>
                  /
                </span>
                <span style={{ color: "var(--faint)" }}>{exp.location}</span>
              </p>

              {exp.summary && (
                <p
                  data-rev
                  className="mt-5 max-w-[62ch] text-[15px] leading-relaxed sm:text-base"
                  style={{ color: "var(--bone)" }}
                >
                  {exp.summary}
                </p>
              )}

              {exp.tags && exp.tags.length > 0 && (
                <div
                  data-rev
                  className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2"
                >
                  {exp.tags.map((tag, t) => (
                    <span key={tag} className="inline-flex items-center gap-3">
                      {t > 0 && (
                        <span aria-hidden="true" style={{ color: "var(--line-2)" }}>
                          /
                        </span>
                      )}
                      <span
                        className="mono text-[12px] tracking-[0.02em]"
                        style={{ color: "var(--dim)" }}
                      >
                        {tag}
                      </span>
                    </span>
                  ))}
                </div>
              )}

              {/* Achievements — hairline-marked lines, revealed in sequence. */}
              <ul className="mt-7 flex max-w-[64ch] flex-col gap-4">
                {exp.achievements.map((achievement, idx) => (
                  <li
                    key={idx}
                    data-rev
                    className="flex gap-4 text-[14.5px] leading-relaxed sm:text-[15px]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[11px] h-px w-5 flex-shrink-0"
                      style={{ background: "var(--line-2)" }}
                    />
                    <span style={{ color: "var(--dim)" }}>{achievement}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
