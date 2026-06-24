import { publications } from "@/data/publications";
import SectionHeader from "@/app/components/SectionHeader";

export default function Publications() {
  return (
    <section id="publications" className="mb-16 sm:mb-20">
      <SectionHeader command="cat publications.bib" />
      <div className="pl-4 border-l-2 border-gray-700 space-y-4">
        {publications.map((pub) => (
          <div key={pub.title} className="bg-gray-900 border border-gray-800 p-6 rounded">
            <h3 className="text-base sm:text-lg font-bold text-white">{pub.title}</h3>
            <p className="text-amber-400 text-xs sm:text-sm my-1">{pub.venue}</p>
            <p className="text-sm text-gray-300">{pub.description}</p>
            {pub.url && (
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-cyan-400 hover:text-cyan-300"
              >
                ▸ Read paper →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
