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
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("[blog]"));
  });

  it("returns [] when fetch throws", async () => {
    mockFetch(() => {
      throw new Error("network down");
    });
    expect(await getAllPosts()).toEqual([]);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("[blog]"));
  });

  it("returns [] when posts is missing or not an array", async () => {
    mockFetch(() => jsonResponse({ generatedAt: "x" }));
    expect(await getAllPosts()).toEqual([]);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("[blog]"));
  });

  it("keeps a deterministic order for posts sharing a date", async () => {
    const a = { ...samplePost, slug: "a", url: "https://b/a", date: "2026-03-01" };
    const b = { ...samplePost, slug: "b", url: "https://b/b", date: "2026-03-01" };
    mockFetch(() => jsonResponse(manifest([a, b])));
    const first = (await getAllPosts()).map((p) => p.slug);
    mockFetch(() => jsonResponse(manifest([a, b])));
    const second = (await getAllPosts()).map((p) => p.slug);
    expect(first).toEqual(second);
    expect(first).toEqual(["a", "b"]);
  });

  it("falls back to the default manifest URL when the env var is unset", async () => {
    delete process.env.BLOG_MANIFEST_URL;
    const fetchMock = vi.fn(() => jsonResponse(manifest([samplePost])));
    vi.stubGlobal("fetch", fetchMock);
    await getAllPosts();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://kushalkrishnappa.github.io/blog/posts.json",
      { cache: "force-cache" },
    );
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
