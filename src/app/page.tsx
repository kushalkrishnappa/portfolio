import Whoami from "@/app/components/sections/Whoami";
import ImpactMetrics from "@/app/components/sections/ImpactMetrics";
import Experience from "@/app/components/sections/Experience";
import Projects from "@/app/components/sections/Projects";
import Skills from "@/app/components/sections/Skills";
import Education from "@/app/components/sections/Education";
import Publications from "@/app/components/sections/Publications";
import Certifications from "@/app/components/sections/Certifications";
import Contact from "@/app/components/sections/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pt-12 sm:pt-20 pb-16">
        <Whoami />
        <ImpactMetrics />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Publications />
        <Certifications />
        <Contact />

        <div className="text-center text-xs text-gray-600 border-t border-gray-800 pt-8">
          <p>© 2026 Kushal Krishnappa. Built with Next.js &amp; Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}
