'use client'
import Link from "next/link";

const NAV_LINKS = [
  { label: "whoami", href: "/#home" },
  { label: "experience", href: "/#experience" },
  { label: "projects", href: "/#projects" },
  { label: "skills", href: "/#skills" },
  { label: "blog", href: "/blog" },
  { label: "contact", href: "/#contact" },
];

export default function Navigation() {
  const downloadResume = () => {
    const link = document.createElement("a");
    link.href = "/files/KushalKrishnappa.pdf";
    link.download = "KushalKrishnappa.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <nav className="bg-black border-b border-gray-800 p-3 sm:p-4 font-mono fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-2 sm:px-4 max-w-5xl flex justify-between items-center">
        <div className="flex-shrink-0 flex items-center">
          <Link href="/">
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-green-400 flex items-center">
              <span className="text-green-500">$</span>
              <span className="ml-2 inline-block w-[200px] sm:w-[280px] md:w-[350px] overflow-hidden relative">
                <span className="inline-block whitespace-nowrap animate-slideLeft">
                  ./kushalkrishnappa -bold -brilliant -breaking_barriers&nbsp;&nbsp;&nbsp;&nbsp;./kushalkrishnappa -bold -brilliant -breaking_barriers&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </span>
            </h1>
          </Link>
        </div>
        <div className="hidden sm:flex space-x-4 md:space-x-6 text-xs md:text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={downloadResume}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            resume
          </button>
        </div>
      </div>
    </nav>
  );
}
