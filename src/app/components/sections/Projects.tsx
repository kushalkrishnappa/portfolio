"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import SectionHeader from "@/app/components/SectionHeader";
import { useReducedMotion } from "@/app/components/motion/useReducedMotion";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const pad2 = (n: number) => String(n).padStart(2, "0");

// Resolved token values for GSAP tweens (GSAP can't interpolate CSS vars).
const ACCENT = "#4DD4E0";
const BONE = "#ECECEA";
const FAINT = "#5C6066";

/**
 * Projects — a confident editorial index of real work (no card grid).
 *
 * Each project is a full-width entry separated by hairlines: a large display
 * name, mono meta (role · year), description, inline mono tech labels,
 * hairline-marked feature lines, an emphasized impact line, and accent ↗ links.
 * A quiet ghost index number sits in the left rail.
 *
 * Motion:
 *  - Scroll reveal per entry — the entry's blocks rise + fade in, staggered,
 *    once it enters view.
 *  - One cohesive hover move (fine-pointer, motion allowed): the row lifts, the
 *    name shifts right and goes accent with an underline drawing beneath it, and
 *    the big index number slides in and lights up accent.
 *
 * Reduced motion / no-JS / SSR: the default markup IS the final, legible state —
 * everything present and opaque, index visible (faint), no hidden content and no
 * layout shift. The effect only runs when motion is allowed; it sets start
 * states before paint and lives in a single gsap.context reverted on unmount.
 */
export default function Projects() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const entries = gsap.utils.toArray<HTMLElement>("[data-entry]", root);
      const finePointer =
        typeof window !== "undefined" &&
        window.matchMedia?.("(pointer:fine)").matches;
      const teardowns: Array<() => void> = [];

      entries.forEach((entry) => {
        const blocks = gsap.utils.toArray<HTMLElement>("[data-rev]", entry);

        // --- Scroll reveal ------------------------------------------------
        gsap.set(blocks, { opacity: 0, y: 22 });
        gsap.to(blocks, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: entry, start: "top 82%", once: true },
        });

        // --- Cohesive hover move (fine pointers only) ---------------------
        if (!finePointer) return;
        const row = entry.querySelector<HTMLElement>("[data-row]");
        const nameWrap = entry.querySelector<HTMLElement>("[data-namewrap]");
        const name = entry.querySelector<HTMLElement>("[data-name]");
        const underline = entry.querySelector<HTMLElement>("[data-underline]");
        const index = entry.querySelector<HTMLElement>("[data-index]");

        // Rest the index slightly left/faint so it slides in on hover.
        if (index) gsap.set(index, { x: -10 });

        const hover = gsap.timeline({ paused: true });
        if (row) hover.to(row, { y: -6, duration: 0.4, ease: "power3" }, 0);
        if (nameWrap)
          hover.to(nameWrap, { x: 12, duration: 0.4, ease: "power3" }, 0);
        if (name) hover.to(name, { color: ACCENT, duration: 0.4 }, 0);
        if (underline)
          hover.to(underline, { scaleX: 1, duration: 0.45, ease: "power3" }, 0);
        if (index)
          hover.to(
            index,
            { color: ACCENT, x: 0, opacity: 1, duration: 0.45, ease: "power3" },
            0,
          );

        const enter = () => hover.play();
        const leave = () => hover.reverse();
        entry.addEventListener("pointerenter", enter);
        entry.addEventListener("pointerleave", leave);
        teardowns.push(() => {
          entry.removeEventListener("pointerenter", enter);
          entry.removeEventListener("pointerleave", leave);
        });
      });

      return () => teardowns.forEach((fn) => fn());
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="projects" className="mb-16 sm:mb-24">
      <SectionHeader index="03" title="PROJECTS" />

      <div ref={rootRef} className="border-t" style={{ borderColor: "var(--line)" }}>
        {projects.map((project, i) => (
          <article
            key={project.name}
            data-entry
            data-cursor
            className="border-b"
            style={{ borderColor: "var(--line)" }}
          >
            <div
              data-row
              className="relative grid gap-x-8 gap-y-5 py-10 will-change-transform sm:py-14 md:grid-cols-[5.5rem_1fr] md:gap-x-12"
            >
              {/* Ghost index — faint by default, lights accent on hover. */}
              <div data-rev className="md:pt-3">
                <span
                  data-index
                  className="display block font-black leading-none tabular-nums"
                  style={{
                    fontSize: "clamp(2.25rem, 6vw, 3.75rem)",
                    letterSpacing: "-0.03em",
                    color: FAINT,
                    opacity: 0.55,
                  }}
                >
                  {pad2(i + 1)}
                </span>
              </div>

              {/* Main column */}
              <div>
                <div className="flex flex-col gap-x-6 gap-y-3 sm:flex-row sm:items-baseline sm:justify-between">
                  <div data-rev data-namewrap className="inline-block will-change-transform">
                    <h3
                      data-name
                      className="display font-black leading-[1.0]"
                      style={{
                        fontSize: "clamp(1.9rem, 4.6vw, 3.25rem)",
                        letterSpacing: "-0.025em",
                        color: BONE,
                      }}
                    >
                      {project.name}
                    </h3>
                    <span
                      data-underline
                      aria-hidden="true"
                      className="mt-2 block h-[2px] w-full origin-left"
                      style={{ background: "var(--accent)", transform: "scaleX(0)" }}
                    />
                  </div>

                  {(project.role || project.year) && (
                    <div
                      data-rev
                      className="mono flex shrink-0 items-center gap-2 text-[11px] uppercase tracking-[0.16em]"
                    >
                      {project.role && (
                        <span style={{ color: "var(--dim)" }}>{project.role}</span>
                      )}
                      {project.role && project.year && (
                        <span aria-hidden="true" style={{ color: "var(--line-2)" }}>
                          ·
                        </span>
                      )}
                      {project.year && (
                        <span style={{ color: "var(--faint)" }}>{project.year}</span>
                      )}
                    </div>
                  )}
                </div>

                <p
                  data-rev
                  className="mt-5 max-w-[62ch] text-[15px] leading-relaxed sm:text-base"
                  style={{ color: "var(--bone)" }}
                >
                  {project.description}
                </p>

                {/* Tech — inline mono labels, hairline-separated (not boxed). */}
                <div
                  data-rev
                  className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2"
                >
                  {project.tech.map((tech, t) => (
                    <span key={tech} className="inline-flex items-center gap-3">
                      {t > 0 && (
                        <span aria-hidden="true" style={{ color: "var(--line-2)" }}>
                          /
                        </span>
                      )}
                      <span
                        className="mono text-[12px] tracking-[0.02em]"
                        style={{ color: "var(--dim)" }}
                      >
                        {tech}
                      </span>
                    </span>
                  ))}
                </div>

                {/* Features — hairline-marked lines. */}
                <ul className="mt-7 flex max-w-[64ch] flex-col gap-3.5">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      data-rev
                      className="flex gap-4 text-[14.5px] leading-relaxed sm:text-[15px]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[11px] h-px w-5 flex-shrink-0"
                        style={{ background: "var(--line-2)" }}
                      />
                      <span style={{ color: "var(--dim)" }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Impact — emphasized. */}
                <p
                  data-rev
                  className="mt-7 max-w-[60ch] text-[15px] font-medium leading-relaxed sm:text-base"
                  style={{ color: "var(--bone)" }}
                >
                  {project.impact}
                </p>

                {project.links && project.links.length > 0 && (
                  <div data-rev className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                    {project.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor
                        className="mono rounded-sm text-xs tracking-[0.04em] transition-opacity hover:opacity-80 text-[color:var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
