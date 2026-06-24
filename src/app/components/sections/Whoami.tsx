import { profile } from "@/data/profile";
import SectionHeader from "@/app/components/SectionHeader";

export default function Whoami() {
  return (
    <section id="home" className="mb-16 sm:mb-20">
      <div className="mb-8">
        <SectionHeader command="whoami" />
        <div className="pl-4 border-l-2 border-gray-700">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {profile.name}
          </h1>
          <p className="text-xl sm:text-2xl text-cyan-400 mb-2">{profile.tagline}</p>
          <p className="text-sm text-green-400 mb-6">{profile.availability}</p>
          <div className="space-y-4 text-sm sm:text-base leading-relaxed">
            <p>{profile.about.intro}</p>

            <div>
              <p className="text-gray-400 mb-2">{"What I've built:"}</p>
              <ul className="space-y-2">
                {profile.about.built.map((item) => (
                  <li key={item.org} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">▸</span>
                    <span>
                      <span className="text-cyan-400">{item.org}</span> — {item.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p>{profile.about.closing}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm mb-8">
        {profile.quickInfo.map((info) => (
          <div key={info.label} className="bg-gray-900 border border-gray-700 p-4 rounded">
            <div className="text-gray-500 mb-1">{info.label}</div>
            <div className="text-white">{info.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
