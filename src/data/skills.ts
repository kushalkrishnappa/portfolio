import { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  { label: "Languages", skills: ["Go", "Python", "Rust", "Java", "TypeScript", "SQL", "C", "C++"] },
  { label: "Backend", skills: ["gRPC", "Protocol Buffers", "REST / OpenAPI", "Spring Boot", "Flask", "Multi-tenancy", "Concurrency"] },
  { label: "Orchestration", skills: ["Temporal", "Kubernetes", "Docker", "Nomad", "KubeVirt"] },
  { label: "Data & messaging", skills: ["PostgreSQL", "Redis", "MongoDB", "Neo4j", "TimescaleDB", "RabbitMQ", "SQS / SNS", "Azure Event Hubs", "PySpark", "Delta Lake"] },
  { label: "Cloud platforms", skills: ["AWS", "AWS Lambda", "API Gateway", "Azure", "Azure Policy", "GCP"] },
  { label: "Infrastructure", skills: ["Linux", "OpenStack", "Terraform", "Packer", "Ansible", "Dominator", "Consul", "nginx", "Tailscale", "Cloudflare Tunnel"] },
  { label: "Security", skills: ["Postgres RLS", "mTLS / PKI", "OAuth 2.0", "eBPF (cilium/ebpf)", "Infisical", "Vault"] },
  { label: "AI & agents", skills: ["Claude Code", "MCP", "Agentic workflows", "LangGraph", "Pinecone", "vLLM"] },
  { label: "Observability", skills: ["OpenTelemetry", "Prometheus", "Grafana", "Datadog"] },
  { label: "Testing", skills: ["Mutation testing", "Property-based tests", "testcontainers", "Playwright", "pytest", "Race detector"] },
  { label: "CI/CD", skills: ["GitHub Actions", "Jenkins", "Azure DevOps"] },
  { label: "Frontend", skills: ["React", "TanStack Query", "Vue.js"] },
];
