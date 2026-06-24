import { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  { label: "Languages", skills: ["Go", "Python", "Java", "C++", "TypeScript"] },
  { label: "OS", skills: ["Linux", "MacOS", "Windows"] },
  { label: "Cloud Platforms", skills: ["AWS", "Azure", "GCP"] },
  { label: "Databases", skills: ["PostgreSQL", "MongoDB", "Redis"] },
  { label: "Container Orchestration", skills: ["Kubernetes", "Docker", "Nomad"] },
  { label: "Infrastructure", skills: [ "OpenStack", "Terraform", "Packer", "Ansible", "Dominator"] },
  { label: "AI/LLM Infrastructure", skills: ["MCP", "Claude Code", "Temporal"] },
  { label: "Observability", skills: ["OpenTelemetry", "Prometheus", "Grafana"] },
  { label: "CI/CD & GitOps", skills: ["GitHub Actions", "Jenkins"] },
  { label: "Security/Secrets", skills: ["Vault", "Infisical"] },
];