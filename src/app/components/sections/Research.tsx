import { research } from "@/data/research";
import SectionHeader from "@/app/components/SectionHeader";

export default function Research() {
  return (
    <section id="research" className="mb-16 sm:mb-24">
      <SectionHeader index="07" title="RESEARCH" />
      <article
        className="rounded-lg border p-6"
        style={{ background: "var(--surface)", borderColor: "var(--line)" }}
      >
        <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h3
            className="display text-lg font-bold sm:text-xl"
            style={{ color: "var(--bone)" }}
          >
            {research.title}
          </h3>
          <span
            className="mono text-[11px] uppercase tracking-[0.12em]"
            style={{ color: "var(--dim)" }}
          >
            {research.period}
          </span>
        </div>

        <p className="text-sm sm:text-base" style={{ color: "var(--bone)" }}>
          {research.advisor}
        </p>
        <p
          className="mono mt-1 text-[11px] uppercase tracking-[0.12em]"
          style={{ color: "var(--faint)" }}
        >
          {research.group}
        </p>

        <p className="mt-4 text-sm leading-relaxed sm:text-[15px]" style={{ color: "var(--dim)" }}>
          {research.summary}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {research.skills.map((skill) => (
            <li
              key={skill}
              className="mono rounded-full border px-3 py-1 text-[11px] tracking-[0.03em]"
              style={{ borderColor: "var(--line-2)", color: "var(--bone)" }}
            >
              {skill}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
