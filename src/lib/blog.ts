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
    tags: Array.isArray(raw.tags) ? raw.tags.filter((t): t is string => typeof t === "string") : [],
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
