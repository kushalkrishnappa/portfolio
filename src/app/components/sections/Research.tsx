import { research } from "@/data/research";
import SectionHeader from "@/app/components/SectionHeader";
import Reveal from "@/app/components/motion/Reveal";

/**
 * Research — the single research role as a refined feature block (no boxed card).
 *
 * Title in the display face; advisor · group · period as mono meta; an airy
 * summary; skills as inline mono labels. Revealed on scroll. Reduced motion /
 * no-JS / SSR render the final legible state (Reveal handles this).
 */
export default function Research() {
  return (
    <section id="research" className="mb-16 sm:mb-24">
      <SectionHeader index="06" title="RESEARCH" />

      <Reveal
        as="article"
        className="border-t border-b py-10 sm:py-14"
        style={{ borderColor: "var(--line)" }}
      >
        {/* Title — display face. */}
        <h3
          className="display font-black leading-[1.03]"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            letterSpacing: "-0.02em",
            color: "var(--bone)",
          }}
        >
          {research.title}
        </h3>

        {/* Advisor · group · period — mono meta. */}
        <p
          className="mono mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.14em]"
          style={{ color: "var(--dim)" }}
        >
          <span style={{ color: "var(--bone)" }}>{research.advisor}</span>
          <span aria-hidden="true" style={{ color: "var(--line-2)" }}>
            /
          </span>
          <span>{research.group}</span>
          <span aria-hidden="true" style={{ color: "var(--line-2)" }}>
            /
          </span>
          <span style={{ color: "var(--faint)" }}>{research.period}</span>
        </p>

        {/* Summary. */}
        <p
          className="mt-6 max-w-[64ch] text-[15px] leading-relaxed sm:text-base"
          style={{ color: "var(--bone)" }}
        >
          {research.summary}
        </p>

        {/* Skills — inline mono labels (not chips/boxes). */}
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
          {research.skills.map((skill, s) => (
            <span key={skill} className="inline-flex items-center gap-3">
              {s > 0 && (
                <span aria-hidden="true" style={{ color: "var(--line-2)" }}>
                  /
                </span>
              )}
              <span
                className="mono text-[12px] tracking-[0.02em]"
                style={{ color: "var(--dim)" }}
              >
                {skill}
              </span>
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
