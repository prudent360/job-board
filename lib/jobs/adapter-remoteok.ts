import type { JobAdapter, UnifiedJob } from "./types";
import {
  generateSlug, companyToColor, inferExperience,
  inferArrangement, inferCategory, extractTags, stripHtml,
} from "./types";

/**
 * RemoteOK — Free, no API key required.
 * https://remoteok.com/api
 */
export class RemoteOKAdapter implements JobAdapter {
  name = "RemoteOK";

  isConfigured() {
    return true; // No API key needed
  }

  async fetchJobs(): Promise<UnifiedJob[]> {
    try {
      const res = await fetch("https://remoteok.com/api", {
        headers: { "User-Agent": "JobNest/1.0" },
        next: { revalidate: 3600 },
      });

      if (!res.ok) throw new Error(`RemoteOK returned ${res.status}`);

      const raw = await res.json();
      // First item is metadata, skip it
      const jobs = Array.isArray(raw) ? raw.slice(1) : [];

      return jobs.slice(0, 50).map((job: Record<string, unknown>): UnifiedJob => {
        const title = String(job.position || "");
        const company = String(job.company || "Unknown");
        const description = stripHtml(String(job.description || ""));
        const tags = Array.isArray(job.tags) ? job.tags.map(String).slice(0, 8) : extractTags(title, description);
        const location = String(job.location || "Remote");
        const salary = job.salary_min && job.salary_max
          ? `$${Number(job.salary_min).toLocaleString()} - $${Number(job.salary_max).toLocaleString()}/yr`
          : "";

        return {
          id: `remoteok-${job.id || crypto.randomUUID()}`,
          title,
          slug: generateSlug(title, company),
          company,
          companyColor: companyToColor(company),
          companyLogo: job.company_logo ? String(job.company_logo) : undefined,
          location: location || "Remote",
          type: "FULL_TIME",
          salary,
          salaryMin: job.salary_min ? Number(job.salary_min) : undefined,
          salaryMax: job.salary_max ? Number(job.salary_max) : undefined,
          arrangement: "REMOTE",
          experience: inferExperience(title, description),
          tags,
          description,
          requirements: [],
          benefits: [],
          source: "RemoteOK",
          sourceId: String(job.id || ""),
          applyUrl: String(job.url || `https://remoteok.com/l/${job.slug || ""}`),
          featured: false,
          postedAt: job.date ? String(job.date) : new Date().toISOString(),
          category: inferCategory(title, tags),
        };
      });
    } catch (error) {
      console.error("[RemoteOK] Fetch error:", error);
      return [];
    }
  }
}
