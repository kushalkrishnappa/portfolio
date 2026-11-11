import { describe, it, expect } from "vitest";

import { profile } from "./profile";
import { impactMetrics } from "./impact";
import { experiences } from "./experience";
import { projects } from "./projects";
import { skillGroups } from "./skills";
import { education } from "./education";
import { publications } from "./publications";
import { certifications } from "./certifications";
import { systems } from "./systems";
import { sheets, fleetFacts, coverRevisions } from "./manual";
import fs from "node:fs";
import path from "node:path";

// Private material must never ship: internal Jira keys (PENG-####) or
// internal PR / ticket numbers (#NNN+).
const PRIVATE_DENYLIST = /PENG-\d|#\d{3,}/;

function collectStrings(value: unknown, acc: string[]): string[] {
  if (typeof value === "string") {
    acc.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, acc);
  } else if (value && typeof value === "object") {
    for (const v of Object.values(value as Record<string, unknown>)) {
      collectStrings(v, acc);
    }
  }
  return acc;
}

const allData: Record<string, unknown> = {
  profile,
  impactMetrics,
  experiences,
  projects,
  skillGroups,
  education,
  publications,
  certifications,
  systems,
  manualSheets: sheets,
  fleetFacts,
  coverRevisions,
};

describe("data layer — private denylist", () => {
  it("contains no private Jira keys or PR/ticket numbers", () => {
    const offenders: string[] = [];
    for (const [name, data] of Object.entries(allData)) {
      for (const s of collectStrings(data, [])) {
        if (PRIVATE_DENYLIST.test(s)) {
          offenders.push(`${name}: ${s}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("projects", () => {
  it("does not claim Auth Server or kvstore", () => {
    const names = projects.map((p) => p.name);
    expect(names).not.toContain("Auth Server");
    expect(names).not.toContain("kvstore");
  });
});

describe("impact metrics", () => {
  it("has exactly 3 entries", () => {
    expect(impactMetrics).toHaveLength(3);
  });

  it("drops the undefensible 90% automation metric", () => {
    for (const metric of impactMetrics) {
      expect(metric.value).not.toContain("90%");
      expect(metric.label).not.toContain("90%");
    }
  });
});

describe("profile — retired RA role", () => {
  // Assembled from parts so a repo-wide grep for the retired role stays empty.
  const RA = new RegExp(
    [["research", "assistant"], ["systems", "research"], ["xi", "ang"]]
      .map((parts) => parts.join(parts[0] === "xi" ? "" : " "))
      .join("|"),
    "i",
  );

  it("mentions the retired role nowhere in the profile", () => {
    const hits = collectStrings(profile, []).filter((s) => RA.test(s));
    expect(hits).toEqual([]);
  });

  it("uses the Northeastern now-line", () => {
    expect(profile.nowLine).toBe("MS CS @ Northeastern · open to full-time May 2027");
  });

  it("has no CURRENT ROLE quick-info entry", () => {
    expect(profile.quickInfo.map((q) => q.label)).not.toContain("CURRENT ROLE");
  });
});

describe("field manual — binding content rules", () => {
  const sheetSrc = (name: string) =>
    fs.readFileSync(path.resolve(__dirname, "../app/components/manual/sheets", name), "utf8");
  // the reader-facing copy: notes, schedules, fact cards, revisions
  const manualText = collectStrings(
    { copy: sheets.map((s) => [s.eyebrow, s.notes ?? [], s.schedule ?? []]), fleetFacts, coverRevisions },
    [],
  ).join("\n");
  // text lettered inside a drawing (JSX text nodes)
  const drawingText = (name: string) => (sheetSrc(name).match(/>[^<>{}]+</g) ?? []).join("\n");

  it("frames the disruption manager as Pure's internal control point Dominator consults", () => {
    const rollout = sheets.find((s) => s.id === "s3")!;
    expect(rollout.notes!.join(" ")).toContain("rollout-safety control point Dominator consults");
  });

  it("credits the open-source Go version to the Dominator maintainer, not to Kushal", () => {
    const src = sheetSrc("Rollout.tsx");
    expect(src).toContain("open-sourced by the Dominator maintainer");
    expect(src).toContain("STATES · DOMINATOR PROTOCOL");
    expect(src).toContain("N = 2 · illustrative");
  });

  it("states no group size of 3,000 and no availability percentage", () => {
    const text = manualText + drawingText("Rollout.tsx");
    expect(text).not.toMatch(/3,000/);
    expect(text).not.toMatch(/\d+(\.\d+)?\s?%/);
  });

  it("labels the Beacon state diagram illustrative", () => {
    expect(sheetSrc("Workflows.tsx")).toContain("Illustrative · state names and codes are not from the source");
  });

  it("never claims RoonCyber customers", () => {
    expect(manualText).not.toMatch(/customer/i);
  });
});
