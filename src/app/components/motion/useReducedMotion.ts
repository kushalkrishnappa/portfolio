"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * SSR-safe reduced-motion hook.
 *
 * Returns `false` on the server and on the first client render (so markup is
 * identical and there is never a hydration mismatch), then reads the real
 * `matchMedia('(prefers-reduced-motion: reduce)')` value after mount and
 * subscribes to changes.
 *
 * Consumers should treat `true` as "render final states, run no animation".
 * Because the initial value is `false`, any motion code must also guard on
 * mount (see `Reveal` / `SmoothScroll`) so nothing animates before this
 * resolves.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export default useReducedMotion;
