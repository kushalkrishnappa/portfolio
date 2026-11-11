import { Big_Shoulders_Stencil, Instrument_Sans, Martian_Mono, Reenie_Beanie } from "next/font/google";

// Field Manual type. Variable fonts omit `weight` (an explicit weight array
// breaks `next dev --turbopack`'s font loader); all weights stay available.
//
// v3 used "Big Shoulders Stencil Display"; Google now ships it as the
// "Big Shoulders Stencil" family with an optical-size axis. field-manual.css
// pins opsz to 72, which is the Display cut.
export const fmDisplay = Big_Shoulders_Stencil({
  variable: "--font-fm-disp",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  // next/font has no fallback metrics for this family (build warning otherwise).
  adjustFontFallback: false,
});

// No subset filter (so not preloaded): v3's arrows (→ ↗ ↓) live outside the
// latin subset, and Google serves them via unicode-range files.
export const fmMono = Martian_Mono({
  variable: "--font-fm-mono",
  preload: false,
  display: "swap",
});

export const fmHand = Reenie_Beanie({
  variable: "--font-fm-hand",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const fmText = Instrument_Sans({
  variable: "--font-fm-text",
  subsets: ["latin"],
  display: "swap",
});

/** Class names that expose the four families as CSS variables. */
export const fmFontVars = [fmDisplay.variable, fmMono.variable, fmHand.variable, fmText.variable].join(" ");
