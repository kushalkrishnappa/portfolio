import Monogram from "./Monogram";

export const RESUME_HREF = "/files/KushalKrishnappa.pdf";

/** Fixed chrome: monogram stamp + primary nav. */
export default function Chrome() {
  return (
    <header className="chrome">
      <Monogram />
      <nav className="nav" aria-label="Primary">
        <a href="#s1" data-go="1">
          <span className="k">01</span>Work
        </a>
        <a href="#s6" data-go="6">
          <span className="k">06</span>Contact
        </a>
        <a href={RESUME_HREF} download="KushalKrishnappa.pdf">
          Résumé
        </a>
      </nav>
    </header>
  );
}
