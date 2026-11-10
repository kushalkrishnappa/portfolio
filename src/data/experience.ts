import { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    period: "Jan 2026 – Aug 2026",
    company: "RoonCyber",
    role: "Software Engineer (Co-op)",
    location: "Boston, MA",
    summary:
      "VC-backed AI-security startup (CNAPP) with design partners. Owned backend services across the platform — notifications, AI-identity, multi-tenant API auth, cloud-posture, and runtime analysis.",
    tags: ["Go", "multi-tenant", "AWS", "RLS", "AI-SDLC"],
    achievements: [
      "Designed and shipped the platform's alert-bell notification system — three per-tenant detectors (new High/Critical findings, AI-identity risk escalation, Shadow-AI first-observation) behind a REST API and bell UI with per-user settings; idempotent per-tenant watermarks, emission caps that defer rather than drop, and panic recovery so one detector can't kill SQS ingestion. The most-requested feature in platform demos.",
      "Took over the AI-Identity (non-human identity) pipeline two weeks before a board-requested launch when the owner left; shipped 16 PRs in 3 weeks and launched on schedule.",
      "Built multi-tenant machine-to-machine API auth: SHA-256-hashed keys, a ristretto cache with TTL capped to token expiry, opaque 401s, token-derived tenant scoping, and an RLS read/write split — the auth layer plus the first four data endpoints. The design was later reused as the auth layer for the platform's MCP server.",
      "Added Azure posture detection: a Go Lambda collector that normalizes Azure Policy findings into the shared findings schema, so existing cross-cloud risk and blast-radius views covered Azure with no new endpoints.",
      "Extended the runtime (eBPF) analysis pipeline to emit a value-stripped, shape-preserving request/response that pinpoints the offending field, surfaced in the incident UI.",
      "Co-designed an agentic development harness — a staged PRD-to-merged-PR pipeline with human gates and drift / spec-fidelity validators — used daily by most of the engineering team to ship 25+ features over 4 months.",
    ],
  },
  {
    period: "Jan 2023 – Dec 2024",
    company: "Pure Storage / Everpure",
    role: "Member of Technical Staff 2",
    location: "Bengaluru, India",
    summary:
      "Built orchestration and reliability services for a 2,000-testbed / 9,000+-VM OpenStack simulation fleet.",
    tags: ["Temporal", "Go", "Python", "OpenStack", "reliability"],
    achievements: [
      "Built Auto Sim Rehab, an event-driven reconciliation service (Python, Temporal) that drove failed testbeds back to a known-good state, cutting MTTR from 5 hours to 10 minutes across the 2,000-testbed / 9,000+-VM fleet; used a distributed Temporal semaphore live-tunable via Consul and scoped to service-account events so operator offlines were never clobbered.",
      "Added snapshot-restore workflows (Go, Temporal) that recovered a further share of testbeds automatically.",
      "Built a rollout-safety (disruption-manager) service with per-group concurrency budgets in Consul, test-aware gating, a pluggable check / request / cancel interface, and canary-plus-fast-revert; cut database reads roughly 7x with a 100s-TTL Redis cache and negotiated backoff. A generic Go version was later open-sourced by the Dominator maintainer.",
      "Made an Ubuntu 14-to-22 dev-VM migration a permanent release gate: a Packer golden image, reconciled team workflows, and a pytest suite across 1,500+ environments; recognized by the VP.",
    ],
  },
  {
    period: "Mar 2022 – Dec 2022",
    company: "Mercedes-Benz Research & Development India",
    role: "Software Engineer (Intern → SWE), Over-the-Air Updates",
    location: "Bengaluru, India",
    summary:
      "Pitched a central data warehouse as an intern, then built it into the OTA analytics platform.",
    tags: ["Java", "Spring Boot", "PySpark", "Azure", "ETL"],
    achievements: [
      "Pitched and built a central data warehouse: multi-source ingestion (Java / Spring Boot) streaming into Azure Event Hubs behind a generic interface, with PySpark / Delta Lake ETL over 90TB+ of OTA telemetry for downstream analytics.",
      "Cut p95 latency ~50% on the hottest OTA endpoints by resolving an N+1 query pattern found while on-call.",
      "Built an OTA analytics dashboard (Spring Boot, Vue.js, MongoDB aggregation pipelines) with OAuth2, deployed via Azure DevOps CI/CD on Kubernetes.",
    ],
  },
];
