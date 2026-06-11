/**
 * Unified Job Type — the canonical shape all adapters normalize to.
 * This is what the frontend consumes.
 */
export type UnifiedJob = {
  id: string;
  title: string;
  slug: string;
  company: string;
  companyColor: string;
  companyLogo?: string;
  location: string;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE";
  salary: string;
  salaryMin?: number;
  salaryMax?: number;
  arrangement: "REMOTE" | "ONSITE" | "HYBRID";
  experience: "ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "LEAD" | "EXECUTIVE";
  tags: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  source: string;
  sourceId: string;
  applyUrl: string;
  featured: boolean;
  postedAt: string;
  category: string;
};

/**
 * Adapter interface — every job source must implement this.
 */
export interface JobAdapter {
  name: string;
  isConfigured(): boolean;
  fetchJobs(params?: { query?: string; location?: string; page?: number }): Promise<UnifiedJob[]>;
}

/**
 * Generate a deterministic slug from title + company
 */
export function generateSlug(title: string, company: string): string {
  return `${title}-${company}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/**
 * Generate a deterministic color from company name
 */
export function companyToColor(name: string): string {
  const colors = [
    "#635bff", "#000000", "#a259ff", "#ff7a59", "#5E6AD2",
    "#0666eb", "#1DB954", "#4285f4", "#e54d42", "#0A66C2",
    "#7c3aed", "#059669", "#ea580c", "#0891b2", "#be123c",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Infer experience level from title/description
 */
export function inferExperience(title: string, description: string = ""): UnifiedJob["experience"] {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("intern") || text.includes("internship")) return "ENTRY";
  if (text.includes("junior") || text.includes("jr.") || text.includes("entry level") || text.includes("entry-level")) return "JUNIOR";
  if (text.includes("lead") || text.includes("principal") || text.includes("staff")) return "LEAD";
  if (text.includes("senior") || text.includes("sr.") || text.includes("5+ years") || text.includes("7+ years")) return "SENIOR";
  if (text.includes("director") || text.includes("vp") || text.includes("head of") || text.includes("chief")) return "EXECUTIVE";
  return "MID";
}

/**
 * Infer job type from text
 */
export function inferJobType(text: string): UnifiedJob["type"] {
  const lower = text.toLowerCase();
  if (lower.includes("part-time") || lower.includes("part time")) return "PART_TIME";
  if (lower.includes("contract") || lower.includes("contractor") || lower.includes("freelance")) return "CONTRACT";
  if (lower.includes("intern")) return "INTERNSHIP";
  return "FULL_TIME";
}

/**
 * Infer arrangement from location/description
 */
export function inferArrangement(location: string, description: string = ""): UnifiedJob["arrangement"] {
  const text = `${location} ${description}`.toLowerCase();
  if (text.includes("remote") || text.includes("anywhere") || text.includes("worldwide") || text.includes("global")) return "REMOTE";
  if (text.includes("hybrid") || text.includes("flexible")) return "HYBRID";
  return "ONSITE";
}

/**
 * Infer category from tags/title
 */
export function inferCategory(title: string, tags: string[] = []): string {
  const text = `${title} ${tags.join(" ")}`.toLowerCase();
  if (text.includes("engineer") || text.includes("developer") || text.includes("devops") || text.includes("sre") || text.includes("backend") || text.includes("frontend") || text.includes("fullstack")) return "Engineering";
  if (text.includes("design") || text.includes("ux") || text.includes("ui")) return "Design";
  if (text.includes("product manager") || text.includes("product owner")) return "Product";
  if (text.includes("market") || text.includes("seo") || text.includes("content")) return "Marketing";
  if (text.includes("data") || text.includes("machine learning") || text.includes("ai") || text.includes("analyst")) return "Data & AI";
  if (text.includes("sales") || text.includes("account")) return "Sales";
  if (text.includes("finance") || text.includes("accounting")) return "Finance";
  return "General";
}

/**
 * Strip HTML tags from a string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}

/**
 * Extract tags from job description text
 */
export function extractTags(title: string, description: string = ""): string[] {
  const knownTags = [
    "React", "TypeScript", "JavaScript", "Python", "Java", "Go", "Rust", "Node.js",
    "Next.js", "Vue", "Angular", "AWS", "GCP", "Azure", "Docker", "Kubernetes",
    "Terraform", "SQL", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "REST",
    "Figma", "Sketch", "Design Systems", "Agile", "Scrum", "CI/CD",
    "Machine Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision",
    "Marketing", "SEO", "Google Ads", "Analytics", "Content Strategy",
    "Product Management", "User Research", "A/B Testing", "Jira",
    "Kotlin", "Swift", "Flutter", "React Native", "iOS", "Android",
    "Ruby", "Rails", "Django", "FastAPI", "Spring", "Laravel", "PHP",
    "C++", "C#", ".NET", "Scala", "Elixir", "Haskell",
  ];

  const text = `${title} ${description}`;
  return knownTags.filter((tag) => text.toLowerCase().includes(tag.toLowerCase())).slice(0, 8);
}
