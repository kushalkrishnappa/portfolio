import { experiences } from "@/data/experience";
import SectionHeader from "@/app/components/SectionHeader";

export default function Experience() {
  return (
    <section id="experience" className="mb-16 sm:mb-24">
      <SectionHeader index="02" title="EXPERIENCE" />
      <div className="space-y-5">
        {experiences.map((exp) => (
          <article
            key={`${exp.company}-${exp.period}`}
            className="rounded-lg border bg-[color:var(--surface)] border-[color:var(--line)] p-6 transition-colors hover:border-[color:var(--line-2)]"
          >
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3
                className="display text-lg font-bold sm:text-xl"
                style={{ color: "var(--bone)" }}
              >
                {exp.company}
              </h3>
              <span
                className="mono text-[11px] uppercase tracking-[0.12em]"
                style={{ color: "var(--dim)" }}
              >
                {exp.period}
              </span>
            </div>

            <p className="text-sm font-medium sm:text-base" style={{ color: "var(--bone)" }}>
              {exp.role}
            </p>
            <p
              className="mono mt-1 text-[11px] uppercase tracking-[0.12em]"
              style={{ color: "var(--faint)" }}
            >
              {exp.location}
            </p>

            {exp.summary && (
              <p
                className="mt-4 text-sm leading-relaxed sm:text-[15px]"
                style={{ color: "var(--dim)" }}
              >
                {exp.summary}
              </p>
            )}

            {exp.tags && exp.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <li
                    key={tag}
                    className="mono rounded-full border px-3 py-1 text-[11px] tracking-[0.03em]"
                    style={{ borderColor: "var(--line-2)", color: "var(--bone)" }}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            <ul className="mt-5 space-y-2.5">
              {exp.achievements.map((achievement, idx) => (
                <li key={idx} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-[9px] h-px w-3 flex-shrink-0"
                    style={{ background: "var(--line-2)" }}
                  />
                  <span style={{ color: "var(--dim)" }}>{achievement}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
