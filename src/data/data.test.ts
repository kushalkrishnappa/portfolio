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
import { research } from "./research";

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
  research,
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
