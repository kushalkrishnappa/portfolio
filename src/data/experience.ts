import { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    period: "Jan 2026 – Jun 2026",
    company: "RoonCyber",
    role: "Software Engineer — Internship",
    location: "Boston, MA",
    achievements: [
      "Built API key auth for a multi-tenant CNAPP platform — designed key issuance with tenant isolation and implemented validation middleware with in-process caching across 10+ endpoints, enabling M2M integrations for enterprise customers.",
      "Enhanced an eBPF-based sensor for HTTP header/payload inspection, increasing application-layer visibility by 30%.",
    ],
  },
  {
    period: "Jan 2023 – Dec 2024",
    company: "Pure Storage",
    role: "Member of Technical Staff 2",
    location: "Bengaluru, India",
    achievements: [
      "Led end-to-end SDLC of Auto Sim Recovery, architecting microservices-based distributed systems with Flask, RabbitMQ, Redis, Postgres, Temporal & Nomad — cutting simulator recovery from 5 hours to 10 minutes across 2,000+ test environments.",
      "Handled 200+ daily operations at ≥95% reliability.",
      "Built the Deployment Orchestrator Service for one-click updates across 9,000+ on-prem VMs, using real-time VM state and concurrency limits to prevent cascading failures and keep global availability ≥90%.",
      "Migrated VM infra from Ubuntu 14 to 22 across 1,500+ environments at 100% compatibility; built an automated Packer/Jenkins/Dominator workflow for future OS updates.",
    ],
  },
  {
    period: "Aug 2022 – Jan 2023",
    company: "Mercedes-Benz Research & Development India",
    role: "Graduate Engineer Trainee — Over-the-Air (OTA) Updates",
    location: "Bengaluru, India",
    achievements: [
      "Built scalable ETL pipelines for OTA updates using PySpark on Databricks with a Delta Lake architecture, processing 90TB+ of historical and ongoing data for downstream analytics.",
      "Extended the OTA campaign microservice with a generic interface streaming data directly to Azure EventHubs, enabling real-time availability and eliminating post-campaign DB queries.",
      "Provided 24/7 on-call support; identified two high-latency endpoints and drove their resolution.",
    ],
  },
  {
    period: "Mar 2022 – Aug 2022",
    company: "Mercedes-Benz Research & Development India",
    role: "Software Intern — Over-the-Air (OTA) Updates",
    location: "Bengaluru, India",
    achievements: [
      "Built an OTA updates analytics dashboard with Java Spring Boot, Swagger Codegen, Vue.js and MongoDB aggregation pipelines, surfacing key metrics and vehicle update insights.",
      "Automated deployment and scaling via Azure DevOps CI/CD and Kubernetes, with OAuth2.0 for secure authentication.",
    ],
  },
];
