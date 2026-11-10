import { systems } from "@/data/systems";
import SectionHeader from "@/app/components/SectionHeader";
import SystemScene from "./systems/SystemScene";

/**
 * Systems — the showpiece section.
 *
 * Each case study is a scroll-driven scene (see SystemScene): a monumental
 * title, a self-drawing architecture diagram pinned beside a narrative that
 * reveals in sequence. The section is a server component; the client-side motion
 * (GSAP + ScrollTrigger) lives inside each scene, and every scene renders fully
 * and legibly with no JS / reduced motion.
 */
export default function Systems() {
  return (
    <section id="systems" className="mb-16 sm:mb-24">
      <SectionHeader index="01" title="SYSTEMS" />
      <div className="flex flex-col divide-y divide-[color:var(--line)]">
        {systems.map((system, i) => (
          <SystemScene
            key={system.slug}
            system={system}
            index={i + 1}
            total={systems.length}
          />
        ))}
      </div>
    </section>
  );
}
