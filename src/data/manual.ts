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
export const MANUAL_REV = "H";
export const MANUAL_DATE = "Nov 2026";
export const SHEET_TOTAL = "10";

export const coverRevisions: { rev: string; description: string; client: CompanyName; date: string }[] = [
  { rev: "A", description: "Data platform", client: "mercedes", date: "2022" },
  { rev: "B", description: "Fleet reconciliation", client: "everpure", date: "2023–24" },
  { rev: "C", description: "Rollout safety", client: "everpure", date: "2023–24" },
  { rev: "D", description: "Release gate", client: "everpure", date: "2023–24" },
  { rev: "E", description: "Tenant isolation", client: "rooncyber", date: "2026" },
  { rev: "F", description: "Signal, not noise", client: "rooncyber", date: "2026" },
  { rev: "G", description: "Critical path", client: "rooncyber", date: "2026" },
  { rev: "H", description: "Assembly line", client: "rooncyber", date: "2026" },
];

const drawn: TitleCell = { label: "Drawn", value: "K. Krishnappa" };
const pure = "Pure Storage / Everpure";
const roon = "RoonCyber.AI";

export const sheets: SheetMeta[] = [
  {
    id: "s1",
    no: "01",
    railLabel: "Ingestion",
    title: "Ingestion",
    rev: "A",
    eyebrow: "Sheet 01 / 10 · Mercedes-Benz R&D India · 2022",
    client: "mercedes",
    schedule: {
      caption: "Schedule A — Role",
      rows: [
        ["Employer", "Mercedes-Benz R&D India"],
        ["Role", "Intern → Software Engineer"],
        ["Period", "Mar – Dec 2022"],
        ["Stack", "Azure Event Hubs · PySpark · Delta Lake · Spring Boot"],
      ],
    },
    notes: [
      "Pitched a **central data warehouse** as an intern, got it **greenlit**, then built it as a **full-time hire**.",
      "OTA campaign data **streams to Azure Event Hubs in real time**, retiring post-campaign DB queries.",
      "**PySpark / Delta Lake** ETL over **90 TB+** of OTA vehicle telemetry.",
      "On call for OTA and eSIM: traced the two slowest endpoints to an **N+1 query** and cut **p95 by 50%**.",
    ],
    titleCells: [drawn, { label: "Date", value: "Mar–Dec 2022" }, { label: "Scale", value: "1 : 90 TB" }],
    height: "300vh",
    edge: "torn",
    bp: "70% 30%",
  },
  {
    id: "s2",
    no: "02",
    railLabel: "Fleet recon­ciliation",
    title: "Fleet reconciliation",
    rev: "B",
    eyebrow: "Sheet 02 / 10 · Pure Storage / Everpure · 2023–24",
    client: "everpure",
    schedule: {
      caption: "Schedule B — Role",
      rows: [
        ["Employer", pure],
        ["Role", "Member of Technical Staff 2"],
        ["Period", "Jan 2023 – Dec 2024"],
        ["Stack", "Python · Go · Temporal · RabbitMQ · Consul"],
      ],
    },
    titleCells: [drawn, { label: "Date", value: "2023 – 2024" }, { label: "Scale", value: "1:9,000 VMs", tight: true }],
    height: "360vh",
    edge: "torn",
    bp: "20% 70%",
  },
  {
    id: "s3",
    no: "03",
    railLabel: "Rollout safety",
    title: "Rollout safety",
    rev: "C",
    eyebrow: "Sheet 03 / 10 · Pure Storage / Everpure · 2023–24",
    client: "everpure",
    schedule: {
      caption: "Schedule C — Disruption manager",
      rows: [
        ["Employer", pure],
        ["Scope", "One-click updates across 9,000+ VMs"],
        ["Goal", "Never disrupt a whole group at once"],
      ],
    },
    notes: [
      "Pure's internal **disruption-manager service**: the rollout-safety control point Dominator consults before a disruptive update.",
      "Pushed to a whole group (a **3,000-machine test pool**), a disruptive image restarts every VM at once: **test availability drops to zero**.",
      "**Per-group concurrency budget**: a semaphore held in Consul. Only N machines in a group are disrupted at a time.",
      "**Test-aware gating**: a request waits until that machine's tests finish. **Canary** first, **fast revert**; availability held **above 90%**.",
      "**Pluggable** check / request / cancel interface: other teams write their own by implementing three methods.",
      "Survived a **retry storm** on the first rollout; a 100 s TTL Redis cache plus negotiated backoff: **~7× fewer DB reads**.",
    ],
    titleCells: [drawn, { label: "Date", value: "2023 – 2024" }, { label: "Scale", value: "NTS" }],
    height: "440vh",
    edge: "torn",
    bp: "50% 40%",
  },
  {
    id: "s4",
    no: "04",
    railLabel: "Release gate",
    title: "Release gate",
    rev: "D",
    eyebrow: "Sheet 04 / 10 · Pure Storage / Everpure · 2023–24",
    client: "everpure",
    schedule: {
      caption: "Schedule D — Ubuntu 14 → 22",
      rows: [
        ["Employer", pure],
        ["Scope", "1,500+ environments · 100% compatible"],
        ["Shipped", "Beta in 1 month · permanent gate"],
        ["Stack", "Packer · Jenkins · Dominator · pytest"],
      ],
    },
    notes: [
      "Dev and test VMs had run **Ubuntu 14 since the company's 2014 founding**. I owned the move to 22.",
      "Inventoried every team's workflow: outreach, a **command corpus**, sessions with **distinguished engineers**.",
      "Baked **one Packer golden image**; script owners fixed what broke. **Beta in 1 month**, a second beta, then published.",
      "Automated the whole corpus as a **pytest suite** that tests **every new golden image**: a **permanent release gate** that replaced manual QA.",
      "**1,500+ environments** moved with **100% compatibility**. **VP recognition** and bonuses.",
    ],
    titleCells: [drawn, { label: "Date", value: "2023 – 2024" }, { label: "Scale", value: "1 : 1,500+" }],
    height: "300vh",
    edge: "deckle",
    bp: "35% 55%",
  },
  {
    id: "s5",
    no: "05",
    railLabel: "Tenant isolation",
    title: "Tenant isolation",
    rev: "E",
    eyebrow: "Sheet 05 / 10 · RoonCyber.AI · 2026",
    client: "rooncyber",
    schedule: {
      caption: "Schedule E — Keyed entry",
      rows: [
        ["Employer", roon],
        ["Role", "Software Engineer Co-op"],
        ["Period", "Jan – Aug 2026"],
        ["System", "Multi-tenant M2M API auth · Postgres RLS"],
      ],
    },
    notes: [
      "Designed **multi-tenant M2M API auth** and **built its request path**; later **reused as the MCP server's auth**.",
      "**The tenant comes from the token**, never the URL: editing the path can't reach another tenant.",
      "Keys **SHA-256 hashed**, shown **once**; a format check runs **before any DB work**.",
      "**Opaque 401s** for every bad key; a cache whose **TTL never outlives the token**.",
      "**Postgres RLS doors**: lookups before the tenant is known, **writes tenant-locked**.",
      "Also: **Azure posture** into an AWS-only platform with **zero new endpoints**, and a **Rust analyzer** that shows **which field matched**, never the value.",
    ],
    titleCells: [drawn, { label: "Date", value: "Jan–Aug 2026" }, { label: "Scale", value: "1:N tenants", tight: true }],
    height: "330vh",
    edge: "torn",
    bp: "80% 80%",
  },
  {
    id: "s6",
    no: "06",
    railLabel: "Signal, not noise",
    title: "Signal, not noise",
    rev: "F",
    eyebrow: "Sheet 06 / 10 · RoonCyber.AI · Aug 2026",
    client: "rooncyber",
    schedule: {
      caption: "Schedule F — Alert bell",
      rows: [
        ["Owner", "Sole designer and builder"],
        ["Shipped", "5 PRs · PRD to production in 18 days"],
        ["Detectors", "High/Critical · AI identity · Shadow AI"],
        ["Stack", "Go · Postgres RLS · SQS · React"],
      ],
    },
    notes: [
      "Owned the **AI-security alert bell** end to end, from the PM's PRD: detectors, schema, API, UI, settings.",
      "**One transaction per tenant**; a row lock **serializes replicas** and the watermark rises **atomically** with each notify.",
      "**Cold start = one baseline row**, not a flood. The emission cap **defers, never drops**.",
      "**Dedup lives in a tracker, not the feed**, so retention can't resurrect a notification; an escalation **re-surfaces past a dismissal**.",
      "**Mutation-tested** under the **real least-privilege DB role**; settings API **p95 1.25 ms**.",
      "The **most-requested feature in platform demos**: shown to the CEO, CTO, design partners and sales.",
    ],
    titleCells: [drawn, { label: "Date", value: "Aug 2026" }, { label: "Scale", value: "18 days" }],
    height: "320vh",
    edge: "deckle",
    bp: "60% 30%",
  },
  {
    id: "s7",
    no: "07",
    railLabel: "Critical path",
    title: "Critical path",
    rev: "G",
    eyebrow: "Sheet 07 / 10 · RoonCyber.AI · Jul 2026",
    client: "rooncyber",
    schedule: {
      caption: "Schedule G — AI Identity",
      rows: [
        ["Deadline", "Board-requested launch · Jul 21"],
        ["Shipped", "16 PRs to main in 3 weeks"],
        ["Result", "Launched on schedule"],
        ["Stack", "Go · Postgres · Neo4j · AWS IAM"],
      ],
    },
    notes: [
      "The engineer building **AI Identities** left **two weeks before a board-requested launch**. I **took the whole pipeline**.",
      "**16 PRs in 3 weeks**: owner writes **read from the primary**; last-used and **evidence-based dormancy** from AWS.",
      "A **privilege column derived from IAM policy actions**, with PBAC policy nodes in the **Neo4j graph**.",
      "**Identity → workload → application** “runs-as” links; an **invariant test** that guards a class of silent bugs.",
      "**Launched on schedule on Jul 21.** Thanked by **the CEO and the Director of Product**.",
    ],
    titleCells: [drawn, { label: "Date", value: "Jul 2026" }, { label: "Scale", value: "1 : 3 wks" }],
    height: "290vh",
    edge: "torn",
    bp: "25% 45%",
  },
  {
    id: "s8",
    no: "08",
    railLabel: "Assembly line",
    title: "Assembly line",
    rev: "H",
    eyebrow: "Sheet 08 / 10 · RoonCyber.AI · May–Aug 2026",
    client: "rooncyber",
    schedule: {
      caption: "Schedule H — Agentic harness",
      rows: [
        ["Built", "8-stage harness · PRD → merged PR"],
        ["Adoption", "9+ of 12 engineers"],
        ["Output", "25+ features in 4 months"],
        ["Stack", "Claude Code · MCP · Jira · git worktrees"],
      ],
    },
    notes: [
      "**Built an 8-stage agentic harness** that drives Claude from PRD to merged PR, with a **human approval gate between every stage**.",
      "**9+ of 12 engineers** used it; **25+ features** shipped through it in four months.",
      "**Drift and spec-fidelity validators** feed one auto-revise loop; every dropped requirement needs **a recorded decision**.",
      "A wrong spec fixed at a gate costs **minutes**; in code review it costs **days**.",
      "An autonomous coding loop drifted into unreviewable diffs, so implementation became an **interactive arbiter**.",
      "When an agent built against a datastore **switched off for the release**, research learned to **ground-truth the real serving path**.",
    ],
    titleCells: [drawn, { label: "Date", value: "May–Aug 2026" }, { label: "Scale", value: "8 stations" }],
    height: "310vh",
    edge: "deckle",
    bp: "45% 65%",
  },
  {
    id: "s9",
    no: "09",
    railLabel: "Durable workflows",
    title: "Durable workflows",
    rev: "—",
    eyebrow: "Sheet 09 / 10 · Side projects · Go + Temporal",
    schedule: {
      caption: "Schedule J — Projects",
      rows: [
        ["Beacon", "Notification service in Go + Temporal"],
        ["Author", "Sole author · 90% coverage gate"],
        ["codeflow", "Agentic PRD → PR workflow on Temporal"],
        ["Stack 2", "temporal-onprem-stack · mTLS · 2026"],
      ],
    },
    notes: [
      "**Beacon**: multi-tenant notifications in Go on Temporal. Sole author; **8.1k lines of tests**, a **90% coverage gate**.",
      "**Idempotent by construction**; retries **5 s × 2, max 3**; SMTP never **double-sends**.",
      "**Tenant-scoped DLQ replay**; hot-reloaded config that **fails closed**.",
      "**temporal-onprem-stack**: self-hosted Temporal behind **mTLS**, a self-renewing private CA, Cloudflare Tunnel, Tailscale.",
      "**codeflow**: my own agentic workflow on Temporal: PRD → **codegen, tests, PR**.",
      "**ebpf-http-scan**: HTTP capture with **cilium/ebpf**, fentry/fexit into a 256 KiB ring buffer.",
    ],
    titleCells: [drawn, { label: "Type", value: "Side projects" }, { label: "Scale", value: "NTS" }],
    height: "330vh",
    edge: "torn",
    bp: "40% 20%",
  },
  {
    id: "s10",
    no: "10",
    railLabel: "Issued for hire",
    title: "Issued for hire",
    rev: "H",
    eyebrow: "Sheet 10 / 10 · Transmittal · Issued for hire",
    schedule: {
      caption: "Schedule K — Issue",
      rows: [
        ["Open to", "Backend · Platform · Infra · SRE roles"],
        ["Degree", "MS Computer Science, Northeastern · May 2027"],
        ["Set", "Cover, nine sheets + appendices A–C"],
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
 * General data — the unpinned spec-summary band between the cover and sheet
 * 01: the headline numbers, counted up on arrival. `to` is the final value;
 * `from` where the count starts; `fmt` how a value is set (see GeneralData).
 */
export interface DataStat {
  k: string;
  label: string;
  /** Lettered before the counted number (e.g. "~"). */
  pre?: string;
  /** Lettered after the counted number (e.g. "+", "×"). */
  post?: string;
  from: number;
  to: number;
  fmt: "int" | "dec1" | "mttr";
  /** A second counted figure set after the first ("25+ / 9+"). */
  and?: { pre?: string; post?: string; from: number; to: number };
  unit: string;
  note: string;
  /** The sheet that draws it (rail/data-go target). */
  sheet: string;
}

export const GENERAL_DATA_ID = "gd";

export const generalData: DataStat[] = [
  { k: "G.01", label: "Fleet", from: 0, to: 9000, post: "+", fmt: "int", unit: "VMs", note: "a 2,000-testbed OpenStack fleet kept healthy by event-driven reconciliation", sheet: "s2" },
  { k: "G.02", label: "MTTR", pre: "5 h → ", from: 300, to: 10, fmt: "mttr", unit: "Mean time to recovery", note: "from five hours to ten minutes, then −85% more with snapshot-restore", sheet: "s2" },
  { k: "G.03", label: "DB reads", pre: "~", from: 1, to: 7, post: "×", fmt: "int", unit: "Fewer DB reads", note: "under polling from thousands of agents: rollout safety for 9,000+ VMs", sheet: "s3" },
  { k: "G.04", label: "Telemetry", from: 0, to: 90, post: " TB+", fmt: "int", unit: "OTA vehicle telemetry", note: "streamed into a central warehouse I pitched as an intern", sheet: "s1" },
  { k: "G.05", label: "Harness", from: 0, to: 25, post: "+", and: { pre: " / ", from: 0, to: 9, post: "+" }, fmt: "int", unit: "Features / engineers", note: "shipped through the agentic harness I built: 9 of 12 engineers", sheet: "s8" },
  { k: "G.06", label: "GPA", from: 4, to: 4, fmt: "dec1", unit: "MS CS · Northeastern", note: "4.0 / 4.0, graduating May 2027", sheet: "appx-b" },
];

/** The quieter second row of the general-data band. */
export const generalDataMore: { k: string; v: string; d: string; sheet: string }[] = [
  { k: "G.07", v: "16 PRs / 3 wks", d: "AI Identity, launched on the board's date", sheet: "s7" },
  { k: "G.08", v: "18 days", d: "Alert bell, PRD to production", sheet: "s6" },
  { k: "G.09", v: "1,500+", d: "Environments behind a permanent release gate", sheet: "s4" },
  { k: "G.10", v: "p95 −50%", d: "Hottest OTA endpoints, N+1 removed", sheet: "s1" },
];

/**
 * Appendices — reference sheets between sheet 09 and sheet 10. Same paper and
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
    eyebrow: "Appendix B · Education · Research · Publication · Certifications",
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

/** Sheet 02's fact cards (scrolled one at a time in the notes column). */
export const fleetFacts: { n: string; title: [string, string]; body: string }[] = [
  { n: "Fact 01 · The fleet", title: ["2,000 testbeds", "9,000+ VMs"], body: "One OpenStack fleet to keep healthy. Triage was a contractor, a Slack channel and a script that could fix 8 at a time." },
  { n: "Fact 02 · The system", title: ["Event-driven", "reconciliation"], body: "Python + Temporal. Offline events from the service account start triage in seconds; a semaphore tuned live through Consul replaced 8-at-a-time." },
  { n: "Fact 03 · The result", title: ["MTTR", "5 h → 10 min"], body: "Mean time to recovery across the fleet, from five hours to ten minutes." },
  { n: "Fact 04 · Then", title: ["Snapshot-restore", "−85% more"], body: "Go + Temporal snapshot-restore workflows replaced the Jenkins recovery path and cut what was left by a further 85%." },
  { n: "Fact 05 · Availability", title: ["Availability", "above 95%"], body: "200+ daily operations at 95%+ reliability. KubeVirt automation runs VM lifecycles on Kubernetes across 1,500+ test environments." },
];

export function sheetById(id: string): SheetMeta {
  const s = sheets.find((x) => x.id === id);
  if (!s) throw new Error(`unknown sheet ${id}`);
  return s;
}
