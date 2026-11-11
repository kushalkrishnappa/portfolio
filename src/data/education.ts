import { Education } from "@/types";

export const education: Education[] = [
  {
    school: "Northeastern University",
    degree: "M.S. Computer Science",
    period: "Jan 2025 – May 2027",
    gpa: "4.0/4.0",
    coursework: [
      "Computer Systems",
      "Agentic AI",
      "Algorithms",
      "Programming Design Paradigms",
      "Database Management Systems",
      "Web Development",
      "Foundations of AI",
    ],
    projects: [
      "Multithreaded key-value server in C, with a concurrency stress test that catches torn writes",
      "Agentic RAG over SEC 10-K filings: recall@5 0.67 → 1.00",
      "Calendar app on an AVL-balanced interval tree, 368 tests plus mutation testing",
    ],
  },
  {
    school: "PES University",
    degree: "B.Tech Computer Science & Engineering",
    period: "Aug 2018 – Jun 2022",
    coursework: ["Machine Learning", "Network & Information Security", "Big Data", "Operating Systems"],
    honors: "Specialization in Machine Intelligence & Data Science",
    research: [
      "Undergraduate research at C-ISFCR (Center for Information Security, Forensics and Cyber Resilience); the capstone was published at IEEE CONECCT 2022",
      "Two-month 5G edge project with Niral Networks on Magma, the open-source LTE/5G packet core: access gateways as edge nodes on commodity Linux",
    ],
  },
];
