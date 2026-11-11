# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: technical recruiters, hiring managers, and engineers evaluating Kushal
Krishnappa for **backend / platform / infrastructure / SRE software-engineering
roles** (full-time, graduating May 2027; also open to internships/co-ops before
then). They usually arrive from a resume-PDF link, LinkedIn, GitHub, or recruiter
outreach, skim fast on desktop or mobile, and may cross-check claims against his
GitHub and LinkedIn before replying.

Secondary: fellow engineers and collaborators, and people who found a blog post.

## Product Purpose

A personal portfolio site that presents Kushal's engineering experience, the
production systems he has built, his projects, and his writing, in order to win
interviews and offers for backend & platform engineering roles. Success = a
visitor understands, within seconds, that he has real depth in distributed
systems / platform / reliability at scale, and is moved to reach out, download
the resume, or advance him.

## Positioning

Backend & platform engineer who builds **"invisible infrastructure for visible
impact"**: distributed systems, multi-tenant isolation, and reliability at scale.
What a neighboring new-grad portfolio cannot truthfully copy is the *depth of
real production systems* behind the claims — OpenStack fleet orchestration for a
2,000-testbed / 9,000+-VM fleet at Pure Storage, and a multi-tenant AI-security
platform (CNAPP) at a VC-backed startup, RoonCyber — plus three through-lines
that recur across every role: **multi-tenancy, Temporal, and an AI-SDLC practice**
(designing/directing agentic development workflows, then verifying the output
with mutation tests, real-role RLS tests, and property-based tests).

## Operating Context

- Deployed live at **kushalkrishnappa.com**; the resume PDF links to it, so the
  site is a destination recruiters open with the resume already in hand.
- Visitors skim. Many are non-technical recruiters doing a first pass; some are
  senior engineers doing a deep read who will test specifics.
- Resume is downloadable from the site. Contact happens via an on-site form
  (SMTP/nodemailer API route) plus LinkedIn, GitHub, and email.
- A blog exists (pulled from an external manifest) and lives under /blogs.
- **The hero doubles as an embeddable iframe "signature."** The user embeds the
  site (via iframe) in messages to recruiters and hiring managers, where it acts as
  his signature. Consequence: at iframe/first-viewport sizes (including small/banner
  embeds) **his NAME must be dominant and clearly legible** — the name-reveal animates
  then settles to a plainly visible name. A hero where the name is small, hidden, or
  competes with other elements fails this use. Design the top band to read as a
  signature on its own.

## Capabilities and Constraints

- Existing stack (keep): **Next.js 15 (App Router), React 19, Tailwind CSS v4,
  TypeScript**. Content is data-driven under `src/data/*`. Contact form posts to
  `src/app/api/contact/route.ts` using SMTP credentials from env vars. Blog list
  is fetched from a `BLOG_MANIFEST_URL`. Must stay deployable on the current host.
- Sections currently rendered: whoami (hero/about), impact metrics, experience,
  projects, writing, skills, education, publications, certifications, contact.
- **Private material that must never be published** (from the goldmine): internal
  Jira keys, PR numbers, internal table/route/tenant names, colleague names,
  anything from internal PRDs. These may inform wording but never appear verbatim.

## Brand Commitments

- Name: **Kushal Krishnappa**. Tagline in use: *"building invisible infrastructure
  for visible impact."* Favicon/logo mark: "kk".
- The **current site uses a terminal / hacker aesthetic** (monospace, black
  background, `$ command` section headers, a scrolling `./kushalkrishnappa` nav
  banner). This is treated as *evidence of the current identity, not a binding
  pin*: the user has explicitly opened the visual identity to a redesign via the
  design skill, so later visual-direction work may preserve, evolve, or replace it.
- **Binding visual constraints (user, 2026-11-09):**
  - **Dark theme only — no light theme at all.** Every direction renders on a dark
    ground; no light-mode variant ships. (Consistent with the current black site.)
  - **Name-reveal intro on page open.** The hero reveals "Kushal Krishnappa" with
    motion as the page loads (e.g. a split-text / staggered display reveal), per the
    reference site **abhirao.in** the user cited — a dark (`#0a0a0a`), Go-cyan-accent,
    motion-forward "backend & platform engineer" site with a two-line split-text name
    reveal, role + current-company line, and keyword chips. Use it as a *craft-bar and
    mechanic reference only* — do NOT clone it; it is a real person's (Abhishek Rao,
    a collaborator) site and brand. Kushal's identity must be his own.

## Evidence on Hand

Real, usable material (authoritative order: the site will become the source of
truth, the resume will be updated to follow it):

- **Resume PDF** — `~/Desktop/KushalKrishnappa.pdf` — current public claims.
- **Career goldmine** — `~/Playground/jobs/career/goldmine/` — deeply sourced,
  per-role facts *with explicit "defensible wording" notes* distinguishing what
  holds up from what overstates. Primary content source.
- Real roles: **Mercedes-Benz R&D** (SWE Intern then SWE, 2022), **Pure Storage /
  Everpure** (Member of Technical Staff 2, 2023–2024), **RoonCyber** (Software
  Engineer, Co-op, Jan–Aug 2026).
- Strongest systems stories (defensible): Pure **Auto Sim Rehab** reconciliation
  service (MTTR 5h→10min) and **disruption-manager** rollout-safety service;
  RoonCyber **alert-bell AI-security notification platform** (3 detectors,
  idempotent watermarks, mutation-tested — his largest system, not yet on the
  site) and the **AI Identity ownership story** (took over a pipeline two weeks
  before a board-requested launch and shipped on schedule).
- Projects, by authorship (verified against git): **Beacon** (Go + Temporal
  notification service, sole author — strong), **temporal-onprem-stack** (self-
  hosted Temporal with mTLS, has a blog write-up), **ebpf-http-scan** (sole
  author, early). **Auth Server and kvstore are NOT his by git authorship** —
  do not claim authorship. **dsapanicle.com** is a contributor role, not his
  platform.
- **Research Assistant** with Prof. Xiang Ren, Systems Research Group, Northeastern
  (Aug 2026–present) — real; not currently on the site.
- Publication: **IEEE 2022**, "An Enhanced Deployment of 5G Network Using a
  Multi-Objective Genetic Algorithm."
- Certifications: HashiCorp Terraform Associate (004), AWS Fundamentals, OWASP ZAP,
  Java OOP, Foundations of Responsible AI.

**Claims to soften or drop** (the goldmine flags these as overstated; future copy
must not assert them as written): "90%+ automation rate" (no source), eBPF
"30% visibility" / "90% MTTD/MTTR" (estimated), "ported to Go and open-sourced"
(a maintainer open-sourced a *generic* version), "unblocking enterprise deals"
(the deal did not close; the design was reused as the platform's MCP auth layer),
"25+ features over 3 months" (→ over 4 months), Auth Server / kvstore authorship.

**Absences that must not be fabricated:** paying customers at RoonCyber (design
partners only), specific customer names, any benchmark not actually measured.

## Product Principles

1. **Every claim survives an interview follow-up.** Prefer a strong true specific
   over an impressive unverifiable one; the site becomes the source of truth.
2. **Depth over breadth.** A few deep systems stories outweigh a long list of
   shallow bullets.
3. **Show the through-lines** — multi-tenancy, Temporal, reliability, AI-SDLC —
   so a scanning reader sees a coherent engineer, not a pile of tasks.
4. **Respect the skim, reward the deep read.** The value is legible in seconds;
   depth is available on demand for the senior engineer who tests specifics.
5. **Credit honestly** — collaborators named, prototype vs. shipped distinguished.
   Integrity is itself part of the pitch for a systems engineer.

## Accessibility & Inclusion

General web accessibility: semantic structure, keyboard navigability, sufficient
contrast, and respect for `prefers-reduced-motion` (already honored in the current
site). Must read and work well on both mobile and desktop.
```
