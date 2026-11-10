import { projects } from "@/data/projects";
import SectionHeader from "@/app/components/SectionHeader";

export default function Projects() {
  return (
    <section id="projects" className="mb-16 sm:mb-24">
      <SectionHeader index="03" title="PROJECTS" />
      <div className="space-y-5">
        {projects.map((project) => (
          <article
            key={project.name}
            className="rounded-lg border bg-[color:var(--surface)] border-[color:var(--line)] p-6 transition-colors hover:border-[color:var(--line-2)]"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3
                className="display text-lg font-bold sm:text-xl"
                style={{ color: "var(--bone)" }}
              >
                {project.name}
              </h3>
              <div className="mono flex items-center gap-2 text-[11px] uppercase tracking-[0.12em]">
                {project.role && (
                  <span style={{ color: "var(--dim)" }}>{project.role}</span>
                )}
                {project.role && project.year && (
                  <span aria-hidden="true" style={{ color: "var(--faint)" }}>
                    ·
                  </span>
                )}
                {project.year && (
                  <span style={{ color: "var(--faint)" }}>{project.year}</span>
                )}
              </div>
            </div>

            <p className="mt-2 text-sm leading-relaxed sm:text-[15px]" style={{ color: "var(--dim)" }}>
              {project.description}
            </p>

            <ul className="mt-4 space-y-2">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-[9px] h-px w-3 flex-shrink-0"
                    style={{ background: "var(--line-2)" }}
                  />
                  <span style={{ color: "var(--dim)" }}>{feature}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--bone)" }}>
              {project.impact}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
              <ul className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <li
                    key={tech}
                    className="mono rounded-full border px-3 py-1 text-[11px] tracking-[0.03em]"
                    style={{ borderColor: "var(--line-2)", color: "var(--bone)" }}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            {project.links && project.links.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono rounded-sm text-xs tracking-[0.04em] transition-opacity hover:opacity-80 text-[color:var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
