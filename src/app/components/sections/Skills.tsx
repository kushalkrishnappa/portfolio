import { skillGroups } from "@/data/skills";
import SectionHeader from "@/app/components/SectionHeader";

export default function Skills() {
  return (
    <section id="skills" className="mb-16 sm:mb-20">
      <SectionHeader command="cat skills.txt" />
      <div className="pl-4 border-l-2 border-gray-700 space-y-5">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">{group.label}</div>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-gray-900 border border-gray-700 px-3 py-1 rounded text-sm text-cyan-400 hover:border-cyan-600 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
