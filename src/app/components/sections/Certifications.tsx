import { certifications } from "@/data/certifications";
import SectionHeader from "@/app/components/SectionHeader";

export default function Certifications() {
  return (
    <section id="certifications" className="mb-16 sm:mb-24">
      <SectionHeader index="08" title="CERTIFICATIONS" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {certifications.map((cert) => {
          const baseClasses =
            "flex items-center gap-3 rounded-lg border p-4 text-sm";

          const dot = (
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
              style={{
                background: cert.featured ? "var(--accent)" : "var(--faint)",
              }}
            />
          );

          return cert.url ? (
            <a
              key={cert.name}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseClasses} group bg-[color:var(--surface)] border-[color:var(--line)] transition-colors hover:border-[color:var(--line-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]`}
            >
              {dot}
              <span className="text-[color:var(--dim)] transition-colors group-hover:text-[color:var(--bone)]">
                {cert.name}
              </span>
              <span
                aria-hidden="true"
                className="mono ml-auto pl-2 text-[color:var(--faint)] transition-colors group-hover:text-[color:var(--accent)]"
              >
                ↗
              </span>
            </a>
          ) : (
            <div
              key={cert.name}
              className={baseClasses}
              style={{ background: "var(--surface)", borderColor: "var(--line)" }}
            >
              {dot}
              <span style={{ color: "var(--dim)" }}>{cert.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
