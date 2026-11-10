import Link from "next/link";
import { getLatestPosts } from "@/lib/blog";
import SectionHeader from "@/app/components/SectionHeader";

export default async function Writing() {
  const posts = await getLatestPosts(3);
  if (posts.length === 0) return null;

  return (
    <section id="writing" className="mb-16 sm:mb-24">
      <SectionHeader index="04" title="WRITING" />
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
              <h3
                className="font-bold text-[color:var(--bone)] transition-colors group-hover:text-[color:var(--accent)]"
              >
                {post.title}
              </h3>
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
            <ul className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="mono rounded-full border px-3 py-1 text-[11px] tracking-[0.03em]"
                  style={{ borderColor: "var(--line-2)", color: "var(--bone)" }}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </a>
        ))}
        <Link
          href="/blogs"
          className="mono inline-block rounded-sm text-xs tracking-[0.04em] transition-opacity hover:opacity-80 text-[color:var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
        >
          see all ↗
        </Link>
      </div>
    </section>
  );
}
