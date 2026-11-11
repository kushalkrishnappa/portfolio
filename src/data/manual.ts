/**
 * Field Manual — sheet metadata and the sheet-specific copy (spec tables,
 * general notes, fact cards, title blocks).
 *
 * Wording is BINDING (see docs/superpowers/specs/2026-11-11-field-manual-design.md
 * "Content rules"): every line here must survive an interview follow-up.
 * In notes, `**bold**` marks the key phrase that lights up with the Heat
 * underline when the note is reached.
 *
 * Drawing labels (what is lettered inside each schematic) live in the drawing
 * components under src/app/components/manual/sheets/.
 */

import { skillGroups } from "./skills";

export type CompanyName = "mercedes" | "everpure" | "rooncyber";
/** Every official mark the manual may show: the employers plus the school (Appendix B). */
export type MarkName = CompanyName | "northeastern";

export interface TitleCell {
  label: string;
  value: string;
  /** Tighter letter-spacing for long values (keeps the cell un-truncated). */
  tight?: boolean;
}

export interface SheetMeta {
  id: string;
  no: string;
  /** Short label for the right-edge sheet index. `­` = soft hyphen. */
  railLabel: string;
  title: string;
  rev: string;
  eyebrow: string;
  /** The employer whose mark sits on this sheet's client plate. */
  client?: CompanyName;
  schedule?: { caption: string; rows: [string, string][] };
  notes?: string[];
  /** Bottom row of the title block: [drawn, date|type|status, scale]. */
  titleCells: [TitleCell, TitleCell, TitleCell];
  /** Scroll length of the sheet (CSS length, v3 values). */
  height: string;
  edge: "torn" | "deckle";
  /** Paper blotch offset (background-position). */
  bp: string;
}

export const MANUAL_PROJECT = "K. Krishnappa · Field manual";
export const MANUAL_REV = "D";
export const MANUAL_DATE = "Nov 2026";
export const SHEET_TOTAL = "06";

export const coverRevisions: { rev: string; description: string; client: CompanyName; date: string }[] = [
  { rev: "A", description: "Data platform — Mercedes-Benz R&D India", client: "mercedes", date: "2022" },
  { rev: "B", description: "Fleet reliability — Pure Storage / Everpure", client: "everpure", date: "2023–24" },
  { rev: "C", description: "Rollout safety — Pure Storage / Everpure", client: "everpure", date: "2023–24" },
  { rev: "D", description: "Tenant isolation — RoonCyber", client: "rooncyber", date: "2026" },
];

const drawn: TitleCell = { label: "Drawn", value: "K. Krishnappa" };

export const sheets: SheetMeta[] = [
  {
    id: "s1",
    no: "01",
    railLabel: "Ingestion",
    title: "Ingestion",
    rev: "A",
    eyebrow: "Sheet 01 / 06 · Mercedes-Benz R&D India · 2022",
    client: "mercedes",
    schedule: {
      caption: "Schedule A — Role",
      rows: [
        ["Employer", "Mercedes-Benz R&D India"],
        ["Role", "Software Engineer"],
        ["Period", "Mar – Dec 2022"],
        ["Stack", "Azure Event Hubs · PySpark · Delta Lake"],
      ],
    },
    notes: [
      "Pitched a **central data warehouse**, then built it.",
      "Multi-source ingestion into **Azure Event Hubs**.",
      "**PySpark / Delta Lake** ETL over **90 TB+** of OTA vehicle telemetry.",
    ],
    titleCells: [drawn, { label: "Date", value: "Mar–Dec 2022" }, { label: "Scale", value: "1 : 90 TB" }],
    height: "440vh",
    edge: "torn",
    bp: "70% 30%",
  },
  {
    id: "s2",
    no: "02",
    railLabel: "Fleet recon­ciliation",
    title: "Fleet reconciliation",
    rev: "B",
    eyebrow: "Sheet 02 / 06 · Pure Storage / Everpure · 2023–24",
    client: "everpure",
    schedule: {
      caption: "Schedule B — Role",
      rows: [
        ["Employer", "Pure Storage / Everpure"],
        ["Role", "Member of Technical Staff 2"],
        ["Period", "Jan 2023 – Dec 2024"],
        ["Stack", "Temporal · OpenStack"],
      ],
    },
    titleCells: [drawn, { label: "Date", value: "2023 – 2024" }, { label: "Scale", value: "1:9,000 VMs", tight: true }],
    height: "400vh",
    edge: "torn",
    bp: "20% 70%",
  },
  {
    id: "s3",
    no: "03",
    railLabel: "Rollout safety",
    title: "Rollout safety",
    rev: "C",
    eyebrow: "Sheet 03 / 06 · Pure Storage / Everpure · 2023–24",
    client: "everpure",
    schedule: {
      caption: "Schedule C — Disruption manager",
      rows: [
        ["Employer", "Pure Storage / Everpure"],
        ["Role", "Member of Technical Staff 2"],
        ["Goal", "Never disrupt a whole group at once"],
      ],
    },
    notes: [
      "Pure's internal **disruption-manager service**: the rollout-safety control point Dominator consults before a disruptive update.",
      "Pushed to a whole group, a disruptive image restarts every VM at once: **test availability drops to zero**, and a bad image breaks tests.",
      "**Per-group concurrency budget**: a semaphore held in Consul. Only N machines in a group are disrupted at a time.",
      "**Test-aware gating**: a request waits until the tests running on that machine finish. **Canary** first, **fast revert**.",
      "**Pluggable** check / request / cancel interface, so other teams can write their own by implementing three methods.",
      "**~7× fewer DB reads** via a 100 s TTL Redis cache plus negotiated backoff.",
    ],
    titleCells: [drawn, { label: "Date", value: "2023 – 2024" }, { label: "Scale", value: "NTS" }],
    height: "470vh",
    edge: "torn",
    bp: "50% 40%",
  },
  {
    id: "s4",
    no: "04",
    railLabel: "Tenant isolation",
    title: "Tenant isolation",
    rev: "D",
    eyebrow: "Sheet 04 / 06 · RoonCyber · 2026",
    client: "rooncyber",
    schedule: {
      caption: "Schedule D — Role",
      rows: [
        ["Employer", "RoonCyber"],
        ["Role", "Software Engineer Co-op"],
        ["Period", "Jan – Aug 2026"],
        ["System", "Multi-tenant AI-security notifications"],
      ],
    },
    notes: [
      "Multi-tenant **AI-security notification platform**.",
      "**Per-tenant detectors**, isolated tenant by tenant.",
      "**Idempotent watermarks**: a redelivered event is a no‑op.",
      "**Mutation-tested**.",
      "Took over an **AI-identity pipeline** two weeks before a board-requested launch; **shipped on schedule**.",
    ],
    titleCells: [drawn, { label: "Date", value: "Jan–Aug 2026" }, { label: "Scale", value: "1:N tenants", tight: true }],
    height: "440vh",
    edge: "deckle",
    bp: "80% 80%",
  },
  {
    id: "s5",
    no: "05",
    railLabel: "Durable workflows",
    title: "Durable workflows",
    rev: "—",
    eyebrow: "Sheet 05 / 06 · Side projects · Go + Temporal",
    schedule: {
      caption: "Schedule E — Projects",
      rows: [
        ["Beacon", "Notification service in Go + Temporal"],
        ["Author", "Sole author"],
        ["Stack 2", "temporal-onprem-stack"],
        ["What", "Self-hosted Temporal with mTLS"],
      ],
    },
    notes: [
      "**Beacon**: a notification service written in Go on Temporal. Sole author.",
      "Failures are expected; the workflow **retries** and still completes.",
      "**temporal-onprem-stack**: self-hosted Temporal, workers and server talking over **mTLS**.",
    ],
    titleCells: [drawn, { label: "Type", value: "Side projects" }, { label: "Scale", value: "NTS" }],
    height: "380vh",
    edge: "torn",
    bp: "40% 20%",
  },
  {
    id: "s6",
    no: "06",
    railLabel: "Issued for hire",
    title: "Issued for hire",
    rev: "D",
    eyebrow: "Sheet 06 / 06 · Transmittal · Issued for hire",
    schedule: {
      caption: "Schedule F — Issue",
      rows: [
        ["Open to", "Backend · Platform · Infra · SRE roles"],
        ["Degree", "MS Computer Science, Northeastern · May 2027"],
        ["Set", "Cover, five sheets + appendices A–C"],
        ["Reply", "Email, GitHub or LinkedIn"],
      ],
    },
    titleCells: [drawn, { label: "Date", value: "Nov 2026" }, { label: "Status", value: "For hire" }],
    height: "290vh",
    edge: "deckle",
    bp: "60% 60%",
  },
];

/**
 * Appendices — reference sheets between sheet 05 and sheet 06. Same paper and
 * title block as the story sheets, but NOT pinned: their rows draw in on scroll.
 */
export interface AppendixMeta {
  id: string;
  letter: "A" | "B" | "C";
  /** Short label for the sheet index (shown beside the letter). */
  railLabel: string;
  title: string;
  eyebrow: string;
  titleCells: [TitleCell, TitleCell, TitleCell];
  edge: "torn" | "deckle";
  bp: string;
}

export const APPENDIX_TOTAL = "C";

/** Total parts in Appendix A's bill of materials (one per listed skill). */
export const PARTS_TOTAL = skillGroups.reduce((n, g) => n + g.skills.length, 0);

export const appendices: AppendixMeta[] = [
  {
    id: "appx-a",
    letter: "A",
    railLabel: "Parts",
    title: "Parts list",
    eyebrow: "Appendix A · Bill of materials · Tools and platforms",
    titleCells: [drawn, { label: "Qty", value: `${PARTS_TOTAL} parts` }, { label: "Scale", value: "NTS" }],
    edge: "torn",
    bp: "30% 60%",
  },
  {
    id: "appx-b",
    letter: "B",
    railLabel: "Specs",
    title: "Specifications",
    eyebrow: "Appendix B · Education · Publication · Certifications",
    titleCells: [drawn, { label: "Date", value: MANUAL_DATE }, { label: "Scale", value: "NTS" }],
    edge: "deckle",
    bp: "70% 50%",
  },
  {
    id: "appx-c",
    letter: "C",
    railLabel: "Notes",
    title: "Field notes",
    eyebrow: "Appendix C · Writing · Log of entries",
    titleCells: [drawn, { label: "Type", value: "Log" }, { label: "Status", value: "Open" }],
    edge: "torn",
    bp: "50% 80%",
  },
];

/** Sheet 02's three fact cards (scrolled one at a time in the notes column). */
export const fleetFacts: { n: string; title: [string, string]; body: string }[] = [
  { n: "Fact 01 · The fleet", title: ["2,000 testbeds", "9,000+ VMs"], body: "One OpenStack fleet to keep healthy." },
  { n: "Fact 02 · The system", title: ["Event-driven", "reconciliation"], body: "Reconciliation and rollout-safety services, built on Temporal." },
  { n: "Fact 03 · The result", title: ["MTTR", "5 h → 10 min"], body: "Mean time to recovery across the fleet, from five hours to ten minutes." },
];

export function sheetById(id: string): SheetMeta {
  const s = sheets.find((x) => x.id === id);
  if (!s) throw new Error(`unknown sheet ${id}`);
  return s;
}
