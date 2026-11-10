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
import { getLenis } from "@/app/components/motion/SmoothScroll";
import { useReducedMotion } from "@/app/components/motion/useReducedMotion";
import HeroField from "./HeroField";

// useLayoutEffect warns during SSR; fall back to useEffect on the server so the
// name can be hidden before paint on the client without the hydration warning.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// The monumental wordmark, split into its two stacked lines from the data.
const nameParts = profile.name.trim().split(/\s+/);
const line1 = (nameParts[0] ?? "").toUpperCase();
const line2 = nameParts.slice(1).join(" ").toUpperCase();

/** One line of the name, every glyph its own inline-block span for staggering. */
function NameLine({ text }: { text: string }): ReactNode {
  return (
    <span className="block whitespace-nowrap">
      {Array.from(text).map((ch, i) => (
        <span
          key={`${text}-${i}`}
          data-glyph
          aria-hidden="true"
          className="inline-block"
          style={{ willChange: "transform, filter, opacity" }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const dotRef = useRef<HTMLSpanElement | null>(null);

  // Entrance + scroll-cue loop. Layout effect so the hidden start state is set
  // before first paint (no flash). Default markup is the final, legible state,
  // so no-JS and reduced-motion render the full hero with no animation.
  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const name = nameRef.current;
    if (!section || !name) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const glyphs = name.querySelectorAll<HTMLElement>("[data-glyph]");
      const fades = section.querySelectorAll<HTMLElement>("[data-fade]");

      // Crafted entrance: glyphs rise from below with a blur-to-sharp settle,
      // staggered left→right; the supporting content fades up just after.
      const tl = gsap.timeline();
      tl.set(glyphs, { yPercent: 110, opacity: 0, filter: "blur(12px)" })
        .set(fades, { opacity: 0, y: 18 })
        .to(glyphs, {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.05,
          ease: "expo.out",
          stagger: { each: 0.032, from: "start" },
          delay: 0.08,
        })
        .to(
          fades,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.09,
          },
          0.55,
        );

      // Scroll parallax: the name drifts up, scales down and fades as the hero
      // leaves the viewport. Scrubbed to the hero's own scroll range.
      gsap.to(name, {
        yPercent: -16,
        scale: 0.93,
        opacity: 0.2,
        ease: "none",
        transformOrigin: "left top",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Gentle looping scroll-cue dot (stops entirely under reduced motion).
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          y: 5,
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const onScrollCue = () => {
    const section = sectionRef.current;
    const target = section?.offsetHeight ?? window.innerHeight;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.1 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label={`${profile.name} — ${profile.role}`}
      className="relative flex min-h-[calc(100svh-9rem)] flex-col justify-between gap-12 py-8"
    >
      {/* Living systems-signal field — full viewport width (breaks the padded
          container), behind everything, non-interactive. */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-screen -translate-x-1/2 overflow-hidden">
        <HeroField />
        {/* Left-weighted wash so the name keeps contrast while the field still
            reads clearly through the open space on the right and in the gaps. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(10,10,10,0.78) 0%, rgba(10,10,10,0.28) 42%, rgba(10,10,10,0) 72%)",
          }}
        />
      </div>

      {/* Top block: name → role/tagline → NOW/BEFORE → chips. */}
      <div className="flex flex-col gap-7">
        <h1
          ref={nameRef}
          className="display select-none font-black"
          style={{
            fontSize: "clamp(2.75rem, 13vw, 13rem)",
            lineHeight: 0.86,
            letterSpacing: "-0.03em",
            color: "var(--bone)",
          }}
        >
          {/* Accessible full name; the visual glyphs below are decorative. */}
          <span className="sr-only">{profile.name}</span>
          <NameLine text={line1} />
          <NameLine text={line2} />
        </h1>

        <div className="flex flex-col gap-1.5" data-fade>
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

        {/* NOW / BEFORE meta — mono, premium-portfolio cadence. */}
        <dl
          className="mono flex flex-col gap-2 text-[12px] leading-relaxed tracking-[0.02em] sm:text-[13px]"
          data-fade
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <dt
              className="flex items-center gap-2 font-semibold"
              style={{ color: "var(--accent)" }}
            >
              <span
                aria-hidden="true"
                className="inline-block h-[7px] w-[7px] flex-shrink-0 rounded-full"
                style={{
                  background: "var(--accent)",
                  boxShadow: "0 0 10px var(--accent)",
                }}
              />
              NOW
            </dt>
            <dd style={{ color: "var(--bone)" }}>{profile.nowLine}</dd>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <dt className="font-semibold" style={{ color: "var(--faint)" }}>
              <span aria-hidden="true" className="pr-[13px]" />
              BEFORE
            </dt>
            <dd style={{ color: "var(--dim)" }}>
              {profile.before.join("  ·  ")}
            </dd>
          </div>
        </dl>

        {/* Mono chips. */}
        <ul className="flex flex-wrap gap-2.5" data-fade>
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

      {/* Bottom bar: actions (left) + scroll cue (right), pinned to hero floor. */}
      <div
        className="flex flex-wrap items-end justify-between gap-6"
        data-fade
      >
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            className="mono rounded-md px-4 py-2 text-sm tracking-[0.04em] transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            Email me ↗
          </a>
          <a
            href="/files/KushalKrishnappa.pdf"
            download="KushalKrishnappa.pdf"
            className="mono rounded-md border px-4 py-2 text-sm tracking-[0.04em] transition-colors hover:border-[var(--line-2)]"
            style={{ borderColor: "var(--line)", color: "var(--dim)" }}
          >
            Résumé ↓
          </a>
        </div>

        <button
          type="button"
          onClick={onScrollCue}
          aria-label="Scroll to content"
          className="mono group flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] transition-colors"
          style={{ color: "var(--dim)" }}
        >
          <span>Scroll</span>
          <span
            ref={dotRef}
            aria-hidden="true"
            className="inline-block h-[7px] w-[7px] rounded-full"
            style={{
              background: "var(--accent)",
              boxShadow: "0 0 10px var(--accent)",
            }}
          />
        </button>
      </div>
    </section>
  );
}
