import Hero from "@/app/components/sections/Hero";
import Statement from "@/app/components/sections/Statement";
import Metrics from "@/app/components/sections/Metrics";
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
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--bone)" }}>
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-12 sm:pt-20 pb-16">
        <Hero />
        <Statement />
        <Metrics />
        <Systems />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Research />
        <Publications />
        <Certifications />
        <Writing />
        <Contact />
      </div>

      {/* Full-bleed closing bookend — outside the padded container. */}
      <Footer />
    </div>
  );
}
