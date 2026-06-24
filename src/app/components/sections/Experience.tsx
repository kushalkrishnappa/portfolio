import { experiences } from "@/data/experience";
import SectionHeader from "@/app/components/SectionHeader";

export default function Experience() {
  return (
    <section id="experience" className="mb-16 sm:mb-20">
      <SectionHeader command="cat experience.log" />
      <div className="pl-4 border-l-2 border-gray-700 space-y-6">
        {experiences.map((exp) => (
          <div
            key={`${exp.company}-${exp.period}`}
            className="bg-gray-900 border border-gray-800 p-6 rounded hover:border-gray-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
              <h3 className="text-lg sm:text-xl font-bold text-white">{exp.company}</h3>
              <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">{exp.period}</span>
            </div>
            <p className="text-cyan-400 mb-1 text-sm sm:text-base">{exp.role}</p>
            <p className="text-xs text-gray-500 mb-4">{exp.location}</p>
            <div className="space-y-2">
              {exp.achievements.map((achievement, idx) => (
                <div key={idx} className="flex items-start text-sm">
                  <span className="text-green-500 mr-2 mt-1">▸</span>
                  <span className="text-gray-300">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
