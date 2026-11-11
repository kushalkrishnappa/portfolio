# Field Manual — portfolio redesign spec (2026-11-11)

Replaces the "Monumental Nameplate" world (M1–M9). The user chose this direction
after a brainstorm inspired by endspeciesism.org: chaptered scroll storytelling
with sticky 100vh stages scrubbed by scroll, a protagonist crossing every scene,
torn-paper seams, a chapter rail, and kinetic type.

**Build-to reference (approved by the user):**
`docs/superpowers/specs/assets/field-manual-v3.html`. It is a standalone file with
inline CSS/SVG/JS, GSAP + ScrollTrigger + Lenis. The production site must look and
move like this file. Port it; do not reinterpret it.

## Locked decisions

- **World:** engineering field manual. Each chapter is a drafting SHEET with a title
  block (sheet no., drawn by, scale, date, rev). There is a right-edge sheet index and
  a drafting-stamp "KK" monogram. Schematics draw themselves on scroll, and an orange
  request dot (the protagonist) travels between sheets via FROM/TO SHT connectors.
  Stamps thunk down, handwritten pencil notes appear, and sheets slide over each other
  with torn/deckled edges.
- **Ground:** ONE fixed near-black ground (`#0b0e14`) on every sheet. There are NO
  colour fields or gradients in the background. The user rejected background colour
  because it pulled attention off the content.
- **Accent ("Heat"):** `--sig:#ff5a1f`, `--pop2:#ffd60a`. Colour moves ONLY on content:
  - flow comets along drawn architecture lines (live once a line is drawn);
  - gradient underline sweeps on key phrases as each note lights up;
  - a moving two-colour sheen on metrics;
  - one colour sweep through each sheet title on arrival;
  - nodes and stamps breathing between the two accents.
- **Type:** Big Shoulders Stencil Display (display), Martian Mono (labels), Reenie
  Beanie (handwritten notes), Instrument Sans (text). Load them via `next/font/google`.
- **Sheets (story):** 00 Cover · 01 Ingestion (Mercedes-Benz) · 02 Fleet
  Reconciliation (Pure Storage) · 03 Rollout Safety (Pure Storage disruption manager)
  · 04 Tenant Isolation (RoonCyber) · 05 Durable Workflows (Beacon,
  temporal-onprem-stack).
- **Appendices (approved):** these come after the story and before contact. They use
  the same paper and title block, are NOT pinned, and their rows draw in.
  - A · Parts list: skills.
  - B · Specifications: education, the IEEE 2022 publication, certifications.
  - C · Field notes: writing/blogs, from the existing blog manifest.
- **06 Issued for hire (contact):** the transmittal drawing plus the ending: the dot
  exits "TO: YOU", the Email tag, the ISSUED FOR HIRE stamp. It also has the working
  contact form (existing `ContactForm` + `/api/contact`), the email (`profile.email`),
  the résumé download, GitHub and LinkedIn.
- **Research Assistant: removed from the ENTIRE site** (user, 2026-11-11). This means
  `src/data/research.ts`, `Research.tsx`, `profile.ts` nowLine / about.closing /
  quickInfo "CURRENT ROLE", and any metadata/JSON-LD/embed mention. The "now" line
  becomes: "MS CS @ Northeastern · open to full-time May 2027".
- **Résumé:** `public/files/KushalKrishnappa.pdf` is replaced with the user's latest
  (2026-11-04).
- **`/embed` signature:** a cropped cover sheet (name + title block), legible at small
  iframe sizes, no scroll, no motion beyond the name settling.
- **`/blogs`:** restyled as "Field Notes" on the same paper and type.
- **Retired:** the old hero/HeroField, Statement, Metrics marquee, ImpactMetrics,
  Whoami, the Systems scenes, the Cursor, and the Monumental Nameplate tokens.

## Content rules (defensible wording; binding)

Every claim must survive an interview follow-up. Facts come from `src/data/*` and the
v3 reference only.

- **Disruption manager:**
  - It is Pure's internal rollout-safety control point that Dominator consults.
  - The DENIED/REQUESTED/PERMITTED states are presented as Dominator's existing
    protocol, which his service served.
  - "A generic Go version was later open-sourced by the Dominator maintainer". He did
    NOT open-source it.
  - No "3,000" group size and no availability %. "BUDGET 2 / GROUP" is labelled
    illustrative.
- **Beacon state diagram:** labelled "Illustrative · state names and codes are not
  from the source".
- Never claim authorship of Auth Server or kvstore. dsapanicle.com = contributor.
- RoonCyber had design partners, not customers.
- No internal Jira keys, PR numbers, internal names, or colleague names.

## Architecture (Next.js 15 App Router, React 19, Tailwind v4, TS)

- `src/app/page.tsx` renders `<FieldManual />` (client) plus server-fetched blog
  posts for Appendix C.
- `src/app/components/manual/`:
  - **Shared furniture:** `Sheet` (paper, frame, zones, tear edge, sticky stage),
    `TitleBlock`, `SheetIndex`, `Monogram`, `Stamp`, `SpecTable`, `GeneralNotes`,
    `FactPanel`.
  - **One drawing component per sheet:** `sheets/Cover.tsx`, `Ingestion.tsx`,
    `Fleet.tsx`, `Rollout.tsx`, `Tenant.tsx`, `Workflows.tsx`, `Appendices.tsx`,
    `Contact.tsx`.
  - **Motion code:** `motion/useFieldManual.ts` holds the ported GSAP timelines,
    keyed per sheet, plus the flow/lit/sweep colour runtime. It runs inside
    `useLayoutEffect`/`gsap.context`, with cleanup on unmount.
  - Use the existing `SmoothScroll` (Lenis) if compatible, otherwise the v3
    approach.
  - **Styles:** `field-manual.css`, ported from v3 (imported once).
- Content stays in `src/data/*`. Add sheet metadata (sheet no., title, rev, scale)
  where useful. Drawing labels may live in the drawing components.
- `prefers-reduced-motion`: render every sheet fully drawn and static, with no
  pinning (as in v3).
- Mobile (≤760px): follow v3's simplified layout. No horizontal scroll.
- Remove the debug/capture hooks from v3 (`#shot`, `?static`, etc.).

## Verification

- `npm test`, `npm run lint`, and `npm run build` all pass.
- Browser checks at 1440×900 and 390×844, plus reduced motion. Sweep every sheet:
  no console errors, no horizontal scroll, text legible, the RA absent everywhere
  (grep), `/embed` and `/blogs` render.
- Compare against the v3 reference screenshots sheet by sheet.
