# Portfolio Update — Design Spec

**Date:** 2026-06-23
**Author:** Kushal Krishnappa (with Claude)
**Status:** Approved for planning

## 1. Overview

Update the personal portfolio (Next.js 15 / React 19 / Tailwind v4) so its content
matches the current resume and LinkedIn profile, add the missing résumé sections
(Education, Publications, Certifications, and a 4th project), and add a Blog
section backed by in-repo MDX files. The work also refactors the codebase to follow
software-engineering best practices: a single source of truth for content, small
focused components, server/client separation, and removal of dead code.

The existing **terminal aesthetic** (black background, green `$` prompts, cyan
accents, monospace, bordered cards) is preserved throughout. No visual redesign.

## 2. Goals

- Content on the site is accurate and complete relative to the resume/LinkedIn.
- Add Education, Publications, Certifications sections and the DSA Panicle project.
- Add a Blog: `/blog` listing + `/blog/[slug]` post pages, authored as MDX in the repo.
  When no published posts exist, the listing shows a "Working on it" placeholder.
- Refactor to best practices: typed centralized data, componentized sections,
  server components by default, single source of truth, no dead/duplicate code.

## 3. Non-Goals

- No redesign of the visual language (keep the terminal theme).
- No CMS, database, or runtime content fetching (MDX files are read at build time).
- No changes to the contact API behavior (`/api/contact` stays as-is).
- No authentication, comments, search, or RSS for the blog (possible future work).

## 4. Content Decisions (resolved during brainstorming)

1. **Source of truth for titles/dates:** the current site / LinkedIn job *titles*
   are authoritative (NOT the resume's titles). Only obviously-wrong dates are fixed.
2. **Blog architecture:** Markdown/MDX files in the repo.
3. **New sections to add:** Education, Publications, Certifications, and the
   DSA Panicle project.
4. **Skills grouping (KISS, 5 groups):** Languages, Frameworks, Backend, Infra,
   Developer Tools.
5. **Certifications:** lead with Terraform Associate (004), then the resume's four.

### 4.1 Experience (titles kept, dates corrected, bullets enriched)

| Company | Title (kept from site) | Period (corrected) |
|---|---|---|
| Pure Storage | Member of Technical Staff 2 | Jan 2023 – Dec 2024 |
| Mercedes-Benz R&D India | Graduate Engineer Trainee — OTA Updates | Aug 2022 – Jan 2023 |
| Mercedes-Benz R&D India | Software Intern — OTA Updates | Mar 2022 – Aug 2022 *(fixed from `Aug'2023`)* |

Achievement bullets are enriched with the quantified details from the resume
(e.g., 200+ daily operations at ≥95% reliability; 9,000+ on-prem VMs at ≥90%
availability; 1,500+ environments migrated Ubuntu 14→22; 90TB+ ETL on Databricks).

### 4.2 Education (new)

- **Northeastern University** — M.S. Computer Science — GPA 4.0/4.0 — Jan 2025–Present.
  Coursework: Programming Design Paradigms, Algorithms.
- **PES University** — B.Tech Computer Science & Engineering — Aug 2018–Jun 2022.
  Coursework: Machine Learning, Network & Information Security, Big Data, Operating Systems.

### 4.3 Publications (new)

- *An Enhanced Deployment of 5G Network Using Multi-Objective Genetic Algorithm* —
  Published in IEEE. Genetic algorithm optimizing dense 5G base-station deployment
  to minimize cost while maximizing coverage and efficiency. Optional external link
  field (left empty until a URL is provided).

### 4.4 Certifications (new)

1. Terraform Associate (004)
2. AWS Fundamentals: Specialization
3. Web Application Security Testing with OWASP ZAP
4. Object Oriented Programming — Advanced (Java OOP)
5. Foundations of Responsible AI Learning

### 4.5 Projects (add 4th)

Existing three kept (Virtual Calendar, SEED Labs, Yet Another Centralized Scheduler);
add **DSA Panicle** — online platform for algorithmic challenges, built with
Docusaurus + RST, CI/CD via GitHub runners and Hostinger webhooks.

### 4.6 Skills (regrouped, KISS)

- **Languages:** Go, Python, Java, C/C++, TypeScript, R
- **Frameworks:** Flask, Django, Spring Boot, Next.js, React, LangChain
- **Backend:** PostgreSQL, MongoDB, Redis, RabbitMQ, Azure EventHubs, Async I/O, Concurrency
- **Infra:** Docker, Nomad, Temporal, Databricks, Linux, OpenStack, Prometheus, Azure
- **Developer Tools:** Git, GitHub Actions, Jenkins, Packer, Ansible, CI/CD, PyTest, JUnit, Claude Code

### 4.7 Profile

Keep the existing whoami narrative and quick-info cards; add an
"Available: Winter/Spring/Summer 2026" line.

## 5. Information Architecture

**Home (`/`)** — single-page scroll, section order:

1. `whoami` — intro, role, location, availability, quick-info cards
2. `./impact_metrics.sh` — headline numbers
3. `cat experience.log` — Pure Storage, Mercedes ×2
4. `ls ~/projects` — 4 projects (incl. DSA Panicle)
5. `cat skills.txt` — 5 grouped categories
6. `cat education.md` — **new**
7. `cat publications.bib` — **new**
8. `ls ~/certifications` — **new**
9. `contact --send-message` — contact info + form

**Blog (`/blog`, `/blog/[slug]`)** — separate routes (post pages require it).

**Navigation:** trimmed to `whoami · experience · projects · skills · blog · contact · resume`.
Education / Publications / Certifications are reachable by scroll, not in the nav, to
avoid clutter. The `blog` nav item links to `/blog`; the others scroll to sections on `/`.

## 6. Code Architecture (Approach A)

```
src/
  types/index.ts          # Profile, ImpactMetric, Experience, Project, Education,
                          # Publication, Certification, SkillGroup, BlogPostMeta
  data/
    profile.ts  impact.ts  experience.ts  projects.ts
    skills.ts  education.ts  publications.ts  certifications.ts
  lib/
    blog.ts               # getAllPosts(), getPostBySlug(slug)
  app/
    components/
      Navigation.tsx       # updated nav (+ blog link)
      SectionHeader.tsx    # reusable "$ command" header (server component)
      sections/
        Whoami.tsx  ImpactMetrics.tsx  Experience.tsx  Projects.tsx
        Skills.tsx  Education.tsx  Publications.tsx  Certifications.tsx
        ContactForm.tsx    # 'use client' — the only client island on home
        Contact.tsx        # server wrapper (info) embedding ContactForm
    page.tsx               # server component composing the sections
    blog/
      page.tsx             # listing; "Working on it" when empty
      [slug]/page.tsx      # individual post (generateStaticParams + generateMetadata)
    api/contact/route.ts   # unchanged
content/
  blog/                    # .mdx posts live here (empty initially → placeholder)
    README.md              # how to author a post (frontmatter contract)
```

### 6.1 Server / client boundary

Today `page.tsx` is entirely `'use client'` only because of the contact form.
After refactor: `page.tsx` and all sections are **server components**; the
interactive form is isolated in `ContactForm.tsx` (`'use client'`). This shrinks
the client bundle and follows App Router best practice. `ContactForm` preserves
the current behavior verbatim — the disabled form, the "Form Under Development"
notice, and the Beacon link — this refactor only moves the code, it does not
re-enable the form.

### 6.2 Data layer

Each `data/*.ts` module default-exports a typed array/object matching an interface in
`types/index.ts`. Components import data and render — no hardcoded content in JSX.
This is the single source of truth; adding an entry is a one-file edit.

### 6.3 Dead code removal

Delete `src/app/experience/page.tsx` and `src/app/projects/page.tsx` — orphaned
routes holding stale duplicates of the home-page data (not linked from anywhere).

## 7. Blog System

### 7.1 Authoring contract (frontmatter)

```yaml
---
title: "Post title"
date: "2026-05-12"        # ISO; used for sorting and display
summary: "One-line teaser shown on the listing."
tags: ["distributed-systems", "temporal"]
published: true            # false (or absent) hides the post
---
```

Slug is derived from the filename (`my-post.mdx` → `/blog/my-post`).

### 7.2 `src/lib/blog.ts`

- `getAllPosts(): BlogPostMeta[]` — reads `content/blog/*.mdx`, parses frontmatter
  with `gray-matter`, filters to `published === true`, sorts by `date` descending,
  returns metadata (no body). Returns `[]` when the directory is empty/absent.
- `getPostBySlug(slug): { meta, content } | null` — returns one post's metadata +
  raw MDX body, or `null` if missing/unpublished.
- Reading time is computed from word count (simple words/200 heuristic).

### 7.3 Rendering

- `/blog/page.tsx`: calls `getAllPosts()`. If empty → render the "Working on it"
  placeholder. Otherwise render the card list.
- `/blog/[slug]/page.tsx`: `generateStaticParams()` from `getAllPosts()`;
  `generateMetadata()` for per-post title/description; body compiled with
  `next-mdx-remote/rsc`. Unknown slug → `notFound()`.

### 7.4 Dependencies

- `gray-matter` (frontmatter parsing)
- `next-mdx-remote` (MDX → RSC rendering)
- Optional nice-to-have (can be deferred): `rehype-pretty-code` (or
  `rehype-highlight`) + `shiki` for syntax-highlighted code blocks.

## 8. Visual Design

All new UI reuses the established terminal theme and the `SectionHeader` `$ command`
pattern. Validated via the visual companion:

- **Skills:** small uppercase group label + existing cyan pill row per group.
- **Education:** bordered cards; school + dates row, degree + GPA highlight, coursework.
- **Publications:** bordered card; title, "Published in IEEE" (amber), summary,
  optional "Read paper →" link.
- **Certifications:** 2-column grid of bordered rows; Terraform highlighted first.
- **Blog listing:** bordered cards (title, date, summary, tags); amber dashed
  "Working on it" box when empty.
- **Blog post:** back link, title, date + reading time, tags, MDX prose, code blocks.

## 9. Testing & Quality

- **Vitest** added as the test runner (devDependency, `npm test` script).
- Unit tests for `src/lib/blog.ts` against a temp fixture directory:
  - empty/absent directory → `getAllPosts()` returns `[]` (drives the placeholder).
  - `published: false`/absent → excluded.
  - multiple posts → sorted by date descending.
  - `getPostBySlug` → returns content for a known slug, `null` for unknown/unpublished.
- Static data + presentational components are low-risk; verified by
  `tsc --noEmit` type-checking, `npm run lint`, and `npm run build`.

## 10. Verification

Work is complete when all pass:

- `npm test` (blog lib unit tests) — green.
- `npx tsc --noEmit` — no type errors.
- `npm run lint` — clean.
- `npm run build` — succeeds; `/`, `/blog`, and `/blog/[slug]` build.
- Manual: home shows corrected experience + new sections; `/blog` shows
  "Working on it"; adding a sample published `.mdx` makes it appear and its page render.
- Orphan `/experience` and `/projects` routes are gone (404).

## 11. Risks & Mitigations

- **MDX + RSC version compatibility (Next 15 / React 19):** pin known-good
  versions of `next-mdx-remote`; if friction arises, fall back to `@next/mdx`.
  The blog data/empty-state path is independent of the renderer and ships first.
- **Refactor regressions:** the section componentization is behavior-preserving;
  build + type-check + lint guard it. Content moves into `data/` verbatim.

## 12. Open Questions

- None blocking. Publication URL and any real blog posts can be filled in later
  without code changes (data/frontmatter edits).
