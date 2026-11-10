# Portfolio — Motion Rebuild (competition-grade) — Build Spec & Context

> Coordinator's durable context. If context was cleared, READ THIS + `PRODUCT.md` +
> `docs/superpowers/specs/2026-11-09-portfolio-redesign-context.md` (content plan) +
> `.impeccable/surfaces/src-app-page-tsx.md` (direction contract) to resume.

## Elevated brief (user, 2026-11-10) — overrides earlier scope
Build the **best, most visually-stunning, motion-rich dark portfolio possible** —
it is a **competition graded against other models** on design, motion, and visual
appeal. **No boxy tiles, no plain text blocks.** Full creative discretion. Take as
long as needed. Operating model (user-directed): **coordinator delegates building
to subagents (subagent-driven-development), keeps durable context on disk, verifies
via the browser at localhost:3000, and keeps its own context window lean** (don't
read large source files in; delegate + screenshot-verify; let context compact).

Hard constraints still apply: **dark theme only**; the **monumental name is the
signature** and the hero doubles as an **iframe signature** (name dominant/legible
small); **defensible content** only (see content plan; never publish private Jira
keys/PR#s/internal names). Full static, legible **reduced-motion fallback** required.

## Design concept — "living systems" cinematic scroll
A dark, premium, scroll-driven experience where motion is the medium and the work
reveals like traversing a system. Keep Kushal's identity (cyan accent `--accent
#4DD4E0`, Archivo display, mono labels — tokens in `globals.css`). Reference craft
bar only (do NOT clone): abhirao.in (monumental staggered name, NOW/BEFORE meta with
company context, chips, airy editorial spacing, name repeated as footer bookend,
click-to-copy contact, custom cursor, smooth scroll).

## Motion stack (installed: gsap@3.13, lenis@1.3)
- **Lenis** smooth scroll, wired to **GSAP ScrollTrigger** (lenis.on('scroll',
  ScrollTrigger.update); gsap.ticker drives lenis.raf; `lagSmoothing(0)`).
- **GSAP + ScrollTrigger** for reveals, pins, scrubs, self-drawing SVG (drawSVG-style
  via stroke-dashoffset), count-ups.
- **Custom cursor** (accent dot, magnetic/grow on interactive) — `pointer:fine` only,
  never on touch; hide native cursor only when custom is active.
- **Reduced motion**: a `prefers-reduced-motion: reduce` path that disables Lenis and
  ScrollTrigger animations and renders every final state immediately. Content must be
  fully present and legible with no JS and under reduced motion (no content hidden
  only by animation; no layout shift; hero name always legible).
- Performance: lazy-init canvas/WebGL; bound expensive effects; don't block LCP (hero
  text paints first); `will-change` sparingly; kill ScrollTriggers on unmount.

## Section plan (NO tiles — flowing, full-bleed, motion-led)
Render order in `src/app/page.tsx` (keep data from `src/data/*`):
1. **Hero** — monumental name (split-text reveal, GSAP stagger + subtle clip/scramble)
   over a **living background** (subtle animated systems-signal field: a faint flowing
   node-graph / traveling-signal grid / slow gradient-mesh on canvas, low-contrast).
   Role (`profile.role`) + **NOW / BEFORE** meta (NOW = `profile.nowLine`; BEFORE =
   RoonCyber · Pure Storage · Mercedes-Benz from experiences) + mono chips
   (`profile.chips`). Bottom bar: Email/Résumé actions + a SCROLL cue. Name parallaxes
   (scale/fade) on scroll out. Full `100svh`. No metrics tiles here.
3. **Statement / marquee** — large scrubbed statement or an infinite horizontal marquee
   of the through-lines (MULTI-TENANCY · TEMPORAL · RELIABILITY · AI-SDLC).
4. **Metrics** — GSAP **count-ups** of the 3 proof numbers (from `impact.ts`) in big
   editorial type, animating in on scroll. Not tiles.
5. **Systems (showpiece)** — scroll-**pinned** immersive case studies (`systems.ts`):
   each a full-bleed scene where an **architecture/topology diagram self-draws** (SVG
   nodes + edges via stroke-dashoffset), nodes light up, and `highlights`/`approach`
   reveal in sequence as you scroll. Deep-read still reachable/accessible. Not cards.
6. **Experience** — a flowing **signal-trace timeline** (one animated line connecting
   RoonCyber → Pure → Mercedes; each role's `summary`/`achievements` reveal along it).
   Not tiles.
7. **Projects** — large **editorial entries** with scroll reveals + magnetic hover
   (Beacon, temporal-onprem-stack, ebpf-http-scan, dsapanicle), `role`/`links`. Not a
   grid of equal tiles.
8. **Skills** — a moving **marquee / tech constellation**, not a chip grid.
9. **Research + Education + Publications** — compact, elegant scroll reveals.
10. **Contact** — bold CTA, **click-to-copy** email (animated feedback), socials, and
    the **monumental name repeated as the footer bookend** (parallax/reveal).

## Current state (2026-11-10)
- Dark tokens/fonts done (`globals.css`, Archivo variable font). Content layer done &
  defensible (`src/data/*`, `systems.ts`, `research.ts`). Full-bleed layout done
  (page/blogs/nav use `w-full px-5 sm:px-8 lg:px-14 xl:px-20`). Hero = Monumental
  Nameplate (stacked KUSHAL/KRISHNAPPA, split-text reveal, role+tagline, chips,
  metrics) — **to be upgraded** to the living-hero + NOW/BEFORE above. Sections 1–10
  exist but as **tiles/cards — to be REPLACED** with the motion treatments above.
- Branch `improve-portfolio-website-cd288d3d`. Dev server on :3000. Verify builds with
  `npx tsc --noEmit` + `npm run lint` (NOT `npm run build` while dev server runs).

## Build order (subagent tasks; one implementer at a time; verify each in browser)
- **M1 Motion foundation**: `SmoothScroll` provider (Lenis+GSAP+ScrollTrigger),
  `useReducedMotion`, custom cursor, a reusable scroll-reveal hook/util; wire into
  `layout.tsx`. Prove: smooth scroll works, reduced-motion disables it, no SSR errors.
- **M2 Hero** living background + reveal + NOW/BEFORE + scroll cue + parallax.
- **M3 Systems** pinned scroll-scenes + self-drawing diagrams (showpiece).
- **M4 Experience** signal-trace timeline.
- **M5 Statement marquee + Metrics count-ups.**
- **M6 Projects editorial + Skills marquee/constellation.**
- **M7 Research/Education/Publications reveals + Contact click-to-copy + footer name.**
- **M8 Polish + perf + reduced-motion audit + Impeccable finish review + DESIGN.md.**

Each subagent: reads this file + the token/data files it needs; builds to the spec;
verifies `tsc --noEmit` + `lint`; does NOT run `npm run build` or start a dev server;
commits (no push/remote). Coordinator verifies visually via the browser after each.
