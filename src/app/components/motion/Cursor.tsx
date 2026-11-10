"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";

/** Selector for elements that should grow / highlight the cursor. */
const INTERACTIVE = "a, button, [data-cursor]";

/**
 * Custom pointer cursor: a small `--accent` dot inside a trailing ring that
 * eases toward the pointer (gsap.quickTo). It grows over interactive elements
 * (`a, button, [data-cursor]`).
 *
 * Only active on fine pointers (`matchMedia('(pointer:fine)')`) — renders
 * nothing on touch devices. The native cursor is hidden (via a `cursor-none`
 * class on <body>) ONLY while this component is mounted and active, and is
 * restored on unmount.
 *
 * Reduced motion: disabled entirely (returns `null`, native cursor kept) — the
 * custom cursor is never required for usability.
 *
 * SSR: nothing renders until the mount effect confirms a fine pointer, so the
 * server and first client render both produce no cursor markup (no hydration
 * mismatch). `pointer-events: none` ensures it never blocks clicks.
 */
export default function Cursor() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Decide whether to render at all: fine pointer + motion allowed.
  useEffect(() => {
    if (reducedMotion) {
      setActive(false);
      return;
    }
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia("(pointer:fine)");
    setActive(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setActive(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [reducedMotion]);

  // Wire pointer tracking + hover state once the cursor is active and mounted.
  useEffect(() => {
    if (!active) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.body.classList.add("cursor-none");

    const ctx = gsap.context(() => {
      gsap.set([ring, dot], { xPercent: -50, yPercent: -50, opacity: 0 });

      const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });
      const dotX = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3" });

      let shown = false;
      const onMove = (event: PointerEvent) => {
        if (!shown) {
          shown = true;
          gsap.to([ring, dot], { opacity: 1, duration: 0.3 });
        }
        ringX(event.clientX);
        ringY(event.clientY);
        dotX(event.clientX);
        dotY(event.clientY);
      };

      const onOver = (event: PointerEvent) => {
        const target = event.target as Element | null;
        if (target?.closest(INTERACTIVE)) {
          gsap.to(ring, { scale: 1.8, duration: 0.3, ease: "power3" });
        }
      };
      const onOut = (event: PointerEvent) => {
        const target = event.target as Element | null;
        if (target?.closest(INTERACTIVE)) {
          gsap.to(ring, { scale: 1, duration: 0.3, ease: "power3" });
        }
      };
      const onLeave = () => gsap.to([ring, dot], { opacity: 0, duration: 0.3 });
      const onEnter = () => {
        shown = true;
        gsap.to([ring, dot], { opacity: 1, duration: 0.3 });
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      window.addEventListener("pointerout", onOut, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      document.addEventListener("pointerenter", onEnter);

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
        window.removeEventListener("pointerout", onOut);
        document.removeEventListener("pointerleave", onLeave);
        document.removeEventListener("pointerenter", onEnter);
      };
    });

    return () => {
      ctx.revert();
      document.body.classList.remove("cursor-none");
    };
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-8 w-8 rounded-full"
        style={{ border: "1px solid var(--accent)", willChange: "transform" }}
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--accent)", willChange: "transform" }}
      />
    </div>
  );
}
