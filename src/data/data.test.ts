import { describe, it, expect } from "vitest";

import { profile } from "./profile";
import { skillGroups } from "./skills";
import { education } from "./education";
import { publications } from "./publications";
import { certifications } from "./certifications";
import { sheets, fleetFacts, coverRevisions, appendices, generalData, generalDataMore, PARTS_TOTAL, SHEET_TOTAL } from "./manual";
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
  skillGroups,
  education,
  publications,
  certifications,
  manualSheets: sheets,
  fleetFacts,
  coverRevisions,
  appendices,
  generalData,
  generalDataMore,
};

const SRC = path.resolve(__dirname, "..");
/** Every shipped source file under src/ (components, pages, data), minus tests. */
function shippedSources(dir = SRC): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return shippedSources(p);
    return /\.(tsx?|css)$/.test(e.name) && !/\.test\.ts$/.test(e.name) ? [p] : [];
  });
}
const readSrc = (rel: string) => fs.readFileSync(path.join(SRC, rel), "utf8");

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

describe("shipped copy — retired claims", () => {
  // The old projects / impact data is gone; these guard the whole shipped
  // source so the claims cannot come back anywhere on the site.
  const files = shippedSources();

  it("never claims Auth Server or kvstore", () => {
    const hits = files.filter((f) => /Auth Server|kvstore/i.test(fs.readFileSync(f, "utf8")));
    expect(hits).toEqual([]);
  });

  it("never states the retired 90% automation / MTTD metric", () => {
    // "90% coverage gate" (Beacon) and "availability above 90%" are allowed; the old
    // "90% automation" and "MTTD −90%" claims are not. Copy lives in .ts/.tsx.
    const retired = /automat\w*[^.\n]{0,40}90\s?%|90\s?%[^.\n]{0,40}automat|MTT[DR][^.\n]{0,30}90\s?%|90\s?%[^.\n]{0,30}MTT[DR]/i;
    const hits = files.filter((f) => /\.tsx?$/.test(f) && retired.test(fs.readFileSync(f, "utf8")));
    expect(hits).toEqual([]);
  });

  it("keeps the floor exclusions off the site", () => {
    // someone else's record or work (see the content inventory, floor exclusions)
    const floor = new RegExp(
      [["spot", "award"], ["you", "tube"], ["leet", "code"], ["lend", "wise"], ["hacker", "rank"]].map((w) => w.join("")).join("|"),
      "i",
    );
    const hits = files.filter((f) => /\.tsx?$/.test(f) && floor.test(fs.readFileSync(f, "utf8")));
    expect(hits).toEqual([]);
  });

  it("uses no internal tool, table, route or service names", () => {
    const internal = new RegExp(
      [
        ["pu", "ca"], ["ral", "ph"], ["cnapp-", "(api|consumer|dashboard)"], ["external", "-api"], ["ai_", "notify"],
        ["notification", "_settings"], ["service_identity", "_links"], ["customer_api", "_tokens"], ["assets", "db"],
        ["un", "ext"], ["auto sim", " rehab"],
      ]
        .map(([a, b]) => `\\b${a}${b}\\b`)
        .join("|"),
      "i",
    );
    const hits = files.filter((f) => /\.tsx?$/.test(f) && internal.test(fs.readFileSync(f, "utf8")));
    expect(hits).toEqual([]);
  });

  it("contains no private Jira keys or PR/ticket numbers in any component copy", () => {
    const jsx = (src: string) => (src.match(/>[^<>{}]+</g) ?? []).join("\n");
    const hits = files.filter((f) => f.endsWith(".tsx") && PRIVATE_DENYLIST.test(jsx(fs.readFileSync(f, "utf8"))));
    expect(hits).toEqual([]);
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
  // the reader-facing copy: notes, schedules, fact cards, revisions, general data
  const manualText = collectStrings(
    { copy: sheets.map((s) => [s.eyebrow, s.notes ?? [], s.schedule ?? []]), fleetFacts, coverRevisions, generalData, generalDataMore },
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

  it("keeps the illustrative budget labelled, even with the real pool size shown", () => {
    // Marketing policy (2026-11): the 3,000-machine pool and availability figures are
    // allowed; the drawn budget of 2 stays labelled illustrative.
    expect(drawingText("Rollout.tsx")).toContain("BUDGET 2 / GROUP");
    expect(sheetSrc("Rollout.tsx")).toContain("N = 2 · illustrative");
  });

  it("credits authorship the defensible way (floor)", () => {
    const tenant = sheets.find((s) => s.id === "s5")!.notes!.join(" ");
    // he designed the M2M system and built the request path, not the key lifecycle endpoints
    expect(tenant).toMatch(/built its request path/);
    expect(manualText).not.toMatch(/(built|wrote)[^.]{0,40}(key lifecycle|token (create|lifecycle)|lifecycle endpoints)/i);
    // the in-kernel eBPF sensor is not his; the Rust analyzer sanitizer and the UI are
    expect(manualText).not.toMatch(/(wrote|built|authored)[^.]{0,30}eBPF (programs?|sensor)/i);
    expect(manualText + drawingText("Workflows.tsx")).not.toMatch(/dsapanicle/i);
  });

  it("numbers every sheet out of the same total", () => {
    expect(SHEET_TOTAL).toBe(String(sheets.length).padStart(2, "0"));
    sheets.forEach((s, i) => {
      expect(s.no).toBe(String(i + 1).padStart(2, "0"));
      expect(s.id).toBe(`s${i + 1}`);
      expect(s.eyebrow).toContain(`Sheet ${s.no} / ${SHEET_TOTAL}`);
    });
    // every work sheet (01–08) has a cover revision row with its client chip
    const work = sheets.filter((s) => s.client);
    expect(coverRevisions.map((r) => r.rev)).toEqual(work.map((s) => s.rev));
    expect(coverRevisions.map((r) => r.client)).toEqual(work.map((s) => s.client));
  });

  it("labels the Beacon state diagram illustrative", () => {
    expect(sheetSrc("Workflows.tsx")).toContain("Illustrative · state names and codes are not from the source");
  });

  it("never claims RoonCyber customers", () => {
    expect(manualText).not.toMatch(/customer/i);
  });
});

describe("appendices — A parts list, B specifications, C field notes", () => {
  it("are A, B, C in order with unique ids and rail labels", () => {
    expect(appendices.map((a) => a.letter)).toEqual(["A", "B", "C"]);
    expect(new Set(appendices.map((a) => a.id)).size).toBe(3);
    for (const a of appendices) {
      expect(a.id).toMatch(/^appx-[abc]$/);
      expect(a.railLabel.length).toBeGreaterThan(0);
      expect(a.eyebrow).toContain(`Appendix ${a.letter}`);
    }
  });

  it("counts every listed skill as one part", () => {
    expect(PARTS_TOTAL).toBe(skillGroups.reduce((n, g) => n + g.skills.length, 0));
    const skills = skillGroups.flatMap((g) => g.skills);
    expect(new Set(skills).size).toBe(skills.length);
  });

  it("lists the Northeastern MS CS (4.0, May 2027) first, then the undergrad degree", () => {
    const [ms, bt] = education;
    expect(ms.school).toBe("Northeastern University");
    expect(ms.degree).toMatch(/M\.S\. Computer Science/);
    expect(ms.gpa).toMatch(/^4\.0/);
    expect(ms.period).toMatch(/May 2027$/);
    expect(bt?.school).toBe("PES University");
  });

  it("dates the publication IEEE CONECCT 2022", () => {
    expect(publications[0]).toMatchObject({ venue: "IEEE CONECCT", year: "2022" });
    expect(publications[0].url).toMatch(/^https:\/\/ieeexplore\.ieee\.org\//);
  });

  it("has a name for every certification", () => {
    expect(certifications.length).toBeGreaterThan(0);
    for (const c of certifications) expect(c.name.trim().length).toBeGreaterThan(0);
  });

  it("puts the official Northeastern logo on its native black chip", () => {
    const mark = readSrc("app/components/manual/CompanyMark.tsx");
    expect(mark).toMatch(/northeastern:\s*\{[^}]*src: "\/logos\/northeastern\.svg"[^}]*ground: "#000"/);
    expect(fs.existsSync(path.resolve(SRC, "../public/logos/northeastern.svg"))).toBe(true);
  });

  it("never filters, masks, clips or fades a logo chip (brand rules)", () => {
    const css = readSrc("app/components/manual/field-manual.css");
    const chipRules = css.match(/\.chip[^{]*\{[^}]*\}/g) ?? [];
    expect(chipRules.length).toBeGreaterThan(0);
    for (const r of chipRules) expect(r).not.toMatch(/filter|mask|clip-path|opacity|mix-blend/);
  });

  it("keeps the appendix copy clear of the binding content rules", () => {
    const copy = readSrc("app/components/manual/sheets/Appendices.tsx");
    const text = [copy, collectStrings(appendices, []).join("\n")].join("\n");
    expect(text).not.toMatch(/customer/i);
    expect(PRIVATE_DENYLIST.test(text)).toBe(false);
  });
});
