import type { Metadata } from "next";
import { profile } from "@/data/profile";

// Standalone signature for iframe embedding (recruiter messages, email, etc.).
// Dark, self-contained, no scroll, no nav/cursor. Fluid sizing keeps the name
// dominant and legible from ~600×200 up to full width.
export const metadata: Metadata = {
  title: "Signature",
  description: `${profile.name} — ${profile.role}`,
  robots: { index: false, follow: false },
};

const SITE_URL = "https://kushalkrishnappa.com";

export default function EmbedSignature() {
  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--bone)",
        padding: "clamp(16px, 5vw, 48px)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Accent eyebrow */}
      <div
        className="mono"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6em",
          color: "var(--accent)",
          fontSize: "clamp(0.6rem, 1.6vw, 0.78rem)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: "0.7em",
        }}
      >
        <span
          aria-hidden
          style={{
            width: "clamp(20px, 4vw, 34px)",
            height: 2,
            background: "var(--accent)",
          }}
        />
        {profile.role}
      </div>

      {/* Dominant name */}
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${profile.name} — view portfolio`}
        className="display"
        style={{
          display: "block",
          color: "var(--bone)",
          fontWeight: 900,
          fontSize: "clamp(2.2rem, 11vw, 6rem)",
          lineHeight: 0.92,
          letterSpacing: "-0.03em",
          textDecoration: "none",
        }}
      >
        {profile.name}
      </a>

      {/* Now line + portfolio link */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.8em 1.4em",
          marginTop: "clamp(0.8em, 2.5vw, 1.3em)",
        }}
      >
        <div
          className="mono"
          style={{
            color: "var(--dim)",
            fontSize: "clamp(0.62rem, 1.7vw, 0.85rem)",
            letterSpacing: "0.04em",
          }}
        >
          {profile.nowLine}
        </div>
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mono"
          style={{
            color: "var(--accent)",
            fontSize: "clamp(0.66rem, 1.8vw, 0.9rem)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          View portfolio ↗
        </a>
      </div>
    </main>
  );
}
