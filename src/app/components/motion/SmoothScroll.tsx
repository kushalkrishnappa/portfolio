"use client";

import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Module-level handle to the live Lenis instance.
 *
 * Other sections (e.g. an anchor-link scroll, a scroll-cue button) can call
 * `getLenis()` to drive the smooth scroll. It is `null` on the server, before
 * mount, under reduced motion, and after unmount — always null-check it.
 */
let lenisInstance: Lenis | null = null;

/** Returns the active Lenis instance, or `null` when smooth scroll is off. */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * Smooth-scroll provider: Lenis driven by the GSAP ticker and wired to
 * ScrollTrigger.
 *
 * Reduced motion: when `(prefers-reduced-motion: reduce)` is set we do NOT
 * create Lenis at all — the browser keeps its native scroll — and simply
 * render `children` unchanged. No animation, no layout shift.
 *
 * SSR: `"use client"` + the effect only runs in the browser, so Lenis/GSAP
 * never touch `window` during render. Children render identically on server
 * and client.
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    lenisInstance = lenis;

    // Keep ScrollTrigger in sync with Lenis' virtual scroll position.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker (single rAF loop). GSAP ticker time is in
    // seconds; Lenis expects milliseconds.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      lenisInstance = null;
      // Avoid leaked triggers across HMR / remounts.
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
