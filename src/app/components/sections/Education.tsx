import { education } from "@/data/education";
import SectionHeader from "@/app/components/SectionHeader";
import Reveal from "@/app/components/motion/Reveal";

/**
 * Education — two schools as an elegant, hairline-separated list (no boxed cards).
 *
 * Each entry: degree in the display face, school · period · GPA as mono meta, and
 * coursework as inline mono labels. Entries reveal on scroll, staggered. Reduced
 * motion / no-JS / SSR all render the final, legible state (Reveal handles this).
 */
export default function Education() {
  return (
    <section id="education" className="mb-16 sm:mb-24">
      <SectionHeader index="05" title="EDUCATION" />

      <div className="border-t" style={{ borderColor: "var(--line)" }}>
        {education.map((edu, i) => (
          <Reveal
            as="article"
            key={edu.school}
            delay={i * 0.06}
            className="border-b py-9 sm:py-12"
            style={{ borderColor: "var(--line)" }}
          >
            <div className="flex flex-col gap-x-10 gap-y-6 md:grid md:grid-cols-[1fr_auto] md:items-baseline">
              <div>
                {/* Degree — display face, leads the entry. */}
                <h3
                  className="display font-black leading-[1.05]"
                  style={{
                    fontSize: "clamp(1.5rem, 3.4vw, 2.35rem)",
                    letterSpacing: "-0.02em",
                    color: "var(--bone)",
                  }}
                >
                  {edu.degree}
                </h3>

                {/* School · period · GPA — mono meta. */}
                <p
                  className="mono mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.14em]"
                  style={{ color: "var(--dim)" }}
                >
                  <span style={{ color: "var(--bone)" }}>{edu.school}</span>
                  <span aria-hidden="true" style={{ color: "var(--line-2)" }}>
                    /
                  </span>
                  <span style={{ color: "var(--dim)" }}>{edu.period}</span>
                  {edu.gpa && (
                    <>
                      <span aria-hidden="true" style={{ color: "var(--line-2)" }}>
                        /
                      </span>
                      <span>
                        GPA{" "}
                        <span style={{ color: "var(--accent)" }}>{edu.gpa}</span>
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Coursework — inline mono labels, hairline-separated (not boxed). */}
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span
                className="mono text-[11px] uppercase tracking-[0.16em]"
                style={{ color: "var(--faint)" }}
              >
                Coursework
              </span>
              <span aria-hidden="true" style={{ color: "var(--line-2)" }}>
                /
              </span>
              {edu.coursework.map((course, c) => (
                <span key={course} className="inline-flex items-center gap-3">
                  {c > 0 && (
                    <span aria-hidden="true" style={{ color: "var(--line-2)" }}>
                      /
                    </span>
                  )}
                  <span
                    className="mono text-[12px] tracking-[0.02em]"
                    style={{ color: "var(--dim)" }}
                  >
                    {course}
                  </span>
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
