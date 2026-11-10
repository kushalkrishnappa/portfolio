"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  type Ref,
} from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";

// useLayoutEffect warns during SSR; fall back to useEffect on the server so the
// hide-then-reveal can run before paint on the client without the warning.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type RevealOwnProps<T extends ElementType> = {
  /** The element/tag to render. Defaults to `div`. */
  as?: T;
  /** Extra delay (seconds) before the reveal animation starts. */
  delay?: number;
  className?: string;
  children?: ReactNode;
};

export type RevealProps<T extends ElementType = "div"> = RevealOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof RevealOwnProps<T>>;

/**
 * Reusable scroll-reveal wrapper.
 *
 * Usage: `<Reveal as="section" className="…" delay={0.1}>…</Reveal>`.
 *
 * Content renders in its FINAL visible state by default (opacity 1, y 0), so
 * SSR, no-JS, and reduced-motion all show it immediately with no layout shift.
 * When motion is allowed, a layout effect hides it (before paint, no flash) and
 * a ScrollTrigger animates opacity 0→1 / y 24→0 over 0.7s (power3.out) when the
 * element reaches "top 85%", once. The ScrollTrigger is killed on unmount.
 */
export default function Reveal<T extends ElementType = "div">({
  as,
  delay = 0,
  className,
  children,
  ...rest
}: RevealProps<T>) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y: 24 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [reducedMotion, delay]);

  const Tag = (as ?? "div") as ElementType;

  return (
    <Tag ref={ref as Ref<HTMLElement>} className={className} {...rest}>
      {children}
    </Tag>
  );
}
