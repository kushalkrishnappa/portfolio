import { publications } from "@/data/publications";
import SectionHeader from "@/app/components/SectionHeader";
import Reveal from "@/app/components/motion/Reveal";

/**
 * Publications — clean editorial entries, hairline-separated (no boxed cards).
 *
 * Each: title in the display face, venue · year as mono meta, a short
 * description, and an accent ↗ "Read paper" link. Revealed on scroll. Reduced
 * motion / no-JS / SSR render the final legible state (Reveal handles this).
 */
export default function Publications() {
  return (
    <section id="publications" className="mb-16 sm:mb-24">
      <SectionHeader index="07" title="PUBLICATIONS" />

      <div className="border-t" style={{ borderColor: "var(--line)" }}>
        {publications.map((pub, i) => (
          <Reveal
            as="article"
            key={pub.title}
            delay={i * 0.06}
            className="border-b py-10 sm:py-12"
            style={{ borderColor: "var(--line)" }}
          >
            {/* Title — display face. */}
            <h3
              className="display font-black leading-[1.08]"
              style={{
                fontSize: "clamp(1.4rem, 3vw, 2.1rem)",
                letterSpacing: "-0.02em",
                color: "var(--bone)",
              }}
            >
              {pub.title}
            </h3>

            {/* Venue — mono meta. */}
            <p
              className="mono mt-4 text-[11px] uppercase tracking-[0.16em]"
              style={{ color: "var(--dim)" }}
            >
              {pub.venue}
            </p>

            {/* Description. */}
            <p
              className="mt-4 max-w-[62ch] text-[15px] leading-relaxed sm:text-base"
              style={{ color: "var(--dim)" }}
            >
              {pub.description}
            </p>

            {pub.url && (
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mono mt-6 inline-block rounded-sm text-xs tracking-[0.04em] transition-opacity hover:opacity-80 text-[color:var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
              >
                Read paper ↗
              </a>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
