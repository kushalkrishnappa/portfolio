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
  role: string;
  tagline: string;
  /** Public résumé contact email — rendered as the Contact section's CTA. */
  email: string;
  availability: string;
  nowLine: string;
  /** Prior employers, most recent first — rendered in the hero's BEFORE line. */
  before: string[];
  chips: string[];
  about: About;
  quickInfo: QuickInfo[];
  socials: Social[];
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
  honors?: string;
  coursework: string[];
}

export interface Publication {
  title: string;
  venue: string;
  year: string;
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
