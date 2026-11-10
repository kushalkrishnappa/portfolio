import { impactMetrics } from "@/data/impact";
import SectionHeader from "@/app/components/SectionHeader";

export default function ImpactMetrics() {
  return (
    <section id="impact" className="mb-16 sm:mb-24">
      <SectionHeader index="01" title="IMPACT" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {impactMetrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border p-6"
            style={{
              background: "var(--surface)",
              borderColor: "var(--line)",
            }}
          >
            <div
              className="display text-2xl font-bold sm:text-3xl"
              style={{ color: "var(--accent)" }}
            >
              {metric.value}
            </div>
            <div
              className="mono mt-3 text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "var(--dim)" }}
            >
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
