# DESIGN.md: the Field Manual system

This documents what is built. The binding spec and content rules are in
`docs/superpowers/specs/2026-11-11-field-manual-design.md`, and the approved visual
reference is `docs/superpowers/specs/assets/field-manual-v3.html`. When this file
and the code disagree, the code wins; fix this file.

All styles live in `src/app/components/manual/field-manual.css`. Every page renders
inside an `.fm` root, which carries the four font variables (`fonts.ts`).

## Ground and ink

There is one fixed, near-black drafting ground on every sheet and every page. No
colour fields or gradients go in the background (user decision).

| Token | Value | Use |
|---|---|---|
| `--paper` | `#0b0e14` | the sheet ground |
| `--paper-lo` / `--paper-deep` | `#090c11` / `#06080c` | monogram disc / page behind the sheets |
| `--ink` | `#e9edf3` | primary line work and text |
| `--ink2` | ink @ 60% | labels, secondary text, frame line |
| `--ink3` | ink @ 26% | hairlines, row rules, chip hairline |
| `--ink4` | ink @ 10% | inner frame line |
| `--grid` / `--grid2` | ink @ 2.8% / 5.5% | 24px / 120px drafting grid |

The paper (`.paper-bg`) layers grain, a centre fold and the grid. `.paper-fringe` is
the lighter torn edge, and `.tear-shadow` is the shadow it casts on the sheet below.

## Heat accent: content only

`--sig: #ff5a1f` (orange) and `--pop2: #ffd60a` (yellow). These colours only ever
move on content, never on the ground or the chrome:

- the request dot (the protagonist), stamps with `.o`, and hot nodes (they breathe
  sig ↔ pop2);
- flow comets on drawn lines;
- the gradient underline on key phrases (`<b>` in notes, `.hl` in appendices);
- the sheen on metrics (`.fc h4`, `.lbl-b`, `.sheen`, the BOM total);
- one sweep through each sheet title on arrival;
- the active square in the sheet index, the corner ticks on client plates, focus and
  hover states.

Nothing orange or yellow ever touches a logo chip (see Logo rules).

## Type roles

| Role | Family | Where |
|---|---|---|
| Display | Big Shoulders Stencil, `opsz` pinned to 72 (the Display cut), wght 735 ≈ v3's 800, 900 for the name | sheet titles, the cover/embed name, title-block title, stamps, buttons |
| Mono | Martian Mono 500 | eyebrows, labels, zone markers, table heads, title-block cells, rail |
| Hand | Reenie Beanie | pencil notes in drawings, `.hand-note` |
| Text | Instrument Sans | body copy, schedule values, notes, log excerpts |

Mono labels are uppercase and tracked (`.14em` to `.24em`). Sheet titles use
`clamp(52px, 7.3vw, 116px)` at line-height .84, and `12.6vw` on mobile.

## Sheet anatomy

- **Sheet** (`Sheet.tsx`): a tall section (`--h`, 290 to 470vh) holding a sticky
  100vh `.stage`. Inside the stage are the paper, a `.frame` (1.5px ink2 line with an
  inner ink4 line, plus a vertical rule 104px from the right for the rail gutter), the
  **zones** (1 to 8 across, A to F down, with ticks), the header, the content and the
  title block. Each sheet after the first overlaps the previous one by 100vh
  (`margin-top: -100vh`).
- **Header**: an `.eyebrow` (mono, with a 26px leading rule) over `.sheet-title`.
- **Title block** (`TitleBlock.tsx`): the bottom-left box, var(--col) + 34px wide.
  Its cells are Project (with the client chip when there is a client), Sheet `NN/10`
  (Appendix `X/C` on the appendices), Title, Rev, then three cells from data (Drawn,
  Date/Type, Scale/Status).
- **Notes column** (`.notes`, width `--col: min(392px, 29vw)`) holds a **Schedule**
  (`SpecTable`: mono th, text td; the first row gets the Heat underline while the sheet
  is on) and **General notes** (`GeneralNotes`: numbered; `**phrase**` lights up).
- **Drawing** (`.drawing > svg.dwg`): this is the SVG vocabulary. `.ink` lines (`.b`
  bold, `.t` thin), `.fade`, `.pop`, `.lbl`, `.hand`, `.dimln`, `.ctr`. The
  `FROM SHT` / `TO SHT` connectors chain the sheets.
- **Client plate** (`ClientPlate.tsx`): a nameplate beside the title. It has a hairline
  frame that draws itself, sig corner ticks, a mono label on the frame line
  (`Client · Plate 01`, or `School · Plate B.1`) and a CompanyMark chip. An optional
  caption is set as explicit nowrap lines, centred on the chip (Mercedes:
  `MERCEDES-BENZ` / `R&D INDIA`).
- **Stamps** (`svgParts.tsx`, `Stamp`): a double border, display title, mono sub and
  the stampTex filter. They thunk in at scale 2.3 to 1 with a ring burst and a 3px
  frame jolt.
- **Fact panel** (`FactPanel.tsx`, sheet 02): a masked track of five cards scrolled
  one at a time. The active card gets a sig rule and the number sheen. Static: the
  cards sit in two columns.
- **Overlays**: sheet 05 carries a light vellum (`.vellum`, HTML over the drawing,
  slides in from the right); sheet 03 carries a dark incident film (`.incident`, an
  SVG group inside the drawing, slides up over the lower half). Both stay in place
  at the end and in the static layout.
- **Leaf** (`Leaf.tsx`): an unpinned sheet that is as tall as its content, with the same
  paper, frame, zones, header and title block. It is used by the appendices, `/blogs`
  and 404. `.leaf-grid` puts the notes column beside the main column. Its rows
  (`[data-row]`) carry a top hairline.
- **General data** (`GeneralData.tsx`, id `gd`): an unpinned leaf between the cover
  and 01. It holds still under the lifting cover (sticky stage, a 260vh tail), the
  hero dot lands on its datum, six figures count up once (`.counted`, the same
  formats as the sheets: int, one decimal, MTTR minutes), a quieter second row
  follows, and 01 slides over it. Every figure links (`data-go`) to the sheet that
  draws it. Copy lives in `generalData` / `generalDataMore`.
- **Appendices** (`sheets/Appendices.tsx`, between 09 and 10, z 9):
  - **A · Parts list**: a bill of materials (balloon item no., assembly, parts, qty,
    and a total with sheen). Primary parts (`profile.chips`) are `.hl`.
  - **B · Specifications**: education (the Northeastern plate next to the MS entry,
    coursework and course projects; PES research, the 5G edge project and the
    specialization), the IEEE CONECCT 2022 publication and dated certifications.
  - **C · Field notes**: the latest posts as log lines (entry no., date, title,
    excerpt, ↗), with a quiet empty line linking to `/blogs`.
- **Sheet index** (`SheetIndex.tsx`): the fixed right rail with a progress line. Items
  run Cover 00, Data GD (grouped under the cover), 01 to 09, then the appendices,
  then 10. The appendices are grouped:
  tighter spacing, smaller type, diamond markers and tick marks bracketing the group
  on the rail line. `data-go` holds the target element id. Sheet ids are `s1`–`s10`
  (the sheet number); the band is `gd`.
- **Chrome** (`Chrome.tsx`): the KK drafting-stamp monogram (its ring turns with
  scroll) and the mono nav pills. `PageChrome` is the same chrome for `/blogs` and
  404, where it links home with plain `<a>` so the manual gets a full load and its
  pre-paint motion gate.

## Motion vocabulary

All motion code is in `motion/useFieldManual.ts`: one `gsap.context`, Lenis on the GSAP
ticker, and cleanup on unmount.

- **Draw-in**: every `.ink` gets `pathLength=1` and its dashoffset is scrubbed from
  1.02 to 0. Markers (arrowheads) attach when a line finishes. `.solid` fills follow.
- **Scrubbed sheet timelines**: one per story sheet, covering draw, fade, pop,
  callout, stamp, and the dot travelling along `.route` paths with a sig `.trail`
  behind it.
- **Flow comets**: once a structural line is fully drawn (dash offset ~0) on the
  active sheet, a cloned `.flow` path runs a 5/95 dash along it in sig (every third
  one in pop2). Plate frames carry a slow one. Lines a timeline scales or swaps in
  instead of drawing (strikes, needles, check marks) carry `.nf` and get no comet.
- **Lit highlights**: a general note at full opacity gets `.lit`, and its `<b>`
  phrases sweep in a sig→pop2 2px underline. In the appendices the same underline is on
  `.hl`, keyed on the row's `.in`.
- **Title sweep**: when a sheet or appendix becomes active (`.sweep`), one sig/pop2
  band passes through the stencil title (1.8s, once).
- **Sheet-over-sheet**: each sheet or leaf slides in over its predecessor in the flow
  with a slight rotation and x offset. The predecessor shades (to .62) and recedes
  (scale .955). A leaf predecessor recedes about the viewport's top edge.
- **Leaves in the stack**: an appendix slides over 09 (or the previous appendix),
  scrolls naturally, then sticks once its end reaches the viewport bottom. The hook sets
  a negative sticky `top`, and `.leaf-tail` provides the 100vh overlap that the next
  sheet slides over. This is how 10 slides over Appendix C, and 01 over the band.
- **Row draw-in (appendices)**: not scrubbed. As each row enters the viewport (94%),
  its rule draws left to right, its cells rise in with a stagger, and its key phrase
  lights. Each row draws once.
- **Cover**: the name's characters rise in, the cap/base guides and cap-height
  dimension draw, and the dot lands. On scroll the characters scatter and the cover
  lifts away while the dot arcs onto the general-data datum.
- **Ship-2 timelines** (`motion/builders.ts`): 04 (the release line: crate retired,
  three press strokes, the gate's lamps, the rack fills, a second image), 05 (the
  keyed-entry vellum: request path, the dot enters only its own room, a forged URL
  bounces), 06 (cold-start flood, watermark steps, the cap valve defers, the bell
  rings once, tracker vs feed, the re-surfacing escalation), 07 (the dot walks the
  days; 16 PR bars land as it passes), 08 (one feature rides the loop; each gate lamp
  lights; the drift needle and the autonomy dial turn). They share the v3 helpers
  through a `Kit`.
- **Embed**: only the name settles in (two words rise .16em and fade in), and then the
  dot pops.

## Logo rules (user-mandated, strict)

`CompanyMark.tsx` renders the original, untouched file from `public/logos/` in its own
colours, on a chip of its native ground. Mercedes and Northeastern sit on `#000`, and
Everpure and RoonCyber on `#fff`. Each chip has a 1px `--ink3` hairline and a 2px radius.

- Never recolour, mono, crop to a glyph, filter, mask, clip-path, blend or reduce the
  opacity of a mark. It is fitted with `object-fit: contain` only.
- Chips are fixed and even per context: `plate` 220×64 (150×44 on mobile),
  `rev` 84×20 (eight revision rows), and `tb` 84×22. `LOGO_FIT` sets the logo height as a share of the
  chip, tuned by eye for equal visual weight (mercedes .82, everpure .52,
  rooncyber .4, northeastern .9).
- Field-manual accents (ticks, comets, labels, captions) stay outside the chip. Animate
  the plate, never the mark.
- `src/data/data.test.ts` guards the chip CSS against filter, mask, clip-path and
  opacity.

## Reduced motion and mobile

- **`prefers-reduced-motion: reduce`**: the layout gate never adds `html.motion`.
  There is no Lenis, no timelines and no pinning. Every sheet renders as a 100vh
  (min 860px) static stage, fully drawn, with the dot at its final position. The
  appendices are fully drawn and lit. Comets are hidden, and the sheen, node breath and
  title sweeps are off. The rail still tracks and links still scroll. If JS fails or
  stalls for 5s, the page falls back to this layout too.
- **Mobile (≤760px)**: the inset drops to 10px, and the zones, the rail gutter rule,
  the cover revisions and the nav are hidden (on `/blogs` the nav stays). The sheet
  layout follows v3: the drawing sits on top (40vh) with the notes under it, and only
  the first three notes show. The rail is reduced to squares. The RFI form moves to an
  unpinned continuation sheet. Appendix tables restack (BOM: assembly over parts; log:
  date over title). There is no horizontal scroll.

## Surfaces

- `/`: the manual (cover, general data, 01 to 09, appendices A to C, 10). Blog posts for C are
  fetched server-side in `page.tsx` (`getAllPosts`, `[]` on failure).
- `/blogs`: "Field notes", one leaf with the full log (with tags) and the page chrome.
- `/embed`: the signature, a cropped cover (noindex). The name is on one line in wide
  frames (font size from width ÷ 8.1, capped at 31vh) and on two lines when aspect
  ≤ 2:1 and height ≥ 420px. It has a compact one-row title block. Tested at 600×200,
  800×300 and 1440×900.
- 404: "Sheet missing", a leaf with a link home.
- OG image (`opengraph-image.tsx`): the drafting ground and grid, the frame, the
  stencil name, the orange dot, the role box and the availability line, centred.
  No eyebrow and no title block (thumbnail-size reading). It uses bundled glyph
  subsets in `src/assets/og/`; re-subset them if that copy changes.

## Content rules

Marketing policy (user, 2026-11): strong, confident wording; impressive figures are
shown as plain facts (the 3,000-machine pool and availability figures included). The
floor still holds: no authorship of Auth Server/kvstore, the Dominator Go port or
protocol, in-kernel eBPF programs, or teammates' M2M lifecycle endpoints; no Spot
Award / YouTube / LeetCode / LendWise; no internal keys, PR numbers, tool, table,
route or service names, or colleague names (titles only); design partners, not
customers; the Research Assistant role stays off the site. `src/data/data.test.ts`
enforces the floor. Copy lives in `src/data/*`. Drawing labels live in the sheet
components.
