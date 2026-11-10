"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { impactMetrics } from "@/data/impact";

type Phase = "idle" | "hidden" | "revealed";

// Split the live name into its two monumental lines, driven by data.
const nameParts = profile.name.trim().split(/\s+/);
const line1 = (nameParts[0] ?? "").toUpperCase();
const line2 = nameParts.slice(1).join(" ").toUpperCase();

function Letters({ text, start }: { text: string; start: number }) {
  // Each glyph is its own span so it can stagger in. Space is reserved by the
  // letter's own box (inline-block), so the reveal never shifts layout.
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span
          key={`${start}-${i}`}
          className="hero-letter"
          style={{ ["--i" as string]: String(start + i) }}
          aria-hidden="true"
        >
          {ch}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  // Default "idle" renders the final, fully legible name — safe with no JS and
  // under reduced motion. JS opts into the animation after mount.
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      // Honor reduced motion: leave the name settled and visible, no animation.
      return;
    }

    // Snap to the hidden start state (no transition), then flip on the next
    // frame so the staggered transition plays the letters back in and settles.
    setPhase("hidden");
    const raf = requestAnimationFrame(() => setPhase("revealed"));
    return () => cancelAnimationFrame(raf);
  }, []);

  const dataPhase = phase === "idle" ? undefined : phase;

  return (
    <section
      id="home"
      aria-label={`${profile.name} — ${profile.role}`}
      className="relative flex min-h-[calc(100svh-5rem)] flex-col justify-between gap-10 py-10 sm:py-14"
      data-phase={dataPhase}
    >
      {/* The monumental wordmark + role line. */}
      <div className="flex flex-col gap-6">
        <h1
          className="display select-none font-black"
          style={{
            fontSize: "clamp(2.75rem, 13vw, 13rem)",
            lineHeight: 0.86,
            letterSpacing: "-0.03em",
            color: "var(--bone)",
          }}
        >
          {/* Accessible name for screen readers; the visual glyphs are hidden. */}
          <span className="sr-only">{profile.name}</span>
          <span className="block whitespace-nowrap">
            <Letters text={line1} start={0} />
          </span>
          <span className="block whitespace-nowrap">
            <Letters text={line2} start={line1.length} />
          </span>
        </h1>

        {/* Primary positioning line (what a recruiter reads first), then the
            secondary tagline beneath it. */}
        <div className="flex flex-col gap-1.5">
          <p
            className="max-w-2xl text-xl font-semibold leading-tight sm:text-2xl md:text-3xl"
            style={{ color: "var(--bone)" }}
          >
            {profile.role}
          </p>
          <p
            className="max-w-2xl text-base font-normal leading-snug sm:text-lg md:text-xl"
            style={{ color: "var(--dim)" }}
          >
            {profile.tagline}
          </p>
        </div>

        {/* Primary + secondary actions. Accent is spent only on the primary. */}
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            className="mono rounded-md px-4 py-2 text-sm tracking-[0.04em] transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            contact ↗
          </a>
          <a
            href="/files/KushalKrishnappa.pdf"
            download="KushalKrishnappa.pdf"
            className="mono rounded-md border px-4 py-2 text-sm tracking-[0.04em] transition-colors"
            style={{ borderColor: "var(--line-2)", color: "var(--dim)" }}
          >
            résumé ↓
          </a>
        </div>
      </div>

      {/* Bottom band: live status + chips (left), proof metrics (right). */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4">
          <div
            className="mono flex items-center gap-3 text-xs sm:text-sm"
            style={{ color: "var(--dim)" }}
          >
            <span
              aria-hidden="true"
              className="inline-block h-[9px] w-[9px] flex-shrink-0 rounded-full"
              style={{
                background: "var(--accent)",
                boxShadow: "0 0 10px var(--accent)",
              }}
            />
            <span>{profile.nowLine}</span>
          </div>

          <ul className="flex flex-wrap gap-2.5">
            {profile.chips.map((chip) => (
              <li
                key={chip}
                className="mono rounded-full border px-3.5 py-1.5 text-[13px] tracking-[0.03em]"
                style={{ borderColor: "var(--line)", color: "var(--bone)" }}
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>

        <dl className="flex flex-wrap gap-x-8 gap-y-4 lg:justify-end lg:text-right">
          {impactMetrics.map((metric) => (
            <div key={metric.label} className="flex flex-col gap-1">
              <dt className="order-2">
                <span
                  className="mono text-[10px] uppercase tracking-[0.14em]"
                  style={{ color: "var(--dim)" }}
                >
                  {metric.label}
                </span>
              </dt>
              <dd
                className="display order-1 text-xl font-bold sm:text-2xl"
                style={{ color: "var(--bone)" }}
              >
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
