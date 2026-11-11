import type { BlogPostMeta } from "@/types";

interface FieldNotesLogProps {
  posts: BlogPostMeta[];
  /** Total entries in the manifest; entry numbers count up from the oldest. */
  total?: number;
  /** Show each entry's tags (the /blogs index does; the appendix does not). */
  tags?: boolean;
  /** Empty state: link to the /blogs index (off on /blogs itself) and an optional note. */
  emptyLink?: boolean;
  emptyNote?: string;
}

const pad = (n: number) => String(n).padStart(3, "0");

/**
 * The field-notes log: one drafting log line per post (entry no., date, title,
 * short excerpt, arrow). Each line links out to the post. When the manifest is
 * empty or failed (getAllPosts returns []), a single quiet line says so and
 * points to the /blogs index.
 */
export default function FieldNotesLog({ posts, total = posts.length, tags = false, emptyLink = true, emptyNote }: FieldNotesLogProps) {
  if (posts.length === 0) {
    return (
      <div className="log log-empty">
        <p className="log-none" data-row>
          <span>No field notes filed yet.</span>
          {emptyLink ? (
            <a href="/blogs">
              Field notes index <span aria-hidden="true">→</span>
            </a>
          ) : (
            emptyNote && <span className="log-note">{emptyNote}</span>
          )}
        </p>
      </div>
    );
  }
  return (
    <div className="log">
      <div className="log-h" data-row aria-hidden="true">
        <span>Entry</span>
        <span>Date</span>
        <span>Title · excerpt</span>
        <span className="log-a">Open</span>
      </div>
      <ol className="log-list">
        {posts.map((p, i) => (
          <li key={p.slug} className="log-r" data-row>
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              <span className="log-n">{pad(total - i)}</span>
              <span className="log-d">{p.date || "—"}</span>
              <span className="log-t">
                <span className="log-title">{p.title}</span>
                {p.summary && <span className="log-x">{p.summary}</span>}
                {tags && p.tags.length > 0 && (
                  <span className="log-tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </span>
                )}
              </span>
              <span className="log-a" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
