import { SystemCaseStudy } from "@/types";

export const systems: SystemCaseStudy[] = [
  {
    slug: "alert-bell",
    name: "Alert-bell notification platform",
    org: "RoonCyber",
    period: "2026",
    role: "Sole designer & builder",
    summary:
      "A multi-tenant notification platform for an AI-security product — the detectors, delivery, and settings behind the in-app alert bell. The most-requested feature in platform demos.",
    problem:
      "The platform generated a flood of security findings but had no reliable way to tell each tenant's users what newly mattered — without missing escalations or double-notifying across restarts and failures.",
    approach: [
      "Three per-tenant detectors: new High/Critical findings, AI-identity risk escalation, and Shadow-AI first-observation.",
      "A REST API and bell UI with per-user notification settings.",
      "Idempotent per-tenant watermarks raised atomically so nothing is notified twice.",
      "Emission caps that defer notifications rather than drop them, plus a cold-start baseline so the first run doesn't alert on history.",
      "Dedup and escalation state kept in a dedicated tracker rather than the feed.",
      "Panic recovery so a single failing detector can't take down SQS ingestion.",
    ],
    highlights: [
      "Verified with mutation testing, real-role row-level-security (RLS) tests, and the race detector.",
      "Per-tenant isolation enforced end to end, from detection through delivery.",
    ],
    stack: ["Go", "AWS SQS", "PostgreSQL (RLS)", "multi-tenant"],
    outcome:
      "Shipped as the platform's notification layer and the most-requested feature in demos.",
    status: "shipped",
  },
  {
    slug: "auto-sim-rehab",
    name: "Auto Sim Rehab reconciliation service",
    org: "Pure Storage / Everpure",
    period: "2023–2024",
    role: "Lead engineer",
    summary:
      "An event-driven reconciliation service that drives failed hardware-simulation testbeds back to a known-good state, cutting recovery from hours to minutes across a 9,000+-VM fleet.",
    problem:
      "A 2,000-testbed / 9,000+-VM OpenStack simulation fleet drifted into broken states constantly, and manual recovery took around five hours per incident while blocking the teams that depended on it.",
    approach: [
      "An event-driven reconciliation loop (Python, Temporal) that detects failed testbeds and drives them back to a known-good state.",
      "A distributed Temporal semaphore, live-tunable via Consul, to bound concurrent recoveries against the fleet.",
      "Reconciliation scoped to service-account events so an operator taking a testbed offline is never clobbered by automation.",
      "Snapshot-restore workflows (Go, Temporal) to recover a further share of testbeds automatically.",
    ],
    highlights: [
      "MTTR cut from ~5 hours to ~10 minutes.",
      "Operated across a 2,000-testbed / 9,000+-VM OpenStack fleet.",
    ],
    stack: ["Python", "Go", "Temporal", "Consul", "OpenStack"],
    outcome:
      "Reduced simulator recovery time from ~5 hours to ~10 minutes across the fleet.",
    status: "shipped",
  },
  {
    slug: "ai-identity",
    name: "AI-identity pipeline, under deadline",
    org: "RoonCyber",
    period: "2026",
    role: "Took over ownership",
    summary:
      "An ownership story: inheriting the AI-identity (non-human identity) pipeline two weeks before a board-requested launch and shipping it on schedule.",
    problem:
      "The engineer who owned the AI-identity (non-human identity) detection pipeline left two weeks before a board-requested launch, leaving the feature at risk of slipping.",
    approach: [
      "Picked up an unfamiliar, in-flight pipeline and got productive in it fast.",
      "Shipped 16 PRs in 3 weeks to close the remaining gaps.",
      "Drove the feature to a launch-ready state against a fixed external deadline.",
    ],
    highlights: [
      "Launched on schedule despite the mid-flight ownership change.",
      "16 PRs merged in 3 weeks.",
    ],
    stack: ["Go", "multi-tenant", "AWS"],
    outcome: "Launched on the board-requested date.",
    status: "shipped",
  },
];
