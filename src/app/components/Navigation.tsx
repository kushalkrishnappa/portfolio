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

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/files/KushalKrishnappa.pdf';
    link.download = 'KushalKrishnappa.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <nav className="bg-black border-b border-gray-800 p-3 sm:p-4 font-mono fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-2 sm:px-4 max-w-5xl flex justify-between items-center">
        <div className="flex-shrink-0 flex items-center">
          <h1 className="text-base sm:text-xl md:text-2xl font-bold text-green-400 flex items-center">
            <span className="text-green-500">$</span>
            <span className="ml-2 inline-block w-[200px] sm:w-[280px] md:w-[350px] overflow-hidden relative">
              <span className="inline-block whitespace-nowrap animate-slideLeft">
                ./kushalkrishnappa -bold -brilliant -breaking_barriers&nbsp;&nbsp;&nbsp;&nbsp;./kushalkrishnappa -bold -brilliant -breaking_barriers&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </span>
          </h1>
        </div>
        <div className="hidden sm:flex space-x-4 md:space-x-6 text-xs md:text-sm">
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
          <button onClick={() => downloadResume()} className="text-gray-400 hover:text-cyan-400 transition-colors">
            resume
          </button>
        </div>
      </div>
    </nav>
  )
}