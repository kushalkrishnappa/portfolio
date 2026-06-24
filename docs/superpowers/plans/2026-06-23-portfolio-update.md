# Portfolio Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sync the portfolio with the resume/LinkedIn, add Education/Publications/Certifications + a 4th project, add an MDX-backed Blog (`/blog` + `/blog/[slug]` with a "Working on it" empty state), and refactor to a best-practices structure (typed centralized data, componentized sections, server/client split, no dead code).

**Architecture:** Content lives in typed modules under `src/data/` (single source of truth) described by interfaces in `src/types/index.ts`. The home page (`src/app/page.tsx`) becomes a server component composing small section components under `src/app/components/sections/`; the only client island is the (currently disabled) contact form. Blog posts are `.mdx` files in `content/blog/`, read at build time by `src/lib/blog.ts` and rendered with `next-mdx-remote/rsc`.

**Tech Stack:** Next.js 15.4.6 (App Router), React 19, TypeScript (strict, `@/*`→`src/*` alias), Tailwind CSS v4, `gray-matter`, `next-mdx-remote`, Vitest.

**Conventions:**
- Run all commands from the project root `/Users/kushalkrishnappa/Playground/portfolio`.
- Work happens on the existing `feature_v2` branch (already checked out).
- The pre-existing uncommitted changes (`public/files/KushalKrishnappa.pdf`, `src/app/experience/page.tsx`, `src/app/page.tsx`) are the user's; do not stage them. Each task's commit stages only the files it lists.

---

## Task 1: Dependencies & Vitest setup

**Files:**
- Modify: `package.json` (scripts only; deps added via npm)
- Create: `vitest.config.ts`

- [ ] **Step 1: Install runtime + dev dependencies**

Run:
```bash
npm install gray-matter next-mdx-remote
npm install -D vitest
```
Expected: installs succeed; `package.json` gains `gray-matter` + `next-mdx-remote` under `dependencies` and `vitest` under `devDependencies`.

- [ ] **Step 2: Add the `test` script**

In `package.json`, add a `test` script to the existing `scripts` block so it reads:
```json
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
```

- [ ] **Step 3: Create the Vitest config (with the `@/` alias)**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    environment: "node",
  },
});
```

- [ ] **Step 4: Verify the test runner starts (no tests yet)**

Run: `npm test`
Expected: Vitest runs and reports "No test files found" (exit code may be non-zero; that is fine — it confirms Vitest is wired up). Proceed.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add gray-matter, next-mdx-remote, and vitest"
```

---

## Task 2: Shared types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Create the interfaces**

Create `src/types/index.ts`:
```ts
export interface QuickInfo {
  label: string;
  value: string;
}

export interface Social {
  name: string;
  url: string;
  handle: string;
  icon: "linkedin" | "github";
}

export interface Profile {
  name: string;
  tagline: string;
  availability: string;
  about: string[];
  quickInfo: QuickInfo[];
  socials: Social[];
}

export interface ImpactMetric {
  value: string;
  label: string;
}

export interface Experience {
  period: string;
  company: string;
  role: string;
  location: string;
  achievements: string[];
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  features: string[];
  impact: string;
}

export interface SkillGroup {
  label: string;
  skills: string[];
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  gpa?: string;
  coursework: string[];
}

export interface Publication {
  title: string;
  venue: string;
  description: string;
  url?: string;
}

export interface Certification {
  name: string;
  featured?: boolean;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingTime: string;
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add shared content type definitions"
```

---

## Task 3: Blog library (TDD)

**Files:**
- Create: `src/lib/blog.ts`
- Test: `src/lib/blog.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/blog.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

let dir: string;

function writePost(
  name: string,
  frontmatter: Record<string, unknown>,
  body = "Body text here.",
) {
  const fm = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n");
  fs.writeFileSync(path.join(dir, name), `---\n${fm}\n---\n${body}\n`);
}

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "blog-"));
  process.env.BLOG_CONTENT_DIR = dir;
});

afterEach(() => {
  delete process.env.BLOG_CONTENT_DIR;
  fs.rmSync(dir, { recursive: true, force: true });
});

describe("getAllPosts", () => {
  it("returns [] when no posts exist", () => {
    expect(getAllPosts()).toEqual([]);
  });

  it("returns [] when the directory is absent", () => {
    process.env.BLOG_CONTENT_DIR = path.join(dir, "does-not-exist");
    expect(getAllPosts()).toEqual([]);
  });

  it("excludes unpublished posts", () => {
    writePost("draft.mdx", { title: "Draft", date: "2026-01-01", published: false });
    writePost("live.mdx", { title: "Live", date: "2026-01-02", published: true });
    const posts = getAllPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe("live");
  });

  it("sorts published posts by date descending", () => {
    writePost("old.mdx", { title: "Old", date: "2026-01-01", published: true });
    writePost("new.mdx", { title: "New", date: "2026-05-01", published: true });
    expect(getAllPosts().map((p) => p.slug)).toEqual(["new", "old"]);
  });

  it("derives tags and reading time", () => {
    writePost(
      "p.mdx",
      { title: "P", date: "2026-01-01", tags: ["a", "b"], published: true },
      "word ".repeat(400),
    );
    const [post] = getAllPosts();
    expect(post.tags).toEqual(["a", "b"]);
    expect(post.readingTime).toBe("2 min read");
  });
});

describe("getPostBySlug", () => {
  it("returns meta + content for a published slug", () => {
    writePost("hello.mdx", { title: "Hello", date: "2026-01-01", published: true }, "Hello world body");
    const post = getPostBySlug("hello");
    expect(post?.meta.title).toBe("Hello");
    expect(post?.content).toContain("Hello world body");
  });

  it("returns null for an unknown slug", () => {
    expect(getPostBySlug("missing")).toBeNull();
  });

  it("returns null for an unpublished slug", () => {
    writePost("draft.mdx", { title: "Draft", date: "2026-01-01", published: false });
    expect(getPostBySlug("draft")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `getAllPosts`/`getPostBySlug` cannot be imported (module `@/lib/blog` does not exist).

- [ ] **Step 3: Implement the blog library**

Create `src/lib/blog.ts`:
```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPostMeta } from "@/types";

function blogDir(): string {
  return process.env.BLOG_CONTENT_DIR || path.join(process.cwd(), "content", "blog");
}

function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function postFiles(): string[] {
  const dir = blogDir();
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
}

function toMeta(slug: string, data: Record<string, unknown>, content: string): BlogPostMeta {
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    summary: String(data.summary ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingTime: readingTime(content),
  };
}

export function getAllPosts(): BlogPostMeta[] {
  return postFiles()
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(blogDir(), file), "utf8");
      const { data, content } = matter(raw);
      return { slug, data, content };
    })
    .filter((p) => p.data.published === true)
    .map((p) => toMeta(p.slug, p.data, p.content))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): { meta: BlogPostMeta; content: string } | null {
  const file = path.join(blogDir(), `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  if (data.published !== true) return null;
  return { meta: toMeta(slug, data, content), content };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — all 8 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/blog.ts src/lib/blog.test.ts
git commit -m "feat: add blog content library with tests"
```

---

## Task 4: Data modules

**Files:**
- Create: `src/data/profile.ts`, `src/data/impact.ts`, `src/data/experience.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/data/education.ts`, `src/data/publications.ts`, `src/data/certifications.ts`

- [ ] **Step 1: Create `src/data/profile.ts`**

```ts
import { Profile } from "@/types";

export const profile: Profile = {
  name: "Kushal Krishnappa",
  tagline: "I '3 computers in any shape or form.",
  availability: "Available: Winter / Spring / Summer 2026",
  about: [
    "Production Engineer with experience in building and scaling systems across enterprise environments. Currently pursuing a Master's in Computer Science at Northeastern while bringing hands-on experience from managing critical infrastructure at Pure Storage and Mercedes-Benz.",
    "Specialized in automation, system reliability, and large-scale deployments. Successfully reduced simulator recovery times from hours to minutes and managed 9,000+ production VMs with 99% automation. Passionate about solving complex infrastructure challenges, ML applications in DevSecOps, and building invisible infrastructure.",
  ],
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
```

- [ ] **Step 2: Create `src/data/impact.ts`**

```ts
import { ImpactMetric } from "@/types";

export const impactMetrics: ImpactMetric[] = [
  { value: "5hr → 10min", label: "SIMULATOR RECOVERY TIME" },
  { value: "9,000+", label: "VMS MANAGED" },
  { value: "90%+", label: "AUTOMATION RATE" },
];
```

- [ ] **Step 3: Create `src/data/experience.ts`**

```ts
import { Experience } from "@/types";

export const experiences: Experience[] = [
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
```

- [ ] **Step 4: Create `src/data/projects.ts`**

```ts
import { Project } from "@/types";

export const projects: Project[] = [
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
```

- [ ] **Step 5: Create `src/data/skills.ts`**

```ts
import { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  { label: "Languages", skills: ["Go", "Python", "Java", "C/C++", "TypeScript", "R"] },
  { label: "Frameworks", skills: ["Flask", "Django", "Spring Boot", "Next.js", "React", "LangChain"] },
  { label: "Backend", skills: ["PostgreSQL", "MongoDB", "Redis", "RabbitMQ", "Azure EventHubs", "Async I/O", "Concurrency"] },
  { label: "Infra", skills: ["Docker", "Nomad", "Temporal", "Databricks", "Linux", "OpenStack", "Prometheus", "Azure"] },
  { label: "Developer Tools", skills: ["Git", "GitHub Actions", "Jenkins", "Packer", "Ansible", "CI/CD", "PyTest", "JUnit", "Claude Code"] },
];
```

- [ ] **Step 6: Create `src/data/education.ts`**

```ts
import { Education } from "@/types";

export const education: Education[] = [
  {
    school: "Northeastern University",
    degree: "M.S. Computer Science",
    period: "Jan 2025 – Present",
    gpa: "4.0/4.0",
    coursework: ["Programming Design Paradigms", "Algorithms"],
  },
  {
    school: "PES University",
    degree: "B.Tech Computer Science & Engineering",
    period: "Aug 2018 – Jun 2022",
    coursework: ["Machine Learning", "Network & Information Security", "Big Data", "Operating Systems"],
  },
];
```

- [ ] **Step 7: Create `src/data/publications.ts`**

```ts
import { Publication } from "@/types";

export const publications: Publication[] = [
  {
    title: "An Enhanced Deployment of 5G Network Using Multi-Objective Genetic Algorithm",
    venue: "Published in IEEE",
    description:
      "A genetic algorithm to optimize dense 5G base-station deployment — minimizing cost while maximizing coverage and efficiency.",
    url: "",
  },
];
```

- [ ] **Step 8: Create `src/data/certifications.ts`**

```ts
import { Certification } from "@/types";

export const certifications: Certification[] = [
  { name: "Terraform Associate (004)", featured: true },
  { name: "AWS Fundamentals: Specialization" },
  { name: "Web Application Security Testing with OWASP ZAP" },
  { name: "Object Oriented Programming — Advanced (Java OOP)" },
  { name: "Foundations of Responsible AI Learning" },
];
```

- [ ] **Step 9: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 10: Commit**

```bash
git add src/data
git commit -m "feat: add centralized typed content data modules"
```

---

## Task 5: SectionHeader component

**Files:**
- Create: `src/app/components/SectionHeader.tsx`

- [ ] **Step 1: Create the component**

```tsx
export default function SectionHeader({ command }: { command: string }) {
  return (
    <div className="text-green-400 mb-4">
      <span className="text-green-500">$</span> {command}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/SectionHeader.tsx
git commit -m "feat: add reusable SectionHeader component"
```

---

## Task 6: Existing-content section components

**Files:**
- Create: `src/app/components/sections/Whoami.tsx`, `ImpactMetrics.tsx`, `Experience.tsx`, `Projects.tsx`, `Skills.tsx`

- [ ] **Step 1: Create `src/app/components/sections/Whoami.tsx`**

```tsx
import { profile } from "@/data/profile";
import SectionHeader from "@/app/components/SectionHeader";

export default function Whoami() {
  return (
    <section id="home" className="mb-16 sm:mb-20">
      <div className="mb-8">
        <SectionHeader command="whoami" />
        <div className="pl-4 border-l-2 border-gray-700">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {profile.name}
          </h1>
          <p className="text-xl sm:text-2xl text-cyan-400 mb-2">{profile.tagline}</p>
          <p className="text-sm text-green-400 mb-6">{profile.availability}</p>
          <div className="space-y-3 text-sm sm:text-base leading-relaxed">
            {profile.about.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm mb-8">
        {profile.quickInfo.map((info) => (
          <div key={info.label} className="bg-gray-900 border border-gray-700 p-4 rounded">
            <div className="text-gray-500 mb-1">{info.label}</div>
            <div className="text-white">{info.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/app/components/sections/ImpactMetrics.tsx`**

```tsx
import { impactMetrics } from "@/data/impact";
import SectionHeader from "@/app/components/SectionHeader";

export default function ImpactMetrics() {
  return (
    <section id="impact" className="mb-16 sm:mb-20">
      <SectionHeader command="./impact_metrics.sh" />
      <div className="pl-4 border-l-2 border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {impactMetrics.map((metric) => (
            <div key={metric.label} className="bg-gray-900 border border-gray-800 p-5 rounded">
              <div className="text-2xl font-bold text-green-400 mb-2">{metric.value}</div>
              <div className="text-xs text-gray-400">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `src/app/components/sections/Experience.tsx`**

```tsx
import { experiences } from "@/data/experience";
import SectionHeader from "@/app/components/SectionHeader";

export default function Experience() {
  return (
    <section id="experience" className="mb-16 sm:mb-20">
      <SectionHeader command="cat experience.log" />
      <div className="pl-4 border-l-2 border-gray-700 space-y-6">
        {experiences.map((exp) => (
          <div
            key={`${exp.company}-${exp.period}`}
            className="bg-gray-900 border border-gray-800 p-6 rounded hover:border-gray-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
              <h3 className="text-lg sm:text-xl font-bold text-white">{exp.company}</h3>
              <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">{exp.period}</span>
            </div>
            <p className="text-cyan-400 mb-1 text-sm sm:text-base">{exp.role}</p>
            <p className="text-xs text-gray-500 mb-4">{exp.location}</p>
            <div className="space-y-2">
              {exp.achievements.map((achievement, idx) => (
                <div key={idx} className="flex items-start text-sm">
                  <span className="text-green-500 mr-2 mt-1">▸</span>
                  <span className="text-gray-300">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `src/app/components/sections/Projects.tsx`**

```tsx
import { projects } from "@/data/projects";
import SectionHeader from "@/app/components/SectionHeader";

export default function Projects() {
  return (
    <section id="projects" className="mb-16 sm:mb-20">
      <SectionHeader command="ls -la ~/projects" />
      <div className="pl-4 border-l-2 border-gray-700 space-y-8">
        {projects.map((project) => (
          <div
            key={project.name}
            className="bg-gray-900 border border-gray-800 p-6 rounded hover:border-gray-700 transition-colors"
          >
            <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
            <p className="text-gray-400 mb-4">{project.description}</p>

            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">TECH STACK</div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="text-xs bg-gray-800 px-2 py-1 rounded text-cyan-400">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">KEY FEATURES</div>
              <ul className="space-y-1 text-sm">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <span className="text-green-500 mr-2">▸</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">IMPACT</div>
              <p className="text-sm text-gray-300">{project.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create `src/app/components/sections/Skills.tsx`**

```tsx
import { skillGroups } from "@/data/skills";
import SectionHeader from "@/app/components/SectionHeader";

export default function Skills() {
  return (
    <section id="skills" className="mb-16 sm:mb-20">
      <SectionHeader command="cat skills.txt" />
      <div className="pl-4 border-l-2 border-gray-700 space-y-5">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">{group.label}</div>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-gray-900 border border-gray-700 px-3 py-1 rounded text-sm text-cyan-400 hover:border-cyan-600 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/app/components/sections/Whoami.tsx src/app/components/sections/ImpactMetrics.tsx src/app/components/sections/Experience.tsx src/app/components/sections/Projects.tsx src/app/components/sections/Skills.tsx
git commit -m "feat: extract existing home sections into components"
```

---

## Task 7: Contact section (server wrapper + client form)

**Files:**
- Create: `src/app/components/sections/ContactForm.tsx` (client)
- Create: `src/app/components/sections/Contact.tsx` (server)

The form is intentionally **disabled** with the "Form Under Development" / Beacon notice — reproduce this behavior verbatim. `ContactForm` stays a client component so re-enabling later (once Beacon ships) is a one-line change.

- [ ] **Step 1: Create `src/app/components/sections/ContactForm.tsx`**

```tsx
'use client'
import React from "react";

export default function ContactForm() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Message sent successfully! I'll get back to you soon.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bound to inputs for when the form is re-enabled (inputs are disabled for now).
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  void isSubmitting;
  void submitStatus;
  void handleChange;

  return (
    <div>
      {/* Under Development Notice */}
      <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-600/50 rounded">
        <div className="flex items-start space-x-2">
          <span className="text-yellow-400 text-lg">⚠️</span>
          <div className="text-sm">
            <p className="text-yellow-400 font-semibold mb-2">Form Under Development</p>
            <p className="text-gray-300 mb-2">
              Currently building a notification service called{" "}
              <a
                href="https://github.com/kap-theorem/beacon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline font-semibold"
              >
                Beacon
              </a>
            </p>
            <p className="text-gray-400 text-xs">
              In the meantime, feel free to reach out via LinkedIn or GitHub!
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 opacity-60 pointer-events-none">
        <div>
          <label className="block text-xs text-gray-500 mb-2">NAME</label>
          <input
            type="text"
            name="name"
            value="Working on it..."
            disabled
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-gray-500 text-sm cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-2">EMAIL</label>
          <input
            type="email"
            name="email"
            value="notification@beacon.dev"
            disabled
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-gray-500 text-sm cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-2">MESSAGE</label>
          <textarea
            name="message"
            value="Building Beacon - a notification service to power sms, email, and push notifications. Check out the progress on GitHub!"
            disabled
            rows={4}
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-gray-500 text-sm cursor-not-allowed resize-none"
          />
        </div>

        <button
          type="button"
          disabled
          className="w-full bg-gray-700 text-gray-500 font-semibold py-3 px-6 rounded text-sm cursor-not-allowed"
        >
          COMING SOON
        </button>
      </form>
    </div>
  );
}
```

Note: the `value=...` props on disabled inputs match the original exactly. The `void` statements prevent unused-variable lint noise while the form is disabled; remove them (and wire `value={formData.x}` / `onChange={handleChange}`) when re-enabling.

- [ ] **Step 2: Create `src/app/components/sections/Contact.tsx`**

```tsx
import { profile } from "@/data/profile";
import SectionHeader from "@/app/components/SectionHeader";
import ContactForm from "@/app/components/sections/ContactForm";

const ICON_PATHS: Record<string, string> = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  github:
    "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
};

export default function Contact() {
  return (
    <section id="contact" className="mb-8">
      <SectionHeader command="contact --send-message" />
      <div className="pl-4 border-l-2 border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="text-xs text-gray-500 mb-2">LOCATION</div>
              <div className="text-white">Boston, MA</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-3">SOCIAL LINKS</div>
              <div className="space-y-3">
                {profile.socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-cyan-400 hover:text-cyan-300 transition-colors group"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d={ICON_PATHS[social.icon]} />
                    </svg>
                    <span className="text-sm group-hover:underline">{social.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no type errors; lint clean (no errors).

- [ ] **Step 4: Commit**

```bash
git add src/app/components/sections/ContactForm.tsx src/app/components/sections/Contact.tsx
git commit -m "feat: extract contact section with isolated client form"
```

---

## Task 8: New section components

**Files:**
- Create: `src/app/components/sections/Education.tsx`, `Publications.tsx`, `Certifications.tsx`

- [ ] **Step 1: Create `src/app/components/sections/Education.tsx`**

```tsx
import { education } from "@/data/education";
import SectionHeader from "@/app/components/SectionHeader";

export default function Education() {
  return (
    <section id="education" className="mb-16 sm:mb-20">
      <SectionHeader command="cat education.md" />
      <div className="pl-4 border-l-2 border-gray-700 space-y-4">
        {education.map((edu) => (
          <div key={edu.school} className="bg-gray-900 border border-gray-800 p-6 rounded">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
              <h3 className="text-lg sm:text-xl font-bold text-white">{edu.school}</h3>
              <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">{edu.period}</span>
            </div>
            <p className="text-cyan-400 text-sm sm:text-base">
              {edu.degree}
              {edu.gpa && (
                <span className="text-gray-400">
                  {" "}· GPA <span className="text-green-400">{edu.gpa}</span>
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-2">Coursework: {edu.coursework.join(", ")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/app/components/sections/Publications.tsx`**

```tsx
import { publications } from "@/data/publications";
import SectionHeader from "@/app/components/SectionHeader";

export default function Publications() {
  return (
    <section id="publications" className="mb-16 sm:mb-20">
      <SectionHeader command="cat publications.bib" />
      <div className="pl-4 border-l-2 border-gray-700 space-y-4">
        {publications.map((pub) => (
          <div key={pub.title} className="bg-gray-900 border border-gray-800 p-6 rounded">
            <h3 className="text-base sm:text-lg font-bold text-white">{pub.title}</h3>
            <p className="text-amber-400 text-xs sm:text-sm my-1">{pub.venue}</p>
            <p className="text-sm text-gray-300">{pub.description}</p>
            {pub.url && (
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-cyan-400 hover:text-cyan-300"
              >
                ▸ Read paper →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `src/app/components/sections/Certifications.tsx`**

```tsx
import { certifications } from "@/data/certifications";
import SectionHeader from "@/app/components/SectionHeader";

export default function Certifications() {
  return (
    <section id="certifications" className="mb-16 sm:mb-20">
      <SectionHeader command="ls ~/certifications" />
      <div className="pl-4 border-l-2 border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="bg-gray-900 border border-gray-800 p-3 rounded text-sm flex items-start"
            >
              <span className={`mr-2 ${cert.featured ? "text-purple-400" : "text-green-500"}`}>▸</span>
              <span className="text-gray-300">{cert.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/sections/Education.tsx src/app/components/sections/Publications.tsx src/app/components/sections/Certifications.tsx
git commit -m "feat: add education, publications, and certifications sections"
```

---

## Task 9: Compose the home page + scroll behavior

**Files:**
- Modify: `src/app/page.tsx` (full rewrite)
- Modify: `src/app/globals.css` (add smooth scroll + section scroll offset)

- [ ] **Step 1: Rewrite `src/app/page.tsx` as a server component**

Replace the entire contents of `src/app/page.tsx` with:
```tsx
import Whoami from "@/app/components/sections/Whoami";
import ImpactMetrics from "@/app/components/sections/ImpactMetrics";
import Experience from "@/app/components/sections/Experience";
import Projects from "@/app/components/sections/Projects";
import Skills from "@/app/components/sections/Skills";
import Education from "@/app/components/sections/Education";
import Publications from "@/app/components/sections/Publications";
import Certifications from "@/app/components/sections/Certifications";
import Contact from "@/app/components/sections/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pt-12 sm:pt-20 pb-16">
        <Whoami />
        <ImpactMetrics />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Publications />
        <Certifications />
        <Contact />

        <div className="text-center text-xs text-gray-600 border-t border-gray-800 pt-8">
          <p>© 2026 Kushal Krishnappa. Built with Next.js &amp; Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add smooth scroll + nav offset to `src/app/globals.css`**

Append to the end of `src/app/globals.css`:
```css
html {
  scroll-behavior: smooth;
}

section[id] {
  scroll-margin-top: 6rem;
}
```

- [ ] **Step 3: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no type errors; lint clean.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/globals.css
git commit -m "refactor: compose home page from section components"
```

---

## Task 10: Navigation update

**Files:**
- Modify: `src/app/components/Navigation.tsx` (full rewrite)

Section links become anchor `<Link>`s to `/#id` (work from any route, including `/blog`); a new `blog` link points to `/blog`. The marquee logo and resume download are preserved.

- [ ] **Step 1: Rewrite `src/app/components/Navigation.tsx`**

Replace the entire contents with:
```tsx
'use client'
import Link from "next/link";

const NAV_LINKS = [
  { label: "whoami", href: "/#home" },
  { label: "experience", href: "/#experience" },
  { label: "projects", href: "/#projects" },
  { label: "skills", href: "/#skills" },
  { label: "blog", href: "/blog" },
  { label: "contact", href: "/#contact" },
];

export default function Navigation() {
  const downloadResume = () => {
    const link = document.createElement("a");
    link.href = "/files/KushalKrishnappa.pdf";
    link.download = "KushalKrishnappa.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <nav className="bg-black border-b border-gray-800 p-3 sm:p-4 font-mono fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-2 sm:px-4 max-w-5xl flex justify-between items-center">
        <div className="flex-shrink-0 flex items-center">
          <Link href="/">
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-green-400 flex items-center">
              <span className="text-green-500">$</span>
              <span className="ml-2 inline-block w-[200px] sm:w-[280px] md:w-[350px] overflow-hidden relative">
                <span className="inline-block whitespace-nowrap animate-slideLeft">
                  ./kushalkrishnappa -bold -brilliant -breaking_barriers&nbsp;&nbsp;&nbsp;&nbsp;./kushalkrishnappa -bold -brilliant -breaking_barriers&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </span>
            </h1>
          </Link>
        </div>
        <div className="hidden sm:flex space-x-4 md:space-x-6 text-xs md:text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={downloadResume}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            resume
          </button>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no type errors; lint clean.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/Navigation.tsx
git commit -m "feat: add blog link and anchor-based section nav"
```

---

## Task 11: Blog listing page

**Files:**
- Create: `src/app/blog/page.tsx`

- [ ] **Step 1: Create `src/app/blog/page.tsx`**

```tsx
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import SectionHeader from "@/app/components/SectionHeader";

export const metadata: Metadata = {
  title: "Blog — Kushal Krishnappa",
  description: "Writing on distributed systems, infrastructure automation, and security.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pt-12 sm:pt-20 pb-16">
        <SectionHeader command="ls ~/blog" />
        <div className="pl-4 border-l-2 border-gray-700">
          {posts.length === 0 ? (
            <div className="bg-gray-900 border border-dashed border-yellow-600/60 rounded-lg p-8 text-center">
              <p className="text-yellow-400 text-base mb-2">⚠ Working on it…</p>
              <p className="text-gray-500 text-sm">
                Writing my first posts on distributed systems, infrastructure automation, and
                security. Check back soon.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-baseline">
                    <h2 className="text-white font-bold">{post.title}</h2>
                    <span className="text-gray-500 text-xs">{post.date}</span>
                  </div>
                  <p className="text-gray-400 text-sm my-2">{post.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs border border-gray-700 rounded px-2 py-0.5 text-cyan-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no type errors; lint clean.

- [ ] **Step 3: Verify the empty state builds and renders**

Run: `npm run build`
Expected: build succeeds; `/blog` appears in the route list.

- [ ] **Step 4: Commit**

```bash
git add src/app/blog/page.tsx
git commit -m "feat: add blog listing page with empty-state placeholder"
```

---

## Task 12: Blog post page + MDX components + authoring guide

**Files:**
- Create: `src/app/components/mdx-components.tsx`
- Create: `src/app/blog/[slug]/page.tsx`
- Create: `content/blog/README.md`

- [ ] **Step 1: Create `src/app/components/mdx-components.tsx`**

```tsx
import React from "react";

export const mdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1 className="text-2xl font-bold text-white mt-8 mb-3" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="text-xl font-bold text-white mt-8 mb-3" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="text-lg font-bold text-white mt-6 mb-2" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="text-gray-300 leading-relaxed mb-4" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a className="text-cyan-400 hover:text-cyan-300 underline" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="list-disc list-inside space-y-1 mb-4 text-gray-300" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-300" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => <li className="text-gray-300" {...props} />,
  code: (props: React.ComponentProps<"code">) => (
    <code className="bg-gray-800 text-cyan-300 px-1.5 py-0.5 rounded text-sm" {...props} />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto text-sm my-4"
      {...props}
    />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote className="border-l-2 border-gray-700 pl-4 text-gray-400 italic my-4" {...props} />
  ),
};
```

- [ ] **Step 2: Create `src/app/blog/[slug]/page.tsx`**

```tsx
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { mdxComponents } from "@/app/components/mdx-components";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.meta.title} — Kushal Krishnappa`,
    description: post.meta.summary,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { meta, content } = post;

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl pt-12 sm:pt-20 pb-16">
        <Link href="/blog" className="text-cyan-400 text-sm hover:text-cyan-300">
          ← cd ~/blog
        </Link>
        <article className="pl-4 border-l-2 border-gray-700 mt-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{meta.title}</h1>
          <div className="text-gray-500 text-xs mb-2">
            {meta.date} · {meta.readingTime}
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs border border-gray-700 rounded px-2 py-0.5 text-cyan-400"
              >
                {tag}
              </span>
            ))}
          </div>
          <MDXRemote source={content} components={mdxComponents} />
        </article>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `content/blog/README.md` (authoring guide)**

```markdown
# Blog posts

Add a post by creating an `.mdx` file in this directory. The filename becomes the
URL slug (`my-first-post.mdx` → `/blog/my-first-post`).

Each post needs frontmatter at the top:

\`\`\`mdx
---
title: "My first post"
date: "2026-07-01"        # ISO date — used for sorting and display
summary: "One-line teaser shown on the /blog listing."
tags: ["distributed-systems", "temporal"]
published: true            # set false (or omit) to keep it hidden
---

Write your post body here in Markdown/MDX. Headings, lists, links, and
\`code\` / fenced code blocks are all styled automatically.
\`\`\`

Posts with `published: false` (or no `published` field) are hidden from the
listing and return 404 at their URL. When there are zero published posts, the
`/blog` page shows the "Working on it" placeholder.
```

- [ ] **Step 4: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no type errors; lint clean.

- [ ] **Step 5: Manually verify a real post renders, then revert**

Create a temporary `content/blog/hello-world.mdx`:
```mdx
---
title: "Hello, World"
date: "2026-06-23"
summary: "First test post."
tags: ["meta"]
published: true
---

## It works

This is a **test** post with a code block:

\`\`\`bash
echo "hello"
\`\`\`
```
Run: `npm run build`
Expected: build succeeds and the route list shows `/blog/hello-world` as a
prerendered page. (Optionally run `npm run dev` and visit `/blog` to see the card
and `/blog/hello-world` to see the rendered post.)
Then delete the temp file so the empty-state placeholder ships:
```bash
rm content/blog/hello-world.mdx
```

- [ ] **Step 6: Commit**

```bash
git add src/app/components/mdx-components.tsx "src/app/blog/[slug]/page.tsx" content/blog/README.md
git commit -m "feat: add MDX blog post pages and authoring guide"
```

---

## Task 13: Remove dead routes & final verification

**Files:**
- Delete: `src/app/experience/page.tsx`, `src/app/projects/page.tsx`

Note: `src/app/experience/page.tsx` currently has uncommitted working-tree changes. Removing the file as part of this committed change is intended (the route is a stale duplicate of home-page data).

- [ ] **Step 1: Delete the orphaned routes**

```bash
git rm -f src/app/experience/page.tsx src/app/projects/page.tsx
rmdir src/app/experience src/app/projects 2>/dev/null || true
```

- [ ] **Step 2: Confirm nothing imports the deleted routes**

Run: `grep -rn "app/experience\|app/projects" src` 
Expected: no matches (the section components live under `components/sections`, not these routes).

- [ ] **Step 3: Full verification suite**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected:
- `npm test` — all blog tests pass.
- `npx tsc --noEmit` — no errors.
- `npm run lint` — no errors.
- `npm run build` — succeeds; route list includes `/`, `/blog`, `/blog/[slug]`,
  `/api/contact`; does NOT include `/experience` or `/projects`.

- [ ] **Step 4: Commit**

```bash
git add -A src/app
git commit -m "refactor: remove orphaned experience and projects routes"
```

- [ ] **Step 5: Manual smoke test (optional but recommended)**

Run: `npm run dev`, then in a browser:
- `/` — whoami shows availability line; experience shows corrected titles/dates;
  projects include DSA Panicle; skills show 5 groups; Education, Publications, and
  Certifications (Terraform first) render; contact form shows the disabled Beacon notice.
- Nav `blog` → `/blog` shows "Working on it"; nav `experience` from `/blog`
  returns to `/` and scrolls to the experience section below the fixed nav.
Stop the dev server when done.

---

## Self-Review Notes (for the implementer)

- **Spec coverage:** every spec section maps to a task — content corrections (T4),
  Education/Publications/Certifications (T8), DSA Panicle (T4), grouped skills (T4),
  availability (T4), blog lib + empty state (T3, T11), blog pages (T11, T12),
  componentization + server/client split (T5–T10), dead-route removal (T13),
  testing (T1, T3) and verification (T13).
- **Type consistency:** data modules in T4 conform to the interfaces in T2;
  `getAllPosts`/`getPostBySlug` signatures in T3 are consumed unchanged in T11/T12;
  `Social.icon` values (`linkedin`/`github`) match the `ICON_PATHS` keys in T7.
- **Risk:** if `next-mdx-remote/rsc` has a version conflict with Next 15 / React 19,
  pin a known-good `next-mdx-remote` release or fall back to `@next/mdx`; the blog
  data layer and empty-state (the shipping behavior) are independent of the renderer.
