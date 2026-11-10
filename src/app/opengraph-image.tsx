import { ImageResponse } from "next/og";

// Static OG card rendered at build/edge with next/og. Uses only built-in
// system sans weights — no remote font fetch, so it never blocks the build.
export const runtime = "edge";
export const alt = "Kushal Krishnappa — Backend & Platform Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Palette mirrors globals.css tokens.
const BG = "#0A0A0A";
const BONE = "#ECECEA";
const ACCENT = "#4DD4E0";
const DIM = "#8A8F96";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "72px 80px",
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
        }}
      >
        {/* Top: accent eyebrow detail */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 4, background: ACCENT }} />
          <div
            style={{
              color: ACCENT,
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Portfolio
          </div>
        </div>

        {/* Center: monumental wordmark */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: BONE,
              fontSize: 132,
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: -4,
            }}
          >
            KUSHAL
          </div>
          <div
            style={{
              display: "flex",
              color: BONE,
              fontSize: 132,
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: -4,
            }}
          >
            KRISHNAPPA
          </div>
          <div
            style={{
              display: "flex",
              color: DIM,
              fontSize: 34,
              fontWeight: 500,
              marginTop: 26,
              letterSpacing: 0.5,
            }}
          >
            Backend &amp; platform engineer
          </div>
        </div>

        {/* Footer: mono-styled domain line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              color: DIM,
              fontSize: 26,
              letterSpacing: 2,
              fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
            }}
          >
            kushalkrishnappa.com
          </div>
          <div
            style={{
              color: DIM,
              fontSize: 26,
              letterSpacing: 2,
              fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
            }}
          >
            Go · Kubernetes · Temporal · AWS
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
