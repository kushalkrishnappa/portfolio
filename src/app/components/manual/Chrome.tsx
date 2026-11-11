import Monogram from "./Monogram";

export const RESUME_HREF = "/files/KushalKrishnappa.pdf";

/** Fixed chrome on the manual: monogram stamp + primary nav (`data-go` = target id). */
export default function Chrome() {
  return (
    <header className="chrome">
      <Monogram />
      <nav className="nav" aria-label="Primary">
        <a href="#s1" data-go="s1">
          <span className="k">01</span>Work
        </a>
        <a href="#s10" data-go="s10">
          <span className="k">10</span>Contact
        </a>
        <a href={RESUME_HREF} download="KushalKrishnappa.pdf">
          Résumé
        </a>
      </nav>
    </header>
  );
}

/**
 * The same chrome on pages outside the manual (/blogs, 404): the stamp and
 * Manual link go home. Plain <a> on purpose: the manual wants a full document
 * load (its pre-paint motion gate runs in the document head).
 */
export function PageChrome() {
  return (
    <header className="chrome">
      <Monogram href="/" />
      <nav className="nav" aria-label="Primary">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full load for the manual's motion gate */}
        <a href="/">
          <span className="k">00</span>Manual
        </a>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full load for the manual's motion gate */}
        <a href="/#s10">
          <span className="k">10</span>Contact
        </a>
        <a href={RESUME_HREF} download="KushalKrishnappa.pdf">
          Résumé
        </a>
      </nav>
    </header>
  );
}
