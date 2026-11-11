/** Shared SVG defs: hatches, markers, the pencil "rough" and stamp textures. */
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#e8f2f9" strokeWidth="1" strokeOpacity=".5" />
        </pattern>
        <pattern id="hatchFine" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#e8f2f9" strokeWidth=".8" strokeOpacity=".38" />
        </pattern>
        <pattern id="hatchO" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#ff6a1a" strokeWidth="1.2" strokeOpacity=".55" />
        </pattern>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
          <path d="M0 1.5 L10 5 L0 8.5 z" fill="#e8f2f9" />
        </marker>
        <marker id="tk" viewBox="-5 -5 10 10" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto">
          <path d="M-4 4 L4 -4" stroke="#e8f2f9" strokeWidth="1.4" />
        </marker>
        <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2" />
        </filter>
        <filter id="stampTex" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="11" result="t" />
          <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.8 2.25" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" result="c" />
          <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="2" result="w" />
          <feDisplacementMap in="c" in2="w" scale="3.5" />
        </filter>
      </defs>
    </svg>
  );
}

/** The moving two-colour sheen used as an SVG fill on metrics. */
export function SheenDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="popSheen" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox" spreadMethod="repeat">
          <stop offset="0" stopColor="var(--ink)" style={{ stopColor: "var(--ink)" }} />
          <stop offset=".35" stopColor="var(--ink)" style={{ stopColor: "var(--ink)" }} />
          <stop offset=".45" style={{ stopColor: "var(--sig)" }} />
          <stop offset=".55" style={{ stopColor: "var(--pop2)" }} />
          <stop offset=".65" style={{ stopColor: "var(--ink)" }} />
          <stop offset="1" style={{ stopColor: "var(--ink)" }} />
          <animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="1 0" dur="4.5s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
    </svg>
  );
}
