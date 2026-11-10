"use client";

import { useId, useState } from "react";
import { systems } from "@/data/systems";
import type { SystemCaseStudy } from "@/types";
import SectionHeader from "@/app/components/SectionHeader";

// A single flagship system, rendered as an accessible disclosure. Collapsed is
// the scannable summary; expanded is the deep read (problem / approach /
// highlights / stack). The whole detail is toggled by one <button aria-expanded>.
function SystemCard({ system }: { system: SystemCaseStudy }) {
  const [open, setOpen] = useState(false);
  const detailId = useId();

  return (
    <article
      className="rounded-lg border p-6 transition-colors"
      style={{ background: "var(--surface)", borderColor: "var(--line)" }}
    >
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h3
          className="display text-lg font-bold sm:text-xl"
          style={{ color: "var(--bone)" }}
        >
          {system.name}
        </h3>
        {system.status && (
          <span
            className="mono text-[11px] uppercase tracking-[0.14em]"
            style={{ color: "var(--accent)" }}
          >
            {system.status}
          </span>
        )}
      </div>

      <p
        className="mono text-[11px] uppercase tracking-[0.12em]"
        style={{ color: "var(--dim)" }}
      >
        {system.org}
        <span aria-hidden="true" style={{ color: "var(--faint)" }}>
          {" · "}
        </span>
        {system.period}
        <span aria-hidden="true" style={{ color: "var(--faint)" }}>
          {" · "}
        </span>
        {system.role}
      </p>

      <p
        className="mt-4 text-sm leading-relaxed sm:text-[15px]"
        style={{ color: "var(--dim)" }}
      >
        {system.summary}
      </p>

      <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--bone)" }}>
        {system.outcome}
      </p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={detailId}
        className="mono mt-5 inline-flex items-center gap-2 rounded-sm text-[11px] uppercase tracking-[0.14em] transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
        style={{ color: "var(--accent)" }}
      >
        <span
          aria-hidden="true"
          className="inline-block transition-transform"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          ▸
        </span>
        {open ? "Hide the deep read" : "Read the deep read"}
      </button>

      {open && (
        <div
          id={detailId}
          className="mt-6 space-y-6 border-t pt-6"
          style={{ borderColor: "var(--line)" }}
        >
          <div>
            <h4
              className="mono text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "var(--faint)" }}
            >
              Problem
            </h4>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "var(--dim)" }}
            >
              {system.problem}
            </p>
          </div>

          <div>
            <h4
              className="mono text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "var(--faint)" }}
            >
              Approach
            </h4>
            <ul className="mt-2 space-y-2.5">
              {system.approach.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-[9px] h-px w-3 flex-shrink-0"
                    style={{ background: "var(--line-2)" }}
                  />
                  <span style={{ color: "var(--dim)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="mono text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "var(--faint)" }}
            >
              Highlights
            </h4>
            <ul className="mt-2 space-y-2.5">
              {system.highlights.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-[9px] h-px w-3 flex-shrink-0"
                    style={{ background: "var(--accent)" }}
                  />
                  <span style={{ color: "var(--bone)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="mono text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "var(--faint)" }}
            >
              Stack
            </h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {system.stack.map((tech) => (
                <li
                  key={tech}
                  className="mono rounded-full border px-3 py-1 text-[11px] tracking-[0.03em]"
                  style={{ borderColor: "var(--line-2)", color: "var(--bone)" }}
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </article>
  );
}

export default function Systems() {
  return (
    <section id="systems" className="mb-16 sm:mb-24">
      <SectionHeader index="01" title="SYSTEMS" />
      <div className="space-y-5">
        {systems.map((system) => (
          <SystemCard key={system.slug} system={system} />
        ))}
      </div>
    </section>
  );
}
