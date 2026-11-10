import Link from "next/link";
import { getLatestPosts } from "@/lib/blog";
import SectionHeader from "@/app/components/SectionHeader";
import Reveal from "@/app/components/motion/Reveal";

/**
 * Writing — a clean editorial list of the latest blog posts (no boxed cards).
 *
 * Posts are fetched from the blog manifest via `getLatestPosts` (preserved). The
 * manifest 404s in local dev, so the list can be empty — handled here with a
 * tasteful empty state rather than hiding the section. Each post reveals on
 * scroll as a hairline-separated entry (title, date, summary, inline tag labels).
 *
 * Reduced motion / no-JS / SSR render the final legible state (Reveal handles it).
 */
export default async function Writing() {
  const posts = await getLatestPosts(3);

  return (
    <section id="writing" className="mb-16 sm:mb-24">
      <SectionHeader index="09" title="WRITING" />

      {posts.length === 0 ? (
        <Reveal
          className="border-t border-b py-12 sm:py-16"
          style={{ borderColor: "var(--line)" }}
        >
          <p
            className="display font-black leading-[1.08]"
            style={{
              fontSize: "clamp(1.4rem, 3vw, 2.1rem)",
              letterSpacing: "-0.02em",
              color: "var(--bone)",
            }}
          >
            Notes in progress.
          </p>
          <p
            className="mt-4 max-w-[54ch] text-[15px] leading-relaxed sm:text-base"
            style={{ color: "var(--dim)" }}
          >
            New writing on systems, reliability, and the AI-assisted SDLC is on
            the way.
          </p>
          <Link
            href="/blogs"
            className="mono mt-6 inline-block rounded-sm text-xs tracking-[0.04em] transition-opacity hover:opacity-80 text-[color:var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
          >
            Visit the blog ↗
          </Link>
        </Reveal>
      ) : (
        <>
          <div className="border-t" style={{ borderColor: "var(--line)" }}>
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.06}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block border-b py-9 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)] sm:py-11"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div className="flex flex-col gap-x-8 gap-y-3 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3
                      className="display font-black leading-[1.06] text-[color:var(--bone)] transition-colors group-hover:text-[color:var(--accent)]"
                      style={{
                        fontSize: "clamp(1.4rem, 3vw, 2.1rem)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {post.title}
                    </h3>
                    {post.date && (
                      <span
                        className="mono shrink-0 whitespace-nowrap text-[11px] uppercase tracking-[0.14em] tabular-nums"
                        style={{ color: "var(--dim)" }}
                      >
                        {post.date}
                      </span>
                    )}
                  </div>

                  {post.summary && (
                    <p
                      className="mt-4 max-w-[62ch] text-[15px] leading-relaxed sm:text-base"
                      style={{ color: "var(--dim)" }}
                    >
                      {post.summary}
                    </p>
                  )}

                  {post.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                      {post.tags.map((tag, t) => (
                        <span key={tag} className="inline-flex items-center gap-3">
                          {t > 0 && (
                            <span aria-hidden="true" style={{ color: "var(--line-2)" }}>
                              /
                            </span>
                          )}
                          <span
                            className="mono text-[12px] tracking-[0.02em]"
                            style={{ color: "var(--faint)" }}
                          >
                            {tag}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <Link
              href="/blogs"
              className="mono inline-block rounded-sm text-xs tracking-[0.04em] transition-opacity hover:opacity-80 text-[color:var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
            >
              see all ↗
            </Link>
          </Reveal>
        </>
      )}
    </section>
  );
}
