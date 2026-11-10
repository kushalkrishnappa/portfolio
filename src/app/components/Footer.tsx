"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";
import { Social } from "@/types";
import { useReducedMotion } from "@/app/components/motion/useReducedMotion";

// useLayoutEffect warns during SSR; fall back to useEffect on the server so the
// hide-then-reveal can run before paint on the client without the warning.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const ICON_PATHS: Record<Social["icon"], string> = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  github:
    "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
};

// The monumental wordmark, split into its two stacked lines, echoing the hero.
const nameParts = profile.name.trim().split(/\s+/);
const line1 = (nameParts[0] ?? "").toUpperCase();
const line2 = nameParts.slice(1).join(" ").toUpperCase();

/** One outlined line of the name; every glyph its own span for staggering. */
function GhostLine({ text }: { text: string }): ReactNode {
  return (
    <span className="block overflow-hidden whitespace-nowrap">
      {Array.from(text).map((ch, i) => (
        <span
          key={`${text}-${i}`}
          data-glyph
          aria-hidden="true"
          className="inline-block"
          style={{ willChange: "transform, opacity" }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

/**
 * Footer — the closing bookend: the monumental name repeated as an outlined
 * ghost wordmark, echoing the hero so the page opens and closes on the same
 * signature. A tasteful footer row (availability · socials · credit) sits below.
 *
 * Reduced motion / no-JS / SSR: default markup IS the final, legible state —
 * the wordmark present, the row present, no hidden content, no layout shift.
 * The reveal only runs when motion is allowed; start states are set before
 * paint inside a gsap.context reverted on unmount.
 */
export default function Footer() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);
  const nameRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;
    const root = rootRef.current;
    const name = nameRef.current;
    if (!root || !name) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const glyphs = name.querySelectorAll<HTMLElement>("[data-glyph]");
      const rows = gsap.utils.toArray<HTMLElement>("[data-rev]", root);

      // The wordmark rises line-by-line as the footer enters view.
      gsap.set(glyphs, { yPercent: 115, opacity: 0 });
      gsap.set(rows, { opacity: 0, y: 16 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 85%", once: true },
      });
      tl.to(glyphs, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        stagger: { each: 0.028, from: "start" },
      }).to(
        rows,
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 },
        0.45,
      );

      // Gentle parallax drift on the wordmark as it scrolls through the floor.
      gsap.fromTo(
        name,
        { yPercent: 6 },
        {
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <footer
      ref={rootRef}
      className="relative mt-24 w-full overflow-hidden border-t pt-16 sm:mt-32 sm:pt-24"
      style={{ borderColor: "var(--line)" }}
    >
      {/* Monumental outlined wordmark — full-bleed to the page gutter. */}
      <div className="px-5 sm:px-8 lg:px-14 xl:px-20">
        <div
          ref={nameRef}
          className="display select-none font-black"
          style={{
            fontSize: "clamp(2.4rem, 12.5vw, 13rem)",
            lineHeight: 0.84,
            letterSpacing: "-0.03em",
            color: "transparent",
            WebkitTextStroke: "1px var(--faint)",
          }}
        >
          <span className="sr-only">{profile.name}</span>
          <GhostLine text={line1} />
          <GhostLine text={line2} />
        </div>
      </div>

      {/* Footer row: availability · socials · credit. */}
      <div className="px-5 pb-12 pt-14 sm:px-8 sm:pb-16 lg:px-14 xl:px-20">
        <div
          className="flex flex-col gap-8 border-t pt-8 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "var(--line)" }}
        >
          <p
            data-rev
            className="mono max-w-md text-[12px] leading-relaxed tracking-[0.04em] sm:text-[13px]"
            style={{ color: "var(--dim)" }}
          >
            {profile.availability} · May 2027
          </p>

          <div data-rev className="flex items-center gap-6">
            {profile.socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="rounded-sm text-[color:var(--dim)] transition-colors hover:text-[color:var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
              >
                <svg
                  className="h-5 w-5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d={ICON_PATHS[social.icon]} />
                </svg>
              </a>
            ))}
          </div>

          <p
            data-rev
            className="mono text-[11px] uppercase tracking-[0.14em]"
            style={{ color: "var(--faint)" }}
          >
            © 2026 · built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
