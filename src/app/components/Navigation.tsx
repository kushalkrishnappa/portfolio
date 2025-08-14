'use client'

export default function Navigation() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-slate-800 border-b border-green-400 p-4 font-mono fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-green-400">$ whoami</h1>
        </div>
        <div className="hidden sm:flex space-x-6">
          <button onClick={() => scrollToSection('home')} className="text-green-400 hover:text-cyan-400 transition-colors">
            $ home
          </button>
          <button onClick={() => scrollToSection('experience')} className="text-green-400 hover:text-cyan-400 transition-colors">
            $ experience
          </button>
          <button onClick={() => scrollToSection('projects')} className="text-green-400 hover:text-cyan-400 transition-colors">
            $ projects
          </button>
          <button onClick={() => scrollToSection('skills')} className="text-green-400 hover:text-cyan-400 transition-colors">
            $ skills
          </button>
        </div>
      </div>
    </nav>
  )
}