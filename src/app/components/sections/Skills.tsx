import { skillGroups } from "@/data/skills";
import SectionHeader from "@/app/components/SectionHeader";

export default function Skills() {
  return (
    <section id="skills" className="mb-16 sm:mb-24">
      <SectionHeader index="04" title="SKILLS" />
      <div className="space-y-6">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <div
              className="mono mb-3 text-[11px] uppercase tracking-[0.18em]"
              style={{ color: "var(--dim)" }}
            >
              {group.label}
            </div>
            <ul className="flex flex-wrap gap-2.5">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="mono rounded-full border px-3.5 py-1.5 text-[13px] tracking-[0.03em]"
                  style={{ borderColor: "var(--line)", color: "var(--bone)" }}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
