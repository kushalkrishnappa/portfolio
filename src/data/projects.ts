import { Project } from "@/types";

export const projects: Project[] = [
  {
    name: "Beacon",
    description: "A notification service in Go, built on Temporal.",
    tech: ["Go", "Temporal", "PostgreSQL"],
    features: [
      "Hashed bk_ API keys with token-bucket rate limiting and quotas",
      "Idempotency via workflow-ID reject-duplicate",
      "Dead-letter queue with replay",
      "Hot-reload, fail-closed config",
      "SMTP client delivery (SendGrid / Mailgun / SES)",
    ],
    impact: "Reliable, idempotent notification delivery with a 90% coverage gate.",
    role: "sole author",
    year: "2025",
    links: [{ label: "GitHub", url: "https://github.com/kap-theorem/beacon" }],
  },
  {
    name: "temporal-onprem-stack",
    description:
      "A self-hosted Temporal deployment secured end to end, with a blog write-up on deploying Temporal with mTLS.",
    tech: ["Temporal", "nginx", "mTLS", "Infisical", "Tailscale", "Cloudflare"],
    features: [
      "nginx mTLS in front of Temporal",
      "Private certificate authority via Infisical",
      "Tailscale mesh networking",
      "Cloudflare Tunnel ingress",
    ],
    impact: "A reproducible, secured on-prem Temporal stack.",
    role: "sole author",
    year: "2025",
    links: [
      {
        label: "Blog: Deploying Temporal with mTLS",
        url: "https://kushalkrishnappa.com/blogs",
      },
    ],
  },
  {
    name: "ebpf-http-scan",
    description:
      "An early eBPF tool that captures HTTP traffic from the kernel — a small version of the runtime analysis work done at RoonCyber.",
    tech: ["Go", "cilium/ebpf", "CO-RE"],
    features: [
      "tcp_recvmsg capture via eBPF CO-RE",
      "HTTP request/response reconstruction",
    ],
    impact: "A hands-on exploration of kernel-level HTTP observability.",
    role: "sole author",
    year: "2026",
  },
  {
    name: "dsapanicle.com",
    description:
      "A continuously-deployed platform of algorithmic-practice content and tooling.",
    tech: ["Docusaurus", "RST", "GitHub Actions", "CI/CD"],
    features: [
      "Curated algorithmic challenges",
      "CI/CD via GitHub runners",
      "Webhook-driven deploys",
    ],
    impact: "An accessible, continuously-deployed practice platform.",
    role: "contributor",
  },
];
