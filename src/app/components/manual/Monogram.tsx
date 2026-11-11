/** The "KK" drafting-stamp monogram (top-left). Its ring text turns with scroll. */
export default function Monogram() {
  return (
    <a className="mono-stamp" href="#top" aria-label="Kushal Krishnappa — back to cover" data-go="0">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path id="mcirc" d="M50 50 m-37 0 a37 37 0 1 1 74 0 a37 37 0 1 1 -74 0" />
        </defs>
        <circle className="ms-bg" cx="50" cy="50" r="49" />
        <g filter="url(#rough)">
          <circle className="ms-ln" cx="50" cy="50" r="46.5" />
          <circle className="ms-ln t" cx="50" cy="50" r="29" />
          <g className="ms-ring">
            <text className="ms-txt">
              <textPath href="#mcirc" textLength="230" lengthAdjust="spacing">
                K. Krishnappa · Field manual · Rev D ·
              </textPath>
            </text>
          </g>
          <text className="ms-kk" x="50" y="61" textAnchor="middle">
            KK
          </text>
        </g>
        <circle className="ms-dot" cx="50" cy="13" r="2.6" />
      </svg>
    </a>
  );
}
