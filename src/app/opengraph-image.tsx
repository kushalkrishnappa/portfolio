import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/data/profile";

// OG card in the Field Manual world: the near-black drafting ground with its
// grid, the stencil name, the orange request dot (the one Heat accent), the
// role box and the availability line. No eyebrow or title block: the card is
// read at thumbnail size, so it carries only what a viewer needs. Rendered once at build (static), Node runtime.
//
// Fonts are tiny glyph subsets of two OFL families, bundled in src/assets/og
// so the build never fetches anything: Big Shoulders Stencil (opsz 72,
// wght 900 — the Display cut) for "KUSHAL KRISHNAPPA", Martian Mono 500 for
// the labels. Re-subset them if this copy changes.
export const alt = `${profile.name} — Backend & Platform Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Field Manual tokens (components/manual/field-manual.css).
const PAPER = "#0b0e14";
const INK = "#e9edf3";
const INK2 = "rgba(233,237,243,.60)";
const GRID = "rgba(233,237,243,.055)";
const GRID_FINE = "rgba(233,237,243,.028)";
const SIG = "#ff5a1f";
const POP2 = "#ffd60a";

const font = (f: string) => readFile(join(process.cwd(), "src/assets/og", f));

export default async function OpengraphImage() {
  const [stencil, mono] = await Promise.all([font("BigShouldersStencil-900-subset.ttf"), font("MartianMono-500-subset.ttf")]);
  const [first, ...rest] = profile.name.toUpperCase().split(" ");
  const label = { fontFamily: "Mono", fontSize: 15, letterSpacing: 4.5, color: INK2 } as const;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
          backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px), linear-gradient(${GRID_FINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_FINE} 1px, transparent 1px)`,
          backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
          padding: 26,
        }}
      >
        <div style={{ position: "relative", display: "flex", flexDirection: "column", width: "100%", height: "100%", border: `2px solid ${INK2}`, padding: "44px 56px", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Stencil", fontSize: 178, lineHeight: 0.82, color: INK }}>
            <div style={{ display: "flex" }}>{first}</div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              {rest.join(" ")}
              <div style={{ width: 26, height: 26, borderRadius: 13, background: SIG, marginLeft: 12, marginBottom: 14 }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 38 }}>
            <div style={{ display: "flex", flexShrink: 0, whiteSpace: "nowrap", fontFamily: "Mono", fontSize: 17, letterSpacing: 4, color: INK, border: `1.5px solid ${INK2}`, padding: "10px 16px 9px" }}>
              BACKEND &amp; PLATFORM ENGINEER
            </div>
            <div style={{ display: "flex", flexDirection: "column", whiteSpace: "nowrap", ...label, fontSize: 12, letterSpacing: 1.5 }}>
              MS CS @ NORTHEASTERN · OPEN TO FULL-TIME MAY 2027
              <div style={{ display: "flex", width: 120, height: 3, marginTop: 10, backgroundImage: `linear-gradient(90deg, ${SIG}, ${POP2})` }} />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Stencil", data: stencil, weight: 900, style: "normal" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
