'use client'

export default function Navigation() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Height of fixed navigation
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="bg-black border-b border-gray-800 p-4 font-mono fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4 max-w-5xl flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-green-400">
            <span className="text-green-500">$</span> kushalkrishnappa
          </h1>
        </div>
        <div className="hidden sm:flex space-x-6 text-sm">
          <button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-cyan-400 transition-colors">
            whoami
          </button>
          <button onClick={() => scrollToSection('skills')} className="text-gray-400 hover:text-cyan-400 transition-colors">
            skills
          </button>
          <button onClick={() => scrollToSection('projects')} className="text-gray-400 hover:text-cyan-400 transition-colors">
            projects
          </button>
          <button onClick={() => scrollToSection('experience')} className="text-gray-400 hover:text-cyan-400 transition-colors">
            experience
          </button>
          <button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-cyan-400 transition-colors">
            contact
          </button>
        </div>
      </div>
    </nav>
  )
}