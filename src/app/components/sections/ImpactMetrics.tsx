import { impactMetrics } from "@/data/impact";
import SectionHeader from "@/app/components/SectionHeader";

export default function ImpactMetrics() {
  return (
    <section id="impact" className="mb-16 sm:mb-20">
      <SectionHeader command="./impact_metrics.sh" />
      <div className="pl-4 border-l-2 border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {impactMetrics.map((metric) => (
            <div key={metric.label} className="bg-gray-900 border border-gray-800 p-5 rounded">
              <div className="text-2xl font-bold text-green-400 mb-2">{metric.value}</div>
              <div className="text-xs text-gray-400">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
