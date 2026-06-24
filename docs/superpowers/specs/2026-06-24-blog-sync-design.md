# Decoupled Blog → Portfolio Sync — Design Spec

**Date:** 2026-06-24
**Author:** Kushal Krishnappa (with Claude)
**Status:** Approved for planning

## 1. Overview

Move blog authoring out of the portfolio repo into a **separate Docusaurus repo**
that owns and renders the full posts, deployed to **GitHub Pages**. The existing
portfolio (Next.js 15 / React 19 / Tailwind v4, hosted on **Netlify**) stops
rendering full posts and instead shows **preview cards** (title, date, summary,
tags) that **link out** to the Docusaurus posts.

On every merge to the blog repo's `main`, a GitHub Action builds Docusaurus,
generates a machine-readable `posts.json` manifest, deploys to Pages, and then
pings the portfolio's Netlify **build hook**. The portfolio rebuild fetches the
manifest at build time and renders the previews. This is the "automatically pick
it up" mechanism.

The portfolio's existing **terminal aesthetic** (black background, green `$`
prompts, cyan accents, monospace, bordered cards) is preserved. No visual redesign.

## 2. Goals

- Blog content lives in and is rendered by a standalone Docusaurus repo on GitHub Pages.
- Portfolio shows synced preview cards linking out to the Docusaurus posts:
  - `/blog` page = full list of all published posts.
  - Homepage teaser = newest 2–3 posts with a "see all →" link to `/blog`.
- Sync is automatic: merge to blog `main` → blog deploys → portfolio rebuilds with fresh previews.
- The portfolio never breaks if the blog/manifest is unavailable (fail-soft).

## 3. Non-Goals

- No local MDX rendering of full posts in the portfolio (Docusaurus owns full posts).
- No runtime / ISR / client-side fetching — metadata is fetched at **build time** only.
- No GitHub API access or tokens for content.
- No search, comments, or per-post image syncing (a `cover` field can be added to the
  contract later without redesign).
- No visual redesign of the portfolio.

## 4. Architecture

Two repos bound by one data contract (`posts.json`):

```
┌─────────────────────────┐         posts.json          ┌──────────────────────────┐
│  blog repo (Docusaurus) │ ──── published to Pages ───► │  GitHub Pages (blog site)│
│  authored .md/.mdx      │                              │  full posts + posts.json │
└───────────┬─────────────┘                              └────────────┬─────────────┘
            │ merge to main (GH Action)                                │ build-time fetch
            │  1. build Docusaurus + generate posts.json               │ (cache: no-store)
            │  2. deploy to Pages                                      ▼
            │  3. POST Netlify build hook  ───────────────►  ┌──────────────────────────┐
            └─────────────────────────────────────────────► │ portfolio (Netlify)      │
                                                             │ /blog list + home teaser │
                                                             │ cards link OUT to blog   │
                                                             └──────────────────────────┘
```

Two coordinated work-streams (blog repo setup; portfolio changes) bound by the
`posts.json` contract. Small enough for a single spec and plan.

## 5. Data Contract — `posts.json`

Served at the blog site root (e.g. `https://kushalkrishnappa.github.io/blog/posts.json`).

```json
{
  "generatedAt": "2026-06-24T12:00:00Z",
  "posts": [
    {
      "slug": "first-post",
      "title": "My first post",
      "date": "2026-07-01",
      "summary": "One-line teaser.",
      "tags": ["distributed-systems", "temporal"],
      "url": "https://kushalkrishnappa.github.io/blog/first-post",
      "readingTime": "5 min read"
    }
  ]
}
```

Rules:
- `posts` sorted newest-first by `date`.
- `draft: true` posts are excluded.
- Required per post: `slug`, `title`, `date`, `summary`, `tags` (possibly empty array), `url`.
- `readingTime` is optional (computed from body word count, ~200 wpm — same heuristic the
  portfolio uses today).

## 6. Blog Repo (new)

- Standard Docusaurus site. Posts authored as `.md` / `.mdx` with frontmatter:
  `title`, `date`, `description` (→ `summary`), `tags`, `slug`, `draft`.
- Recommendation: set the blog plugin `routeBasePath: '/'` so post URLs are clean
  (`…/blog/<slug>`, not `…/blog/blog/<slug>`). Moving to a custom subdomain later only
  changes the base URL used to build `url`.
- **`scripts/generate-manifest.mjs`** (Node, uses `gray-matter` — already in the
  Docusaurus dependency tree, so zero new deps): reads each post's frontmatter, computes
  `url` from a configured site base URL + slug, computes `readingTime`, excludes drafts,
  sorts newest-first, and writes `posts.json` into the build output directory.
  - Chosen over a shell (`bash`+`jq`+`yq`) approach: shell adds a `yq` runner dependency
    and is more fragile around YAML edge cases (multi-line values, tag arrays, quoting);
    Node reuses existing deps and handles parsing/escaping robustly.

## 7. Portfolio Repo (changes to existing code)

- **`src/lib/blog.ts`** — rewrite from local-file reading to a build-time
  `fetch(BLOG_MANIFEST_URL, { cache: "no-store" })`; parse and return `BlogPostMeta[]`.
  - **Fail-soft:** on any fetch/parse error, return `[]` and `console.warn`, so a blog
    outage never breaks the portfolio deploy (the existing "Working on it…" placeholder
    shows). No last-known-good cache file (deliberately omitted for simplicity).
  - Manifest URL comes from `BLOG_MANIFEST_URL` (set in Netlify env), defaulting to the
    known Pages URL.
- **`src/types/index.ts`** — `BlogPostMeta` gains `url: string`; `readingTime` becomes optional.
- **`src/app/blog/page.tsx`** — preview cards link to `post.url` (external,
  `target="_blank"`, `rel="noopener noreferrer"`) instead of `/blog/${slug}`.
- **`src/app/components/sections/Writing.tsx`** (new) — terminal-themed homepage teaser
  showing newest 2–3 posts + a "see all →" link to `/blog`. Inserted into
  `src/app/page.tsx` right after the `Projects` section.
- **Delete** `src/app/blog/[slug]/page.tsx` and `src/app/components/mdx-components.tsx`
  (full posts now live on Docusaurus).
- **Remove** `content/blog/` and the now-unused dependencies `next-mdx-remote` and
  `gray-matter` from the portfolio's `package.json`.
- **`src/lib/blog.test.ts`** — retarget tests to manifest parsing/sorting/fail-soft
  (Vitest already configured).

## 8. Sync Wiring — blog repo `.github/workflows/deploy.yml`

On push to `main`:
1. Checkout, `npm ci`, `docusaurus build`.
2. Run `scripts/generate-manifest.mjs` to emit `posts.json` into the build output.
3. **Deploy to GitHub Pages first** (`actions/deploy-pages`) so the manifest is live.
4. **Then** `curl -X POST "$NETLIFY_BUILD_HOOK"`.

Ordering matters: Pages must be live before the Netlify rebuild starts, so the portfolio
fetches the already-updated manifest. The Netlify build hook URL is stored as a GitHub
Actions secret (`NETLIFY_BUILD_HOOK`) in the blog repo.

## 9. Error Handling / Edge Cases

- Manifest fetch fails during portfolio build → fail-soft to empty list (deploy still succeeds).
- Netlify ping fails after a successful blog deploy → portfolio stays stale until the next
  deploy; re-runnable by re-triggering the hook or a portfolio redeploy.
- Post deleted/unpublished in the blog → manifest regenerates without it → next portfolio
  build drops the card.
- No CORS concern — the manifest fetch happens server-side at build time.
- Race between Pages publish and Netlify build is mitigated by the deploy-before-ping ordering.

## 10. Testing

- **Portfolio (Vitest):** unit tests for manifest parsing — valid manifest, malformed JSON,
  empty `posts`, network/fetch error (→ fail-soft `[]`), newest-first sorting, and `url`
  passthrough to cards.
- **Blog repo:** a sanity test for `generate-manifest.mjs` — given fixture frontmatter,
  assert the expected `posts.json` shape (URL construction, draft exclusion, sort order).

## 11. Open Implementation Details (resolved at build time, not blockers)

- Exact Pages URL / base path for `url` construction (depends on repo name and whether
  `routeBasePath: '/'` is used or a custom subdomain is added).
- Whether `readingTime` is included now or deferred (contract allows it to be optional).
