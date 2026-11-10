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
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--bone)" }}>
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-12 sm:pt-20 pb-16">
        <SectionHeader index="01" title="WRITING" />
        {posts.length === 0 ? (
          <div
            className="rounded-lg border border-dashed p-8 text-center"
            style={{ background: "var(--surface)", borderColor: "var(--line-2)" }}
          >
            <p className="mono mb-2 text-sm uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>
              Working on it
            </p>
            <p className="text-sm" style={{ color: "var(--dim)" }}>
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
                className="group block rounded-lg border bg-[color:var(--surface)] border-[color:var(--line)] p-5 transition-colors hover:border-[color:var(--line-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-bold text-[color:var(--bone)] transition-colors group-hover:text-[color:var(--accent)]">
                    {post.title}
                  </h2>
                  <span
                    className="mono shrink-0 whitespace-nowrap text-[11px] uppercase tracking-[0.12em] tabular-nums"
                    style={{ color: "var(--dim)" }}
                  >
                    {post.date}
                  </span>
                </div>
                <p className="my-2 text-sm leading-relaxed" style={{ color: "var(--dim)" }}>
                  {post.summary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="mono rounded-full border px-3 py-1 text-[11px] tracking-[0.03em]"
                      style={{ borderColor: "var(--line-2)", color: "var(--bone)" }}
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
  );
}
