import { Profile } from "@/types";

export const profile: Profile = {
  name: "Kushal Krishnappa",
  role: "Backend & platform engineer",
  tagline: "building invisible infrastructure for visible impact",
  email: "kushalkrishnappa333@gmail.com",
  availability: "Open to backend / platform / infra / SRE roles",
  nowLine: "MS CS @ Northeastern · open to full-time May 2027",
  before: ["RoonCyber", "Pure Storage", "Mercedes-Benz"],
  chips: ["Go", "Python", "Kubernetes", "Temporal", "AWS", "PostgreSQL"],
  about: {
    intro:
      "Backend & platform engineer working on distributed systems, multi-tenant isolation, and reliability at scale — Go, Python, Kubernetes, Temporal, AWS. Pursuing an MS in CS at Northeastern (4.0 GPA), graduating May 2027.",
    built: [
      {
        org: "RoonCyber.AI (Software Engineer, Co-op)",
        detail:
          "Built the in-app AI-security alert bell end to end (the most-requested feature in platform demos), took over AI Identity two weeks before a board-requested launch and shipped on schedule, designed multi-tenant M2M API auth on Postgres RLS (reused for the MCP server), and built an agentic dev harness used by 9+ of 12 engineers.",
      },
      {
        org: "Pure Storage / Everpure (Member of Technical Staff 2)",
        detail:
          "Built event-driven reconciliation on Temporal that drove MTTR from 5 hours to 10 minutes across a 2,000-testbed / 9,000+-VM OpenStack fleet, then −85% more via snapshot-restore; the disruption manager that keeps rollouts from taking a whole group down; and the Ubuntu 14 → 22 release gate (VP-recognized).",
      },
      {
        org: "Mercedes-Benz R&D India (Intern → Software Engineer)",
        detail:
          "Pitched and built a central data warehouse: real-time ingestion into Azure Event Hubs plus PySpark/Delta Lake ETL over 90TB+ of OTA telemetry; cut p95 by 50% on the hottest OTA endpoints.",
      },
    ],
    closing:
      "What I care about: orchestration, reliability, and systems that hold up under real load.",
  },
  quickInfo: [
    { label: "EDUCATION", value: "MS CS @ Northeastern · May 2027" },
    { label: "LOCATION", value: "Boston, MA" },
    { label: "EXPERIENCE", value: "3 years in Software Engineering" },
  ],
  socials: [
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/kushalkrishnappa",
      handle: "linkedin.com/in/kushalkrishnappa",
      icon: "linkedin",
    },
    {
      name: "GitHub",
      url: "https://github.com/kushalkrishnappa",
      handle: "github.com/kushalkrishnappa",
      icon: "github",
    },
  ],
};
