"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { SystemCaseStudy } from "@/types";
import { useReducedMotion } from "@/app/components/motion/useReducedMotion";
import SystemDiagram from "./SystemDiagram";
import { diagrams } from "./diagrams";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * SystemScene — one immersive case-study scene.
 *
 * Layout: a full-width monumental title, then a two-column body. On desktop the
 * diagram column is CSS-sticky (centred) while the narrative column scrolls past
 * it — a "pin" that needs no ScrollTrigger spacer and survives resize for free.
 * Stickiness is applied only via the `motion-safe:` variant, so under
 * `prefers-reduced-motion: reduce` there is NO pinning; on mobile it is a clean
 * vertical stack.
 *
 * Motion (allowed only): a scrubbed timeline draws the diagram as the scene
 * enters (edges via strokeDashoffset in flow order, nodes fade/scale in,
 * arrowheads land). Once drawn, a primary edge gets a travelling accent flow and
 * the key node pulses (both infinite, independent of scroll). Narrative blocks
 * reveal one-by-one on their own triggers. Everything lives in a single
 * `gsap.context` and is reverted on unmount.
 *
 * Reduced motion / no-JS: default markup is the final state — full diagram, all
 * text present and opaque — so nothing is hidden and there is no layout shift.
 */
export default function SystemScene({
  system,
  index,
  total,
}: {
  system: SystemCaseStudy;
  index: number;
  total: number;
}) {
  const reducedMotion = useReducedMotion();
  const sceneRef = useRef<HTMLElement | null>(null);
  const hasDiagram = Boolean(diagrams[system.slug]);

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;
    const scene = sceneRef.current;
    if (!scene) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const edges = gsap.utils.toArray<SVGElement>("[data-edge]", scene);
      const heads = gsap.utils.toArray<SVGElement>("[data-head]", scene);
      const nodes = gsap.utils.toArray<SVGElement>("[data-node]", scene);
      const flows = gsap.utils.toArray<SVGElement>("[data-flow]", scene);
      const pulses = gsap.utils.toArray<SVGElement>("[data-pulse]", scene);
      const blocks = gsap.utils.toArray<HTMLElement>("[data-rev]", scene);

      // --- Start states (set before paint; no flash). ---------------------
      if (nodes.length) {
        gsap.set(edges, { strokeDashoffset: 1 });
        gsap.set(heads, { opacity: 0 });
        gsap.set(nodes, { opacity: 0, scale: 0.88, transformOrigin: "50% 50%" });
      }
      gsap.set(blocks, { opacity: 0, y: 24 });

      // --- Self-drawing diagram, scrubbed to the scene's scroll. ----------
      if (nodes.length) {
        const draw = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: "top 68%",
            end: "top 12%",
            scrub: 0.6,
          },
        });
        draw
          .to(nodes, {
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            duration: 0.5,
            stagger: 0.1,
          }, 0)
          .to(edges, {
            strokeDashoffset: 0,
            ease: "none",
            duration: 0.6,
            stagger: 0.1,
          }, 0.12)
          .to(heads, {
            opacity: 1,
            ease: "none",
            duration: 0.18,
            stagger: 0.1,
          }, 0.5);

        // Once drawn: live flow + key-node pulse (infinite, scroll-independent).
        ScrollTrigger.create({
          trigger: scene,
          start: "top 45%",
          once: true,
          onEnter: () => {
            if (flows.length) {
              gsap.to(flows, { opacity: 1, duration: 0.6, ease: "power2.out" });
              flows.forEach((f) =>
                gsap.to(f, {
                  strokeDashoffset: -1,
                  duration: 1.9,
                  repeat: -1,
                  ease: "none",
                }),
              );
            }
            pulses.forEach((p) =>
              gsap.fromTo(
                p,
                { opacity: 0.6, scale: 0.9, transformOrigin: "50% 50%" },
                {
                  opacity: 0,
                  scale: 1.28,
                  duration: 2,
                  repeat: -1,
                  ease: "sine.out",
                },
              ),
            );
          },
        });
      }

      // --- Narrative blocks reveal one-by-one as they enter. --------------
      blocks.forEach((b) => {
        gsap.to(b, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: b, start: "top 88%", once: true },
        });
      });
    }, scene);

    return () => ctx.revert();
  }, [reducedMotion]);

  const meta = `${system.org} · ${system.period} · ${system.role}`;

  return (
    <article
      ref={sceneRef}
      aria-labelledby={`sys-${system.slug}`}
      className="relative py-[9vh] sm:py-[11vh]"
    >
      {/* Scene eyebrow: index + live status. */}
      <div className="mono mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em]">
        <span style={{ color: "var(--accent)" }}>S{index}</span>
        <span aria-hidden="true" style={{ color: "var(--faint)" }}>
          / {pad2(total)}
        </span>
        {system.status && (
          <>
            <span aria-hidden="true" className="h-px w-6" style={{ background: "var(--line-2)" }} />
            <span
              className="inline-flex items-center gap-1.5"
              style={{ color: "var(--accent)" }}
            >
              <span
                aria-hidden="true"
                className="inline-block h-[6px] w-[6px] rounded-full"
                style={{ background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }}
              />
              {system.status}
            </span>
          </>
        )}
      </div>

      {/* Monumental title. */}
      <h3
        id={`sys-${system.slug}`}
        data-rev
        className="display max-w-[14ch] font-black leading-[0.95]"
        style={{
          fontSize: "clamp(1.9rem, 5.2vw, 3.6rem)",
          letterSpacing: "-0.02em",
          color: "var(--bone)",
        }}
      >
        {system.name}
      </h3>
      <p
        data-rev
        className="mono mt-4 text-[11px] uppercase tracking-[0.14em]"
        style={{ color: "var(--dim)" }}
      >
        {meta}
      </p>

      {/* Body: sticky diagram + scrolling narrative. */}
      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-16">
        {/* Diagram column — CSS-sticky on desktop only under motion-safe. */}
        {hasDiagram && (
          <div className="motion-safe:lg:sticky motion-safe:lg:top-[16vh]">
            <div
              className="rounded-xl border p-5 sm:p-7"
              style={{ borderColor: "var(--line)", background: "rgba(17,19,23,0.35)" }}
            >
              <SystemDiagram slug={system.slug} />
              <p
                className="mono mt-4 text-[10.5px] leading-relaxed tracking-[0.06em]"
                style={{ color: "var(--faint)" }}
              >
                {diagrams[system.slug].caption}
              </p>
            </div>
          </div>
        )}

        {/* Narrative column. */}
        <div className="flex flex-col gap-9">
          <p
            data-rev
            className="text-lg leading-relaxed sm:text-xl"
            style={{ color: "var(--bone)" }}
          >
            {system.summary}
          </p>

          <div data-rev>
            <h4
              className="mono mb-2.5 text-[11px] uppercase tracking-[0.16em]"
              style={{ color: "var(--faint)" }}
            >
              Problem
            </h4>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--dim)" }}>
              {system.problem}
            </p>
          </div>

          <div>
            <h4
              data-rev
              className="mono mb-3.5 text-[11px] uppercase tracking-[0.16em]"
              style={{ color: "var(--faint)" }}
            >
              Approach
            </h4>
            <ol className="flex flex-col gap-3.5">
              {system.approach.map((step, i) => (
                <li
                  key={i}
                  data-rev
                  className="flex gap-4 text-[15px] leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className="mono mt-[2px] flex-shrink-0 text-[11px] tabular-nums"
                    style={{ color: "var(--accent)" }}
                  >
                    {pad2(i + 1)}
                  </span>
                  <span style={{ color: "var(--dim)" }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h4
              data-rev
              className="mono mb-3.5 text-[11px] uppercase tracking-[0.16em]"
              style={{ color: "var(--faint)" }}
            >
              The hard part
            </h4>
            <ul className="flex flex-col gap-3">
              {system.highlights.map((h, i) => (
                <li
                  key={i}
                  data-rev
                  className="flex gap-4 border-l pl-4 text-[15px] font-medium leading-relaxed sm:text-base"
                  style={{ borderColor: "var(--accent)", color: "var(--bone)" }}
                >
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Stack — inline labels, not a boxy grid. */}
          <div data-rev className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span
              className="mono text-[11px] uppercase tracking-[0.16em]"
              style={{ color: "var(--faint)" }}
            >
              Stack
            </span>
            {system.stack.map((tech, i) => (
              <span key={tech} className="inline-flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" style={{ color: "var(--line-2)" }}>
                    /
                  </span>
                )}
                <span className="mono text-[12.5px]" style={{ color: "var(--bone)" }}>
                  {tech}
                </span>
              </span>
            ))}
          </div>

          {/* Outcome — the closing statement. */}
          <p
            data-rev
            className="border-t pt-6 text-base leading-relaxed sm:text-lg"
            style={{ borderColor: "var(--line)", color: "var(--bone)" }}
          >
            <span className="mono mr-2 text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>
              Outcome
            </span>
            {system.outcome}
          </p>
        </div>
      </div>
    </article>
  );
}
