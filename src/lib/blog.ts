import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPostMeta } from "@/types";

function blogDir(): string {
  return process.env.BLOG_CONTENT_DIR || path.join(process.cwd(), "content", "blog");
}

function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function postFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name);
}

function toMeta(slug: string, data: Record<string, unknown>, content: string): BlogPostMeta {
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    summary: String(data.summary ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingTime: readingTime(content),
  };
}

export function getAllPosts(): BlogPostMeta[] {
  const dir = blogDir();
  return postFiles(dir)
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return { slug, data, content };
    })
    .filter((p) => p.data.published === true)
    .map((p) => toMeta(p.slug, p.data, p.content))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPostBySlug(slug: string): { meta: BlogPostMeta; content: string } | null {
  const safeName = path.basename(slug);
  const file = path.join(blogDir(), `${safeName}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  if (data.published !== true) return null;
  return { meta: toMeta(safeName, data, content), content };
}
