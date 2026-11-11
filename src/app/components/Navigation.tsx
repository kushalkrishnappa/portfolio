'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

// Quiet top bar for the Monumental Nameplate world: a "KK" display monogram on
// the left, mono nav links on the right, a cyan "contact" primary action, and
// the résumé download. Kept restrained so the hero wordmark leads.
const NAV_LINKS = [
  { label: "experience", href: "/#experience" },
  { label: "systems", href: "/#systems" },
  { label: "projects", href: "/#projects" },
  { label: "writing", href: "/#writing" },
  { label: "blogs", href: "/blogs" },
];

const focusRing =
  "rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]";

export default function Navigation() {
  const pathname = usePathname();
  // The embed signature route is a bare, standalone surface — no fixed nav.
  // The homepage (Field Manual) carries its own chrome: monogram, nav, sheet index.
  if (pathname === "/" || pathname?.startsWith("/embed")) return null;

  const downloadResume = () => {
    const link = document.createElement("a");
    link.href = "/files/KushalKrishnappa.pdf";
    link.download = "KushalKrishnappa.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md"
      style={{
        background: "color-mix(in srgb, var(--bg) 85%, transparent)",
        borderColor: "var(--line)",
      }}
    >
      <div className="flex w-full items-center justify-between px-5 py-3 sm:px-8 sm:py-4 lg:px-14 xl:px-20">
        <Link
          href="/"
          aria-label="Kushal Krishnappa — home"
          className={`display text-lg font-black tracking-tight sm:text-xl text-[color:var(--bone)] ${focusRing}`}
        >
          KK
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <ul className="hidden items-center gap-5 sm:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`mono text-xs uppercase tracking-[0.14em] transition-colors text-[color:var(--dim)] hover:text-[color:var(--bone)] ${focusRing}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/#contact"
            className={`mono text-xs uppercase tracking-[0.14em] transition-opacity text-[color:var(--accent)] hover:opacity-80 ${focusRing}`}
          >
            contact
          </Link>

          <button
            type="button"
            onClick={downloadResume}
            className={`mono text-xs uppercase tracking-[0.14em] transition-colors text-[color:var(--dim)] hover:text-[color:var(--bone)] ${focusRing}`}
          >
            résumé ↓
          </button>
        </div>
      </div>
    </nav>
  );
}
