# Portfolio Blog-Sync (Manifest Consumer) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the portfolio's blog from an in-repo MDX renderer into a build-time consumer of a `posts.json` manifest published by a separate Docusaurus blog, showing preview cards (on `/blog` and a new homepage teaser) that link out to the live posts.

**Architecture:** `src/lib/blog.ts` fetches a JSON manifest at build time with `cache: "force-cache"` (so previews are baked into static HTML and only refresh on the next rebuild), validates/sorts it, and returns `BlogPostMeta[]`. The `/blog` page and a new `Writing` homepage section render preview cards linking to external post URLs. The old `/blog/[slug]` MDX renderer, its components, in-repo content, and the `next-mdx-remote` / `gray-matter` dependencies are removed.

**Tech Stack:** Next.js 15 (App Router, RSC), React 19, TypeScript, Tailwind v4, Vitest (node environment). Global `fetch` (Node 18+).

**Scope:** This plan covers **only the portfolio repo** (the current repo). The separate Docusaurus blog repo — Docusaurus scaffold, `generate-manifest.mjs`, GitHub Pages deploy, and the Netlify build-hook Action — is a separate plan written later. Until that exists, the manifest URL 404s and the portfolio fails-soft to an empty blog (the "Working on it…" placeholder), which is expected and intentionally testable.

**Spec:** `docs/superpowers/specs/2026-06-24-blog-sync-design.md`

---

## File Structure

| File | Action | Responsibility |
| --- | --- | --- |
| `src/types/index.ts` | Modify | `BlogPostMeta` gains `url: string`; `readingTime` becomes optional |
| `src/lib/blog.ts` | Rewrite | Fetch + validate + sort the manifest; expose `getAllPosts()` and `getLatestPosts(limit)` |
| `src/lib/blog.test.ts` | Rewrite | Unit tests for manifest parsing/sorting/fail-soft (mocked `fetch`) |
| `src/app/blog/page.tsx` | Modify | Async; preview cards link out to `post.url` |
| `src/app/components/sections/Writing.tsx` | Create | Homepage teaser: newest 2–3 posts + "see all →" |
| `src/app/page.tsx` | Modify | Render `<Writing />` after `<Projects />` |
| `src/app/blog/[slug]/page.tsx` | Delete | Local MDX post rendering no longer used |
| `src/app/components/mdx-components.tsx` | Delete | Only used by the deleted `[slug]` route |
| `content/blog/README.md` (+ `content/`) | Delete | In-repo content no longer used |
| `package.json` / `package-lock.json` | Modify | Remove `next-mdx-remote`, `gray-matter` |
| `.env.example` | Modify | Document `BLOG_MANIFEST_URL` |

---

## Task 1: Rewrite `blog.ts` as a manifest consumer (TDD)

**Files:**
- Modify: `src/types/index.ts`
- Rewrite: `src/lib/blog.ts`
- Test: `src/lib/blog.test.ts`

- [ ] **Step 1: Replace the test file with manifest-based failing tests**

Replace the entire contents of `src/lib/blog.test.ts` with:

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getAllPosts, getLatestPosts } from "@/lib/blog";

function manifest(posts: unknown[]) {
  return { generatedAt: "2026-06-24T00:00:00Z", posts };
}

function mockFetch(impl: () => Promise<Response> | Response) {
  vi.stubGlobal("fetch", vi.fn(impl));
}

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as unknown as Response;
}

const samplePost = {
  slug: "first-post",
  title: "My first post",
  date: "2026-07-01",
  summary: "A teaser.",
  tags: ["distributed-systems"],
  url: "https://blog.example.com/first-post",
  readingTime: "5 min read",
};

beforeEach(() => {
  process.env.BLOG_MANIFEST_URL = "https://blog.example.com/posts.json";
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete process.env.BLOG_MANIFEST_URL;
});

describe("getAllPosts", () => {
  it("returns parsed posts from a valid manifest", async () => {
    mockFetch(() => jsonResponse(manifest([samplePost])));
    const posts = await getAllPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      slug: "first-post",
      title: "My first post",
      date: "2026-07-01",
      summary: "A teaser.",
      tags: ["distributed-systems"],
      url: "https://blog.example.com/first-post",
      readingTime: "5 min read",
    });
  });

  it("sorts posts newest-first by date", async () => {
    const older = { ...samplePost, slug: "old", url: "https://b/old", date: "2026-01-01" };
    const newer = { ...samplePost, slug: "new", url: "https://b/new", date: "2026-05-01" };
    mockFetch(() => jsonResponse(manifest([older, newer])));
    expect((await getAllPosts()).map((p) => p.slug)).toEqual(["new", "old"]);
  });

  it("skips entries missing required url or title", async () => {
    const noUrl = { slug: "x", title: "No URL", date: "2026-02-01", tags: [] };
    const noTitle = { slug: "y", url: "https://b/y", date: "2026-02-01", tags: [] };
    mockFetch(() => jsonResponse(manifest([noUrl, noTitle, samplePost])));
    expect((await getAllPosts()).map((p) => p.slug)).toEqual(["first-post"]);
  });

  it("defaults optional fields when absent", async () => {
    const bare = { title: "Bare", url: "https://b/bare" };
    mockFetch(() => jsonResponse(manifest([bare])));
    const [post] = await getAllPosts();
    expect(post.slug).toBe("Bare");
    expect(post.date).toBe("");
    expect(post.summary).toBe("");
    expect(post.tags).toEqual([]);
    expect(post.readingTime).toBeUndefined();
  });

  it("returns [] on a non-ok HTTP response", async () => {
    mockFetch(() => jsonResponse({}, false, 404));
    expect(await getAllPosts()).toEqual([]);
  });

  it("returns [] when fetch throws", async () => {
    mockFetch(() => {
      throw new Error("network down");
    });
    expect(await getAllPosts()).toEqual([]);
  });

  it("returns [] when posts is missing or not an array", async () => {
    mockFetch(() => jsonResponse({ generatedAt: "x" }));
    expect(await getAllPosts()).toEqual([]);
  });
});

describe("getLatestPosts", () => {
  it("returns at most `limit` newest posts", async () => {
    const posts = [1, 2, 3, 4].map((n) => ({
      ...samplePost,
      slug: `p${n}`,
      url: `https://b/p${n}`,
      date: `2026-0${n}-01`,
    }));
    mockFetch(() => jsonResponse(manifest(posts)));
    const latest = await getLatestPosts(2);
    expect(latest.map((p) => p.slug)).toEqual(["p4", "p3"]);
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm test`
Expected: FAIL — `getLatestPosts` is not exported and `getAllPosts` returns a non-Promise / wrong shape (old file-based implementation). Compilation/assertion errors are expected here.

- [ ] **Step 3: Update the `BlogPostMeta` type**

In `src/types/index.ts`, replace the existing `BlogPostMeta` interface with:

```ts
export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  url: string;
  readingTime?: string;
}
```

- [ ] **Step 4: Rewrite `src/lib/blog.ts`**

Replace the entire contents of `src/lib/blog.ts` with:

```ts
import { BlogPostMeta } from "@/types";

const DEFAULT_MANIFEST_URL = "https://kushalkrishnappa.github.io/blog/posts.json";

function manifestUrl(): string {
  return process.env.BLOG_MANIFEST_URL || DEFAULT_MANIFEST_URL;
}

interface RawPost {
  slug?: unknown;
  title?: unknown;
  date?: unknown;
  summary?: unknown;
  tags?: unknown;
  url?: unknown;
  readingTime?: unknown;
}

function toMeta(raw: RawPost): BlogPostMeta | null {
  if (typeof raw.title !== "string" || typeof raw.url !== "string") return null;
  return {
    slug: typeof raw.slug === "string" && raw.slug ? raw.slug : raw.title,
    title: raw.title,
    date: typeof raw.date === "string" ? raw.date : "",
    summary: typeof raw.summary === "string" ? raw.summary : "",
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    url: raw.url,
    readingTime: typeof raw.readingTime === "string" ? raw.readingTime : undefined,
  };
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  try {
    const res = await fetch(manifestUrl(), { cache: "force-cache" });
    if (!res.ok) {
      console.warn(`[blog] manifest fetch failed: HTTP ${res.status}`);
      return [];
    }
    const data = (await res.json()) as { posts?: unknown };
    if (!Array.isArray(data.posts)) {
      console.warn("[blog] manifest has no posts array");
      return [];
    }
    return data.posts
      .map((p) => toMeta(p as RawPost))
      .filter((p): p is BlogPostMeta => p !== null)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  } catch (err) {
    console.warn(`[blog] manifest fetch error: ${String(err)}`);
    return [];
  }
}

export async function getLatestPosts(limit: number): Promise<BlogPostMeta[]> {
  return (await getAllPosts()).slice(0, limit);
}
```

- [ ] **Step 5: Run the tests and verify they pass**

Run: `npm test`
Expected: PASS — all `getAllPosts` and `getLatestPosts` cases green.

- [ ] **Step 6: Commit**

```bash
git add src/types/index.ts src/lib/blog.ts src/lib/blog.test.ts
git commit -m "feat(blog): fetch posts from external manifest instead of local MDX"
```

---

## Task 2: Update the `/blog` listing to link out

**Files:**
- Modify: `src/app/blog/page.tsx`

> No unit test: this repo has no component-test harness (Vitest runs in the `node` environment and tests only `src/lib`). Verification is via typecheck/lint/build, consistent with the existing codebase.

- [ ] **Step 1: Make the page async and link cards to external URLs**

Replace the entire contents of `src/app/blog/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import SectionHeader from "@/app/components/SectionHeader";

export const metadata: Metadata = {
  title: "Blog — Kushal Krishnappa",
  description: "Writing on distributed systems, infrastructure automation, and security.",
};

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pt-12 sm:pt-20 pb-16">
        <SectionHeader command="ls ~/blog" />
        <div className="pl-4 border-l-2 border-gray-700">
          {posts.length === 0 ? (
            <div className="bg-gray-900 border border-dashed border-yellow-600/60 rounded-lg p-8 text-center">
              <p className="text-yellow-400 text-base mb-2">⚠ Working on it…</p>
              <p className="text-gray-500 text-sm">
                Writing my first posts on distributed systems, infrastructure automation, and
                security. Check back soon.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <a
                  key={post.slug}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-baseline">
                    <h2 className="text-white font-bold">{post.title}</h2>
                    <span className="text-gray-500 text-xs">{post.date}</span>
                  </div>
                  <p className="text-gray-400 text-sm my-2">{post.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs border border-gray-700 rounded px-2 py-0.5 text-cyan-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck and lint pass**

Run: `npm run lint`
Expected: PASS — no unused-import errors (the `Link` import is gone), no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/blog/page.tsx
git commit -m "feat(blog): link /blog cards out to external post URLs"
```

---

## Task 3: Add the homepage "Writing" teaser

**Files:**
- Create: `src/app/components/sections/Writing.tsx`
- Modify: `src/app/page.tsx`

> Renders newest 2–3 posts; returns `null` when there are no posts, so the homepage shows no empty section before any posts exist.

- [ ] **Step 1: Create `src/app/components/sections/Writing.tsx`**

```tsx
import Link from "next/link";
import { getLatestPosts } from "@/lib/blog";
import SectionHeader from "@/app/components/SectionHeader";

export default async function Writing() {
  const posts = await getLatestPosts(3);
  if (posts.length === 0) return null;

  return (
    <section id="writing" className="mb-16 sm:mb-20">
      <SectionHeader command="ls -t ~/blog | head -3" />
      <div className="pl-4 border-l-2 border-gray-700 space-y-4">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors"
          >
            <div className="flex justify-between items-baseline">
              <h3 className="text-white font-bold">{post.title}</h3>
              <span className="text-gray-500 text-xs">{post.date}</span>
            </div>
            <p className="text-gray-400 text-sm my-2">{post.summary}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs border border-gray-700 rounded px-2 py-0.5 text-cyan-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
        <Link href="/blog" className="inline-block text-cyan-400 text-sm hover:text-cyan-300">
          see all →
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Render `<Writing />` after `<Projects />` in `src/app/page.tsx`**

In `src/app/page.tsx`, add the import alongside the others:

```tsx
import Writing from "@/app/components/sections/Writing";
```

Then insert `<Writing />` immediately after `<Projects />`:

```tsx
        <Projects />
        <Writing />
        <Skills />
```

- [ ] **Step 3: Verify lint passes**

Run: `npm run lint`
Expected: PASS — no type or lint errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/sections/Writing.tsx src/app/page.tsx
git commit -m "feat(blog): add latest-writing teaser to homepage"
```

---

## Task 4: Delete the local MDX renderer and in-repo content

**Files:**
- Delete: `src/app/blog/[slug]/page.tsx`
- Delete: `src/app/components/mdx-components.tsx`
- Delete: `content/blog/README.md`

- [ ] **Step 1: Delete the files and now-empty directories**

```bash
git rm src/app/blog/[slug]/page.tsx src/app/components/mdx-components.tsx content/blog/README.md
rmdir "src/app/blog/[slug]" content/blog content 2>/dev/null || true
```

- [ ] **Step 2: Verify no dangling references remain**

Run: `grep -rn "mdx-components\|getPostBySlug\|next-mdx-remote" src/`
Expected: no output (all references removed).

- [ ] **Step 3: Verify lint/build still resolves**

Run: `npm run lint`
Expected: PASS — no missing-module or unresolved-import errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(blog): remove local MDX renderer and in-repo content"
```

---

## Task 5: Remove the now-unused dependencies

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Confirm nothing imports the packages anymore**

Run: `grep -rn "gray-matter\|next-mdx-remote" src/`
Expected: no output.

- [ ] **Step 2: Uninstall the packages**

```bash
npm uninstall next-mdx-remote gray-matter
```

- [ ] **Step 3: Verify the suite and build are green without them**

Run: `npm test && npm run build`
Expected: PASS — tests green; build succeeds. (With no manifest server running, the build logs a `[blog] manifest fetch error/failed` warning and renders the empty-state `/blog`; this is the intended fail-soft behavior, not a build failure.)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): drop next-mdx-remote and gray-matter"
```

---

## Task 6: Document `BLOG_MANIFEST_URL` and run final verification

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Append the manifest URL to `.env.example`**

Add to the end of `.env.example`:

```
# Blog manifest (posts.json) published by the separate Docusaurus blog repo.
# Defaults to the GitHub Pages URL if unset. Override per-environment in Netlify.
BLOG_MANIFEST_URL=https://kushalkrishnappa.github.io/blog/posts.json
```

- [ ] **Step 2: Full verification pass**

Run: `npm test && npm run lint && npm run build`
Expected: PASS on all three — tests green, no lint errors, production build succeeds (with the expected fail-soft manifest warning).

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "docs: document BLOG_MANIFEST_URL env var"
```

---

## Self-Review

**Spec coverage:**
- Manifest fetch + parse + fail-soft → Task 1. ✓
- `BlogPostMeta` gains `url`, optional `readingTime` → Task 1, Step 3. ✓
- `force-cache` build-time fetch → Task 1, Step 4. ✓
- `/blog` cards link out (external, new tab) → Task 2. ✓
- Homepage teaser (newest 2–3, "see all") after Projects → Task 3. ✓
- Delete `[slug]` route + `mdx-components` + `content/blog/` → Task 4. ✓
- Remove `next-mdx-remote` + `gray-matter` → Task 5. ✓
- `BLOG_MANIFEST_URL` documented → Task 6. ✓
- Tests for parsing/sorting/fail-soft/url-passthrough → Task 1, Step 1. ✓
- Out of scope (separate plan): Docusaurus repo, `generate-manifest.mjs`, Pages deploy, Netlify hook Action. Explicitly noted in the Scope section. ✓

**Placeholder scan:** No TBD/TODO/"handle edge cases"; every code step contains full content. ✓

**Type consistency:** `getAllPosts(): Promise<BlogPostMeta[]>` and `getLatestPosts(limit: number): Promise<BlogPostMeta[]>` are used identically in Tasks 2 and 3. `BlogPostMeta.url` / optional `readingTime` are produced in Task 1 and consumed in Tasks 2–3. Test helper names (`mockFetch`, `jsonResponse`, `manifest`) are self-consistent. ✓
