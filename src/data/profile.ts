import { Profile } from "@/types";

export const profile: Profile = {
  name: "Kushal Krishnappa",
  tagline: "building invisible infrastructure for visible impact",
  availability: "Open to backend / platform / infrastructure SWE roles",
  about: {
    intro:
      "Backend software engineer building distributed systems and platform infrastructure — Go, Python, Kubernetes, AWS. Currently pursuing my MS in CS at Northeastern (4.0 GPA), graduating Dec 2026.",
    built: [
      {
        org: "RoonCyber (SWE Intern)",
        detail:
          "Shipped Go backend services for a CNAPP platform and extended eBPF-based runtime threat-detection pipelines.",
      },
      {
        org: "Pure Storage (Member of Technical Staff 2)",
        detail:
          "Designed backend systems for physical host allocation and VM lifecycle management; cross-team work on deployment workflows at infrastructure scale.",
      },
      {
        org: "Mercedes-Benz R&D (SWE)",
        detail:
          "Built ETL pipelines on PySpark/Databricks for OTA update analytics and extended the OTA microservice for real-time downstream analytics.",
      },
    ],
    closing:
      "What I care about: orchestration, reliability and systems that hold up under real load. Lately I'm working under Prof. Xiang Ren at System Research Group on low level observability.",
  },
  quickInfo: [
    { label: "CURRENT ROLE", value: "MSCS Grad @ Northeastern" },
    { label: "LOCATION", value: "Boston, MA" },
    { label: "EXPERIENCE", value: "2+ years in Software Engineering" },
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
