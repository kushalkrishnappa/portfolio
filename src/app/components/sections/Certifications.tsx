import { certifications } from "@/data/certifications";
import SectionHeader from "@/app/components/SectionHeader";

export default function Certifications() {
  return (
    <section id="certifications" className="mb-16 sm:mb-20">
      <SectionHeader command="ls ~/certifications" />
      <div className="pl-4 border-l-2 border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certifications.map((cert) => {
            const marker = (
              <span className={`mr-2 ${cert.featured ? "text-purple-400" : "text-green-500"}`}>▸</span>
            );
            const baseClasses =
              "bg-gray-900 border border-gray-800 p-3 rounded text-sm flex items-start";

            return cert.url ? (
              <a
                key={cert.name}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseClasses} hover:border-gray-600 transition-colors group`}
              >
                {marker}
                <span className="text-gray-300 group-hover:text-cyan-400 transition-colors">
                  {cert.name}
                </span>
                <span className="ml-auto pl-2 text-gray-600 group-hover:text-cyan-400 transition-colors">
                  ↗
                </span>
              </a>
            ) : (
              <div key={cert.name} className={baseClasses}>
                {marker}
                <span className="text-gray-300">{cert.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
