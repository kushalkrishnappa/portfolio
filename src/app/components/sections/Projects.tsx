import { projects } from "@/data/projects";
import SectionHeader from "@/app/components/SectionHeader";

export default function Projects() {
  return (
    <section id="projects" className="mb-16 sm:mb-20">
      <SectionHeader command="ls -la ~/projects" />
      <div className="pl-4 border-l-2 border-gray-700 space-y-8">
        {projects.map((project) => (
          <div
            key={project.name}
            className="bg-gray-900 border border-gray-800 p-6 rounded hover:border-gray-700 transition-colors"
          >
            <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
            <p className="text-gray-400 mb-4">{project.description}</p>

            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">TECH STACK</div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="text-xs bg-gray-800 px-2 py-1 rounded text-cyan-400">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">KEY FEATURES</div>
              <ul className="space-y-1 text-sm">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <span className="text-green-500 mr-2">▸</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">IMPACT</div>
              <p className="text-sm text-gray-300">{project.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
