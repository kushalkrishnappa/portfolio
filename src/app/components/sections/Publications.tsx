import { publications } from "@/data/publications";
import SectionHeader from "@/app/components/SectionHeader";

export default function Publications() {
  return (
    <section id="publications" className="mb-16 sm:mb-24">
      <SectionHeader index="08" title="PUBLICATIONS" />
      <div className="space-y-4">
        {publications.map((pub) => (
          <article
            key={pub.title}
            className="rounded-lg border p-6"
            style={{ background: "var(--surface)", borderColor: "var(--line)" }}
          >
            <h3
              className="text-base font-bold leading-snug sm:text-lg"
              style={{ color: "var(--bone)" }}
            >
              {pub.title}
            </h3>
            <p
              className="mono mt-2 text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "var(--dim)" }}
            >
              {pub.venue}
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--dim)" }}>
              {pub.description}
            </p>
            {pub.url && (
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mono mt-4 inline-block rounded-sm text-xs tracking-[0.04em] transition-opacity hover:opacity-80 text-[color:var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
              >
                Read paper ↗
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
