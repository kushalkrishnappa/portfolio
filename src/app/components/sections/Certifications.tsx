import { certifications } from "@/data/certifications";
import SectionHeader from "@/app/components/SectionHeader";

export default function Certifications() {
  return (
    <section id="certifications" className="mb-16 sm:mb-20">
      <SectionHeader command="ls ~/certifications" />
      <div className="pl-4 border-l-2 border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="bg-gray-900 border border-gray-800 p-3 rounded text-sm flex items-start"
            >
              <span className={`mr-2 ${cert.featured ? "text-purple-400" : "text-green-500"}`}>▸</span>
              <span className="text-gray-300">{cert.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
