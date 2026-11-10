import Hero from "@/app/components/sections/Hero";
import Systems from "@/app/components/sections/Systems";
import Experience from "@/app/components/sections/Experience";
import Projects from "@/app/components/sections/Projects";
import Writing from "@/app/components/sections/Writing";
import Skills from "@/app/components/sections/Skills";
import Education from "@/app/components/sections/Education";
import Research from "@/app/components/sections/Research";
import Publications from "@/app/components/sections/Publications";
import Certifications from "@/app/components/sections/Certifications";
import Contact from "@/app/components/sections/Contact";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--bone)" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pt-12 sm:pt-20 pb-16">
        <Hero />
        <Systems />
        <Experience />
        <Projects />
        <Writing />
        <Skills />
        <Education />
        <Research />
        <Publications />
        <Certifications />
        <Contact />

        <div
          className="mono pt-8 text-center text-[11px] uppercase tracking-[0.14em] border-t"
          style={{ color: "var(--faint)", borderColor: "var(--line)" }}
        >
          <p>© 2026 Kushal Krishnappa — Built with Next.js &amp; Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}
