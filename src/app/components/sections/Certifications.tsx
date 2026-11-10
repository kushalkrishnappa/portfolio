import { certifications } from "@/data/certifications";
import SectionHeader from "@/app/components/SectionHeader";
import Reveal from "@/app/components/motion/Reveal";

/**
 * Certifications — a tidy, flowing single-column list with hairline rhythm (no
 * 2-col boxed grid).
 *
 * Each row: an optional accent dot marking the featured credential, the name,
 * and — when linked — an accent ↗ that lights on hover. Rows reveal on scroll,
 * staggered. Reduced motion / no-JS / SSR render the final legible state.
 */
export default function Certifications() {
  return (
    <section id="certifications" className="mb-16 sm:mb-24">
      <SectionHeader index="08" title="CERTIFICATIONS" />

      <div className="border-t" style={{ borderColor: "var(--line)" }}>
        {certifications.map((cert, i) => {
          const marker = (
            <span className="flex w-4 flex-shrink-0 items-center justify-center">
              {cert.featured ? (
                <span
                  aria-hidden="true"
                  className="h-[6px] w-[6px] rounded-full"
                  style={{
                    background: "var(--accent)",
                    boxShadow: "0 0 7px var(--accent)",
                  }}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="h-px w-3"
                  style={{ background: "var(--line-2)" }}
                />
              )}
            </span>
          );

          const inner = cert.url ? (
            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 border-b py-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
              style={{ borderColor: "var(--line)" }}
            >
              {marker}
              <span className="text-[15px] text-[color:var(--dim)] transition-colors group-hover:text-[color:var(--bone)] sm:text-base">
                {cert.name}
              </span>
              <span
                aria-hidden="true"
                className="mono ml-auto pl-3 text-[color:var(--faint)] transition-colors group-hover:text-[color:var(--accent)]"
              >
                ↗
              </span>
            </a>
          ) : (
            <div
              className="flex items-center gap-4 border-b py-5"
              style={{ borderColor: "var(--line)" }}
            >
              {marker}
              <span
                className="text-[15px] sm:text-base"
                style={{ color: "var(--dim)" }}
              >
                {cert.name}
              </span>
            </div>
          );

          return (
            <Reveal key={cert.name} delay={i * 0.05}>
              {inner}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
