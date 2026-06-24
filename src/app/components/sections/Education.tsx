import { education } from "@/data/education";
import SectionHeader from "@/app/components/SectionHeader";

export default function Education() {
  return (
    <section id="education" className="mb-16 sm:mb-20">
      <SectionHeader command="cat education.md" />
      <div className="pl-4 border-l-2 border-gray-700 space-y-4">
        {education.map((edu) => (
          <div key={edu.school} className="bg-gray-900 border border-gray-800 p-6 rounded">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
              <h3 className="text-lg sm:text-xl font-bold text-white">{edu.school}</h3>
              <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">{edu.period}</span>
            </div>
            <p className="text-cyan-400 text-sm sm:text-base">
              {edu.degree}
              {edu.gpa && (
                <span className="text-gray-400">
                  {" "}· GPA <span className="text-green-400">{edu.gpa}</span>
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-2">Coursework: {edu.coursework.join(", ")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
