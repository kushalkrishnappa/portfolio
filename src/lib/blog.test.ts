import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

let dir: string;

function writePost(
  name: string,
  frontmatter: Record<string, unknown>,
  body = "Body text here.",
) {
  const fm = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n");
  fs.writeFileSync(path.join(dir, name), `---\n${fm}\n---\n${body}\n`);
}

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "blog-"));
  process.env.BLOG_CONTENT_DIR = dir;
});

afterEach(() => {
  delete process.env.BLOG_CONTENT_DIR;
  fs.rmSync(dir, { recursive: true, force: true });
});

describe("getAllPosts", () => {
  it("returns [] when no posts exist", () => {
    expect(getAllPosts()).toEqual([]);
  });

  it("returns [] when the directory is absent", () => {
    process.env.BLOG_CONTENT_DIR = path.join(dir, "does-not-exist");
    expect(getAllPosts()).toEqual([]);
  });

  it("excludes unpublished posts", () => {
    writePost("draft.mdx", { title: "Draft", date: "2026-01-01", published: false });
    writePost("live.mdx", { title: "Live", date: "2026-01-02", published: true });
    const posts = getAllPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe("live");
  });

  it("sorts published posts by date descending", () => {
    writePost("old.mdx", { title: "Old", date: "2026-01-01", published: true });
    writePost("new.mdx", { title: "New", date: "2026-05-01", published: true });
    expect(getAllPosts().map((p) => p.slug)).toEqual(["new", "old"]);
  });

  it("derives tags and reading time", () => {
    writePost(
      "p.mdx",
      { title: "P", date: "2026-01-01", tags: ["a", "b"], published: true },
      "word ".repeat(400),
    );
    const [post] = getAllPosts();
    expect(post.tags).toEqual(["a", "b"]);
    expect(post.readingTime).toBe("2 min read");
  });

  it("orders equal-date posts deterministically across reads", () => {
    writePost("a.mdx", { title: "A", date: "2026-01-01", published: true });
    writePost("b.mdx", { title: "B", date: "2026-01-01", published: true });
    const first = getAllPosts().map((p) => p.slug);
    const second = getAllPosts().map((p) => p.slug);
    expect(first).toHaveLength(2);
    expect(first).toEqual(second);
  });

  it("falls back to slug and empty values when frontmatter fields are missing", () => {
    writePost("bare.mdx", { published: true }, "Some body");
    const [post] = getAllPosts();
    expect(post.title).toBe("bare");
    expect(post.date).toBe("");
    expect(post.summary).toBe("");
    expect(post.tags).toEqual([]);
  });
});

describe("getPostBySlug", () => {
  it("returns meta + content for a published slug", () => {
    writePost("hello.mdx", { title: "Hello", date: "2026-01-01", published: true }, "Hello world body");
    const post = getPostBySlug("hello");
    expect(post?.meta.title).toBe("Hello");
    expect(post?.content).toContain("Hello world body");
  });

  it("returns null for an unknown slug", () => {
    expect(getPostBySlug("missing")).toBeNull();
  });

  it("returns null for an unpublished slug", () => {
    writePost("draft.mdx", { title: "Draft", date: "2026-01-01", published: false });
    expect(getPostBySlug("draft")).toBeNull();
  });

  it("returns null for slugs that try to traverse outside the blog directory", () => {
    expect(getPostBySlug("../outside")).toBeNull();
    expect(getPostBySlug("../../etc/passwd")).toBeNull();
  });
});
