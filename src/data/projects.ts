import { Project } from "@/types";

export const projects: Project[] = [
  {
    name: "DSA Panicle",
    description: "Online platform for algorithmic challenges",
    tech: ["Docusaurus", "RST", "GitHub Actions", "CI/CD"],
    features: [
      "Curated algorithmic challenges",
      "CI/CD via GitHub runners",
      "Hostinger webhook deploys",
    ],
    impact: "Accessible, continuously-deployed practice platform",
  },
  {
    name: "Virtual Calendar",
    description: "Full-stack virtual calendar application in Java",
    tech: ["Java", "Swing GUI", "MVC Architecture"],
    features: [
      "Multi-calendar support",
      "Event conflict detection (Interval Trees)",
      "Timezone management",
      "Google Calendar import/export",
    ],
    impact: "Streamlined event management with timezone-aware scheduling",
  },
  {
    name: "Yet Another Centralized Scheduler",
    description: "Centralized scheduling framework similar to Hadoop YARN",
    tech: ["Python", "Multithreading", "Distributed Systems"],
    features: [
      "Controller-worker architecture",
      "Multiple scheduling algorithms",
      "Cluster coordination",
    ],
    impact: "Efficient distributed resource allocation across cluster nodes",
  },
  {
    name: "SEED Labs: Security Projects",
    description: "Cybersecurity attacks and defenses implementation",
    tech: ["C", "Python", "Linux"],
    features: [
      "Buffer overflow",
      "SQL injection",
      "XSS / CSRF",
      "Sniffing, spoofing & local DNS attacks",
    ],
    impact: "Comprehensive security vulnerability analysis and mitigation",
  },
];
