import { Profile } from "@/types";

export const profile: Profile = {
  name: "Kushal Krishnappa",
  tagline: "building invisible infrastructure for visible impact",
  availability: "Open to backend / platform / infra / SRE roles",
  nowLine: "Research Assistant @ Northeastern · open for full-time May 2027",
  chips: [
    "Go",
    "Kubernetes",
    "Temporal",
    "AWS",
    "multi-tenant",
    "distributed systems",
  ],
  about: {
    intro:
      "Backend & platform engineer working on distributed systems, multi-tenant isolation, and reliability at scale — Go, Python, Kubernetes, Temporal, AWS. Pursuing an MS in CS at Northeastern (4.0 GPA), graduating May 2027.",
    built: [
      {
        org: "RoonCyber (Software Engineer, Co-op)",
        detail:
          "Built a multi-tenant AI-security notification platform — per-tenant detectors, idempotent watermarks, and API/auth plumbing — plus posture and runtime-analysis plumbing across a CNAPP.",
      },
      {
        org: "Pure Storage / Everpure (Member of Technical Staff 2)",
        detail:
          "Built event-driven reconciliation and rollout-safety services on Temporal that drove MTTR from 5 hours to 10 minutes across a 2,000-testbed / 9,000+-VM OpenStack fleet.",
      },
      {
        org: "Mercedes-Benz R&D India (Software Engineer)",
        detail:
          "Pitched and built a central data warehouse: multi-source ingestion into Azure Event Hubs plus PySpark/Delta Lake ETL over 90TB+ of OTA telemetry.",
      },
    ],
    closing:
      "What I care about: orchestration, reliability, and systems that hold up under real load. I'm currently a Research Assistant in Northeastern's Systems Research Group, working on relational debugging for Kubernetes control-plane performance bugs.",
  },
  quickInfo: [
    { label: "CURRENT ROLE", value: "Research Assistant @ Northeastern" },
    { label: "LOCATION", value: "Boston, MA" },
    { label: "EXPERIENCE", value: "2.5+ years in Software Engineering" },
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
