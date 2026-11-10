import { education } from "@/data/education";
import SectionHeader from "@/app/components/SectionHeader";

export default function Education() {
  return (
    <section id="education" className="mb-16 sm:mb-24">
      <SectionHeader index="05" title="EDUCATION" />
      <div className="space-y-4">
        {education.map((edu) => (
          <article
            key={edu.school}
            className="rounded-lg border p-6"
            style={{ background: "var(--surface)", borderColor: "var(--line)" }}
          >
            <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3
                className="display text-lg font-bold sm:text-xl"
                style={{ color: "var(--bone)" }}
              >
                {edu.school}
              </h3>
              <span
                className="mono text-[11px] uppercase tracking-[0.12em]"
                style={{ color: "var(--dim)" }}
              >
                {edu.period}
              </span>
            </div>

            <p className="text-sm sm:text-base" style={{ color: "var(--bone)" }}>
              {edu.degree}
              {edu.gpa && (
                <span style={{ color: "var(--dim)" }}>
                  {" · GPA "}
                  <span style={{ color: "var(--accent)" }}>{edu.gpa}</span>
                </span>
              )}
            </p>

            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "var(--dim)" }}
            >
              <span
                className="mono text-[11px] uppercase tracking-[0.14em]"
                style={{ color: "var(--faint)" }}
              >
                Coursework{"  "}
              </span>
              {edu.coursework.join(", ")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
