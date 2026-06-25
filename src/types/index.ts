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

export interface AboutHighlight {
  org: string;
  detail: string;
}

export interface About {
  intro: string;
  built: AboutHighlight[];
  closing: string;
}

export interface Profile {
  name: string;
  tagline: string;
  availability: string;
  about: About;
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
  url?: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  url: string;
  readingTime?: string;
}
