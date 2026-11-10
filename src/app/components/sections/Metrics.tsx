"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { impactMetrics } from "@/data/impact";
import { useReducedMotion } from "@/app/components/motion/useReducedMotion";

// useLayoutEffect warns during SSR; fall back to useEffect on the server so the
// numbers can be reset to 0 before paint on the client without the warning.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Part =
  | { type: "text"; text: string }
  | { type: "num"; text: string; target: number; grouped: boolean };

/**
 * Split a metric value into literal text and numeric tokens, without hard-coding
 * any specific metric. A numeric token is a run of digits that may carry
 * thousands separators (e.g. "9,000"); everything else — "→", "+", "hr",
 * "PRs / ~", "mo" — is preserved verbatim as literal text between the numbers.
 */
function parseValue(value: string): Part[] {
  const parts: Part[] = [];
  const re = /\d[\d,]*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value)) !== null) {
    if (m.index > last) {
      parts.push({ type: "text", text: value.slice(last, m.index) });
    }
    const token = m[0];
    const grouped = token.includes(",");
    parts.push({
      type: "num",
      text: token,
      target: parseInt(token.replace(/,/g, ""), 10),
      grouped,
    });
    last = m.index + token.length;
  }
  if (last < value.length) {
    parts.push({ type: "text", text: value.slice(last) });
  }
  return parts;
}

/** Format an in-flight count value, matching the source token's grouping. */
function formatCount(value: number, grouped: boolean): string {
  const n = Math.round(value);
  return grouped ? n.toLocaleString("en-US") : String(n);
}

/** Render a literal run, giving the symbol glyphs (→, +) the lone accent touch. */
function renderText(text: string): ReactNode {
  return Array.from(text).map((ch, i) => {
    const isSymbol = ch === "→" || ch === "+";
    return (
      <span
        key={i}
        style={isSymbol ? { color: "var(--accent)" } : undefined}
      >
        {ch}
      </span>
    );
  });
}

export default function Metrics() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);

  // Precompute the parsed parts once per render (pure, derived from the data).
  const parsed = impactMetrics.map((metric) => ({
    ...metric,
    parts: parseValue(metric.value),
  }));

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const columns = section.querySelectorAll<HTMLElement>("[data-metric]");
      const nums = section.querySelectorAll<HTMLElement>("[data-count]");

      // Start hidden (before paint) and zero the counters.
      gsap.set(columns, { opacity: 0, y: 30 });
      nums.forEach((el) => {
        const grouped = el.dataset.grouped === "1";
        el.textContent = formatCount(0, grouped);
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
      });

      // Columns rise in, staggered.
      tl.to(columns, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.12,
      });

      // Each number counts up; metrics stagger by their column index so the
      // three resolve in sequence.
      nums.forEach((el) => {
        const target = Number(el.dataset.target ?? "0");
        const grouped = el.dataset.grouped === "1";
        const final = el.dataset.final ?? "";
        const mi = Number(el.dataset.mi ?? "0");
        const proxy = { v: 0 };
        tl.to(
          proxy,
          {
            v: target,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = formatCount(proxy.v, grouped);
            },
            onComplete: () => {
              // Snap to the exact source token (keeps "9,000" etc. verbatim).
              el.textContent = final;
            },
          },
          0.2 + mi * 0.14,
        );
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Impact in numbers"
      className="py-16 sm:py-24"
    >
      <div className="grid grid-cols-1 gap-12 sm:gap-10 md:grid-cols-3 md:gap-8">
        {parsed.map((metric, mi) => (
          <div
            key={metric.label}
            data-metric
            className="flex flex-col gap-3"
          >
            <div
              className="display font-black leading-[0.92]"
              style={{
                fontSize: "clamp(2.75rem, 7vw, 5.25rem)",
                letterSpacing: "-0.03em",
                color: "var(--bone)",
              }}
            >
              {/* Final values render by default: SSR / no-JS / reduced-motion
                  all show the real numbers with no count-up and no layout shift. */}
              {metric.parts.map((part, pi) =>
                part.type === "num" ? (
                  <span
                    key={pi}
                    data-count
                    data-target={part.target}
                    data-grouped={part.grouped ? "1" : "0"}
                    data-final={part.text}
                    data-mi={mi}
                    className="tabular-nums"
                  >
                    {part.text}
                  </span>
                ) : (
                  <span key={pi}>{renderText(part.text)}</span>
                ),
              )}
            </div>
            <div
              className="mono text-[12px] uppercase leading-relaxed tracking-[0.14em] sm:text-[13px]"
              style={{ color: "var(--dim)" }}
            >
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
