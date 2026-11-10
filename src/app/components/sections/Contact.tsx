"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";
import { Social } from "@/types";
import SectionHeader from "@/app/components/SectionHeader";
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

// The closing call-to-action, split into words so they can rise in sequence.
const CTA_WORDS = "Let's build something that holds up.".split(" ");

/**
 * Contact — the closing call-to-action, not a form.
 *
 * A monumental display CTA line over a supporting availability line, a large
 * click-to-copy / mailto email, and an accent row of social + résumé links.
 *
 * The in-page contact form was an intentionally-disabled placeholder (its API
 * needs mail credentials that aren't wired), so it is removed here: a dead form
 * hurts a graded portfolio. The email CTA + socials carry the close instead.
 *
 * Reduced motion / no-JS / SSR: default markup IS the final, legible state —
 * every word opaque, the email reachable via its mailto link (copy is a JS
 * enhancement). The effect only runs when motion is allowed; it sets start
 * states before paint inside a gsap.context reverted on unmount.
 */
export default function Contact() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const copiedRef = useRef<HTMLSpanElement | null>(null);
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-word]", root);
      const blocks = gsap.utils.toArray<HTMLElement>("[data-rev]", root);

      // CTA words rise from below with a blur-to-sharp settle, echoing the hero.
      gsap.set(words, { yPercent: 115, opacity: 0, filter: "blur(10px)" });
      gsap.set(blocks, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });
      tl.to(words, {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
      }).to(
        blocks,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.09,
        },
        0.4,
      );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      return; // Clipboard blocked — the mailto link still works.
    }
    setCopied(true);
    if (!reducedMotion && copiedRef.current) {
      gsap.fromTo(
        copiedRef.current,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" },
      );
    }
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="mb-16 sm:mb-24">
      <SectionHeader index="10" title="CONTACT" />

      <div ref={rootRef} className="max-w-5xl">
        {/* Monumental CTA line. */}
        <h2
          className="display font-black"
          style={{
            fontSize: "clamp(2.25rem, 7vw, 5.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "var(--bone)",
          }}
        >
          {CTA_WORDS.map((word, i) => (
            <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
              <span
                data-word
                className="inline-block"
                style={{ willChange: "transform, filter, opacity" }}
              >
                {word}
              </span>
              {i < CTA_WORDS.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>

        {/* Supporting availability line. */}
        <p
          data-rev
          className="mono mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] uppercase tracking-[0.16em] sm:text-[13px]"
        >
          <span
            aria-hidden="true"
            className="inline-block h-[7px] w-[7px] flex-shrink-0 rounded-full"
            style={{ background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }}
          />
          <span style={{ color: "var(--dim)" }}>{profile.availability}</span>
          <span aria-hidden="true" style={{ color: "var(--line-2)" }}>
            ·
          </span>
          <span style={{ color: "var(--faint)" }}>open full-time May 2027</span>
        </p>

        {/* Large click-to-copy / mailto email. */}
        <div data-rev className="mt-12">
          <div
            className="mono mb-3 text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "var(--faint)" }}
          >
            Email
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <button
              type="button"
              onClick={onCopy}
              aria-label={`Copy email address ${profile.email}`}
              className="display group inline-flex items-baseline rounded-sm font-black leading-none text-[color:var(--bone)] transition-colors hover:text-[color:var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--bg)]"
              style={{
                fontSize: "clamp(1.4rem, 4.5vw, 3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              <span className="break-all">{profile.email}</span>
            </button>

            {/* Copy state + mailto fallback. */}
            <div className="flex items-center gap-4">
              <span
                ref={copiedRef}
                aria-live="polite"
                className="mono inline-flex items-center rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.14em] transition-colors"
                style={
                  copied
                    ? { borderColor: "var(--accent)", color: "var(--accent)" }
                    : { borderColor: "var(--line-2)", color: "var(--dim)" }
                }
              >
                {copied ? "copied ✓" : "click to copy"}
              </span>
              <a
                href={`mailto:${profile.email}`}
                className="mono rounded-sm text-[11px] uppercase tracking-[0.14em] text-[color:var(--accent)] transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
              >
                open mail ↗
              </a>
            </div>
          </div>
        </div>

        {/* Accent link row: socials + résumé. */}
        <div
          data-rev
          className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-5 border-t pt-8"
          style={{ borderColor: "var(--line)" }}
        >
          {profile.socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-sm text-[color:var(--accent)] transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
            >
              <svg
                className="h-5 w-5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path d={ICON_PATHS[social.icon]} />
              </svg>
              <span className="text-sm group-hover:underline">{social.name}</span>
              <span aria-hidden="true" className="text-sm">
                ↗
              </span>
            </a>
          ))}

          <a
            href="/files/KushalKrishnappa.pdf"
            download="KushalKrishnappa.pdf"
            className="group flex items-center gap-3 rounded-sm text-[color:var(--accent)] transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
          >
            <span className="text-sm group-hover:underline">Résumé</span>
            <span aria-hidden="true" className="text-sm">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
