# Portfolio Redesign — Monumental Nameplate — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild kushalkrishnappa.com into a dark, monumental-typographic portfolio whose hero is a name-dominant signature, with defensible content rebuilt from the career goldmine.

**Architecture:** Keep Next.js 15 App Router / React 19 / Tailwind v4 / TS, data-driven under `src/data/*`. Replace the terminal aesthetic with the **Monumental Nameplate** world (dark-only). The approved first-viewport contract is `.impeccable/mocks/decision/model-pick.html`; the durable visual contract is `.impeccable/surfaces/src-app-page-tsx.md`; the content spec is `docs/superpowers/specs/2026-11-09-portfolio-redesign-context.md` (§"Content plan"). Depth-over-breadth: a few deep systems case studies lead.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, TypeScript, next/font (Archivo display + Geist Mono), vitest.

**Authoritative references (every implementer reads these):**
- Visual: `.impeccable/mocks/decision/model-pick.html` + `.impeccable/surfaces/src-app-page-tsx.md` (direction contract).
- Content (defensible, do-not-fabricate): `docs/superpowers/specs/2026-11-09-portfolio-redesign-context.md`.
- `PRODUCT.md` (constraints: **dark-only; hero = iframe signature, name must dominate & stay legible small**; private-never-publish list).

**Global rules for all tasks:**
- Dark theme only. No light mode, no `prefers-color-scheme` light branch.
- Never publish private items (internal Jira keys, PR numbers, internal table/route/tenant names, colleague names). Use the defensible framings only.
- Keep `npm run build`, `npm run lint`, `npm test` green at the end of every task.
- Preserve working behavior: the contact API (`src/app/api/contact/route.ts`), blog manifest fetch (`src/lib/blog.ts`), résumé download (`/files/KushalKrishnappa.pdf`).
- Respect `prefers-reduced-motion` for all motion.

---

### Task 1: Dark design tokens + fonts (global world)

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1:** In `layout.tsx`, replace the Geist sans/mono setup with: keep `Geist_Mono` (variable `--font-geist-mono`) for labels/meta/chips; add `Archivo` from `next/font/google` (weights 400–900, variable `--font-display`) for the monumental wordmark and headings; keep a clean body sans (Geist). Do NOT use Inter/Helvetica/Arial/Space Grotesk as display.
- [ ] **Step 2:** Rewrite `globals.css` tokens for a **dark-only** world. Define on `:root` (no light media query): `--bg:#0A0A0A; --surface:#111317; --bone:#ECECEA; --dim:#8A8F96; --faint:#5C6066; --accent:#4DD4E0; --accent-dim:#1C3B3E; --line:#1E1E1E; --line-2:#2A2A2A;`. Set `body{ background:var(--bg); color:var(--bone); }`. Remove the old light `:root`/dark `@media` block and the Arial body font. Keep `prefers-reduced-motion` smooth-scroll guard and `section[id]` scroll-margin. Add utility keyframes for reveals (see Task 8) — or leave for Task 8.
- [ ] **Step 3:** Add a type-scale + spacing comment block and any shared helpers (e.g., `.mono{font-family:var(--font-geist-mono)}`, display helper). Ensure a single accent is used sparingly (per contract).
- [ ] **Step 4:** Run `npm run build` and `npm run lint`. Expected: PASS. Visually confirm the page is near-black with bone text (sections still old — fine for now).
- [ ] **Step 5:** Commit: `style(theme): dark-only Monumental Nameplate tokens + Archivo display font`.

---

### Task 2: Types for the new content model

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1:** Extend `Profile.about`/add fields the hero needs: a `nowLine` (current status string), `chips: string[]` (stack keywords), and keep `socials`. Keep `name`, `tagline`, `availability`.
- [ ] **Step 2:** Add a `SystemCaseStudy` type for the depth showcase: `{ slug: string; name: string; org: string; period: string; role: string; summary: string; problem: string; approach: string[]; highlights: string[]; stack: string[]; outcome: string; status?: "shipped"|"prototype"; }`.
- [ ] **Step 3:** Add a `Research` type: `{ title: string; advisor: string; group: string; period: string; summary: string; skills: string[]; }`. Extend `Education` with optional `honors?: string`.
- [ ] **Step 4:** Extend `Project` with `links?: {label:string;url:string}[]`, `role?: string` (e.g. "sole author", "contributor"), and `year?: string`. Extend `Experience` achievement items may stay `string[]`; add optional `summary?: string` and `tags?: string[]`.
- [ ] **Step 5:** `npm run build` (type-check) PASS. Commit: `feat(types): content model for systems, research, richer projects`.

---

### Task 3: Rebuild content data (defensible, from goldmine)

**Files:**
- Modify: `src/data/profile.ts`, `src/data/impact.ts`, `src/data/experience.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/data/education.ts`, `src/data/publications.ts`, `src/data/certifications.ts`
- Create: `src/data/systems.ts` (SystemCaseStudy[]), `src/data/research.ts` (Research)

**Content source of record:** `docs/superpowers/specs/2026-11-09-portfolio-redesign-context.md` §"Content plan". Use the defensible framings; apply every softening in §"feedback-defensible-content". Key specifics:
- **impact.ts:** `5h → 10min` MTTR; `9,000+` VMs; replace "90%+ automation rate" with `66 PRs / 61 tickets · ~4 months` (RoonCyber) OR `2,000-testbed fleet`.
- **profile.ts:** tagline "building invisible infrastructure for visible impact"; `nowLine` = "Research Assistant @ Northeastern · open for full-time May 2027"; `chips` = ["Go","Kubernetes","Temporal","AWS","multi-tenant","distributed systems"]; availability "Open to backend / platform / infra / SRE roles".
- **systems.ts (lead with these 3):** (1) Alert-bell AI-security notification platform (3 detectors, idempotent per-tenant watermarks, zero-drop emission caps, dedup/escalation state in a tracker, panic recovery, mutation-tested, real-role RLS tests; outcome: most-requested demo feature). (2) Auto Sim Rehab reconciliation service (Python+Temporal; MTTR 5h→10min; distributed Temporal semaphore live-tunable via Consul; service-account-scoped). (3) AI Identity ownership (took over NHI pipeline 2 weeks before a board-requested launch; 16 PRs in 3 weeks; shipped on schedule). Mark status shipped. No private names/keys.
- **experience.ts:** three roles with defensible bullets (RoonCyber Co-op Jan–Aug 2026; Pure MTS2 2023–24; Mercedes 2022). Soften: "a generic Go version was later open-sourced by the Dominator maintainer"; "design later reused as the platform's MCP auth layer" (not "enterprise deals"); "25+ features over 4 months"; drop eBPF 90%/30%. RoonCyber = VC-backed, design partners (not paying customers).
- **projects.ts:** Beacon (sole author, Go+Temporal; link `kap-theorem/beacon`), temporal-onprem-stack (mTLS; blog), ebpf-http-scan (sole author, early). Frame dsapanicle as contributor. **Remove Auth Server & kvstore** (not his by git). Add `role`/`links`.
- **research.ts:** RA with Prof. Xiang Ren, Systems Research Group, Aug 2026–present; relational debugging (Perspect, OSDI '23) vs Kubernetes control-plane perf bugs; skills Kubernetes, Operating Systems.
- **education.ts:** Northeastern MSCS (4.0, Jan 2025–May 2027), PES B.Tech CSE (2018–2022). **skills.ts/publications.ts/certifications.ts:** keep current (already accurate), minor tidy.

- [ ] **Step 1:** Write `src/data/systems.ts` and `src/data/research.ts` with the content above (typed per Task 2). Keep every claim to the defensible wording; no private material.
- [ ] **Step 2:** Update `profile.ts` (nowLine, chips), `impact.ts` (fix the 3rd metric), `experience.ts` (softened bullets), `projects.ts` (remove Auth Server/kvstore, add Beacon/temporal-onprem/ebpf-http-scan with roles+links, reframe dsapanicle), `education.ts` (unchanged or honors), leave `skills.ts`/`publications.ts`/`certifications.ts` accurate.
- [ ] **Step 3:** Add a light vitest `src/data/data.test.ts`: assert no data string matches the private denylist regex (`/PENG-\d|PR #\d/`), assert `projects` contains no `name` of "Auth Server"/"kvstore", assert `impact` has exactly 3 metrics and none equals "90%+". Run `npm test` → PASS.
- [ ] **Step 4:** `npm run build` PASS. Commit: `content: defensible rebuild from goldmine + systems/research data`.

---

### Task 4: Hero — the Monumental Nameplate signature

**Files:**
- Create: `src/app/components/sections/Hero.tsx` (replaces `Whoami.tsx` in the hero role)
- Modify: `src/app/page.tsx` (swap Whoami → Hero)
- Reference: build to match `.impeccable/mocks/decision/model-pick.html`

- [ ] **Step 1:** Build `Hero.tsx` as a client component matching the approved mock: a giant two-line wordmark `KUSHAL` / `KRISHNAPPA` (Archivo, heaviest weight, `clamp()`-scaled to fill the first viewport, `letter-spacing:-.03em`, `line-height:.86`), left-anchored. Below: the role line "Backend & platform engineer — invisible infrastructure for visible impact." Bottom-left: a live `nowLine` with an accent dot + keyword `chips` (mono pills). Bottom-right: proof metrics from `impact`. The name must stay dominant and legible down to ~380px width and short iframe heights.
- [ ] **Step 2:** Implement the **split-text name reveal**: wrap each letter in a span; stagger opacity/`translateY`/blur in on mount via CSS animation (JS only to add a `data-revealed` class after mount). It must **settle to a fully legible name** and be instant under `prefers-reduced-motion`. No layout shift.
- [ ] **Step 3:** Add the primary action (cyan "contact" link to `#contact`) and a secondary "résumé ↓" (download `/files/KushalKrishnappa.pdf`), consistent with the nav.
- [ ] **Step 4:** `npm run build` + `npm run lint` PASS. Capture a desktop (1440) and mobile (390) screenshot into `.impeccable/review/`; confirm the name dominates both and matches the mock arrangement/palette/type.
- [ ] **Step 5:** Commit: `feat(hero): Monumental Nameplate signature with split-text reveal`.

---

### Task 5: Navigation restyle

**Files:**
- Modify: `src/app/components/Navigation.tsx`

- [ ] **Step 1:** Replace the scrolling `./kushalkrishnappa` terminal banner with a quiet nameplate nav: a "KK" monogram (Archivo) left; links (experience, systems, projects, writing, contact) right in mono; a cyan "contact" button; keep the résumé download action. Fixed, near-black, hairline bottom border, backdrop-blur. Keep it unobtrusive so the hero wordmark leads.
- [ ] **Step 2:** Keep accessible: `aria-label`, keyboard focus states (accent focus ring), mobile menu (the current markup hides links on mobile — add a minimal accessible disclosure or keep contact+résumé visible).
- [ ] **Step 3:** `npm run build`+`lint` PASS. Commit: `style(nav): quiet nameplate navigation in the new world`.

---

### Task 6: Section components restyle + SectionHeader

**Files:**
- Modify: `src/app/components/SectionHeader.tsx`, and sections: `ImpactMetrics.tsx`, `Experience.tsx`, `Projects.tsx`, `Skills.tsx`, `Education.tsx`, `Publications.tsx`, `Certifications.tsx`, `Writing.tsx`, `Contact.tsx`, `ContactForm.tsx`

- [ ] **Step 1:** Re-skin `SectionHeader` from the `$ command` terminal style to a monumental-world section header: a large Archivo heading + a mono index/eyebrow (e.g., `01 — EXPERIENCE`) + hairline rule. One consistent rhythm (more space above a heading than below).
- [ ] **Step 2:** Restyle each section to the dark tokens: bone text, `--surface` cards with `--line` borders, accent used sparingly (links, active states, the "now" dot, metric values). Experience as a clean timeline; Projects as focused cards showing `role`+`links`; Skills as grouped mono chips; Education + a Research block; Publications/Certifications as tidy lists with links. Remove terminal `▸`/`$` motifs except where they're a deliberate mono accent.
- [ ] **Step 3:** Keep `ContactForm` behavior (posts to `/api/contact`); restyle inputs to the dark world with accent focus rings; preserve validation and success/error states.
- [ ] **Step 4:** `npm run build`+`lint` PASS; screenshot the full page (desktop+mobile); confirm one coherent world, no light leaks, no horizontal scroll at 390px. Commit: `style(sections): restyle all sections to the Monumental Nameplate world`.

---

### Task 7: Featured Systems case-study section (depth over breadth)

**Files:**
- Create: `src/app/components/sections/Systems.tsx`
- Modify: `src/app/page.tsx` (place Systems high, right after Hero/ImpactMetrics)

- [ ] **Step 1:** Build `Systems.tsx` rendering `src/data/systems.ts`: the three lead systems (alert-bell, auto-sim-rehab, AI-identity) as expandable case cards — summary + problem + approach bullets + highlights (the hard engineering) + stack + outcome + a shipped/prototype tag. This is the "senior deep-read reward." Accent used for the status tag + key metrics.
- [ ] **Step 2:** Ensure scannable collapsed state (summary + outcome) with expand for depth; keyboard-accessible disclosure; no private material.
- [ ] **Step 3:** `npm run build`+`lint` PASS; screenshot. Commit: `feat(systems): featured deep-dive case studies`.

---

### Task 8: Motion & reveals

**Files:**
- Modify: `src/app/globals.css` (keyframes/utilities), relevant components
- Possibly create: `src/app/components/Reveal.tsx` (a small IntersectionObserver wrapper)

- [ ] **Step 1:** Add a lightweight `Reveal` client component (IntersectionObserver → adds `data-revealed`) and CSS for a single consistent reveal grammar (fade/translate-up on enter). Apply to section headers and cards. Orchestrate once; no scattered hover animations.
- [ ] **Step 2:** Guard ALL motion behind `@media (prefers-reduced-motion: no-preference)`; reduced-motion renders final state immediately (hero name fully visible, sections visible). Bound cost; content visible by default (no content hidden only by animation).
- [ ] **Step 3:** `npm run build`+`lint` PASS; verify with reduced-motion on that everything is visible. Commit: `feat(motion): one reveal grammar with reduced-motion fallback`.

---

### Task 9: Embed/signature route + SEO/OG/metadata

**Files:**
- Create: `src/app/embed/page.tsx` (a compact, standalone signature hero for iframe use — just the nameplate + role + now-line + contact, no nav/scroll)
- Modify: `src/app/layout.tsx` (metadata), create `src/app/opengraph-image.tsx` (OG image = the dark nameplate)

- [ ] **Step 1:** Build `/embed` — the hero signature only, self-contained, dark, name-dominant, works at small iframe sizes (e.g. 600×200 and 800×260); no fixed nav; a single "contact ↗" link. This is what the user embeds in recruiter messages.
- [ ] **Step 2:** Update `metadata` (title, description, keywords, authors, `metadataBase`, Open Graph + Twitter card, canonical). Add a generated `opengraph-image` rendering the dark nameplate. Add JSON-LD `Person` structured data (name, jobTitle, url, sameAs: LinkedIn/GitHub).
- [ ] **Step 3:** `npm run build`+`lint` PASS; load `/embed` at 600×200 and confirm the name is legible/dominant. Commit: `feat(embed+seo): iframe signature route, OG image, structured data`.

---

### Task 10: Finish — verify, Impeccable review, document

**Files:** whole `src/`; create `DESIGN.md` + `.impeccable/design.json` (via documenter)

- [ ] **Step 1:** Run `npm run build`, `npm run lint`, `npm test` — all PASS. Fix any failures.
- [ ] **Step 2:** Capture `.impeccable/review/desktop.png` (1440) and `mobile.png` (390), full page, from document top (settle motion first). Confirm no black/blank/broken captures.
- [ ] **Step 3:** Run `sh .agents/skills/impeccable/scripts/impeccable detect --json src/app/page.tsx src/app/components` (hookless web build); fix mechanical findings.
- [ ] **Step 4:** Spawn the `impeccable-finish-reviewer` with: the original request, the direction contract (`.impeccable/surfaces/src-app-page-tsx.md`), the artifact (`src/app/page.tsx` + components), screenshot paths, the chosen decision comp (`.impeccable/mocks/decision/model-pick.html`) as the critique reference, the craft-floor reference, and the note "no comp (code-led); one detector ran". Act on its disposition (ship/fix/rebuild/recapture).
- [ ] **Step 5:** Spawn `impeccable-documenter` to write `DESIGN.md` + `.impeccable/design.json` from the built world (new world → required). Commit: `docs(design): DESIGN.md for the Monumental Nameplate world`.
- [ ] **Step 6:** Final: `superpowers:finishing-a-development-branch` to integrate.

---

## Self-review notes
- Spec coverage: dark-only ✓ (T1), name-reveal signature ✓ (T4), iframe signature ✓ (T9), defensible content + softenings ✓ (T3), missing big stories (alert-bell/AI-identity/research) ✓ (T3/T7), remove not-his projects ✓ (T3), SEO/OG ✓ (T9), finish review + DESIGN.md ✓ (T10).
- Visual tasks verified by build+lint+screenshots+Impeccable review (not unit tests) — intentional for a code-led design build; data/lib keep tests (T3).
- Private-never-publish enforced by denylist test (T3) + per-task rule.
