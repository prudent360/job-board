import type { JobAdapter, UnifiedJob } from "./types";
import {
  generateSlug, companyToColor, inferExperience, inferJobType,
  inferArrangement, inferCategory, extractTags, stripHtml,
} from "./types";

/**
 * Arbeitnow — Free, no API key required.
 * https://www.arbeitnow.com/api/job-board-api
 */
export class ArbeitnowAdapter implements JobAdapter {
  name = "Arbeitnow";

  isConfigured() {
    return true; // No API key needed
  }

  async fetchJobs(params?: { query?: string; page?: number }): Promise<UnifiedJob[]> {
    try {
      const url = new URL("https://www.arbeitnow.com/api/job-board-api");
      if (params?.page) url.searchParams.set("page", String(params.page));

      const res = await fetch(url.toString(), {
        headers: { "Accept": "application/json" },
        next: { revalidate: 3600 },
      });

      if (!res.ok) throw new Error(`Arbeitnow returned ${res.status}`);

      const data = await res.json();
      const jobs = Array.isArray(data.data) ? data.data : [];

      return jobs.slice(0, 50).map((job: Record<string, unknown>): UnifiedJob => {
        const title = String(job.title || "");
        const company = String(job.company_name || "Unknown");
        const description = stripHtml(String(job.description || ""));
        const location = String(job.location || "");
        const remote = Boolean(job.remote);
        const tags = Array.isArray(job.tags) ? job.tags.map(String).slice(0, 8) : extractTags(title, description);

        return {
          id: `arbeitnow-${job.slug || crypto.randomUUID()}`,
          title,
          slug: generateSlug(title, company),
          company,
          companyColor: companyToColor(company),
          location: location || (remote ? "Remote" : "Not specified"),
          type: inferJobType(title + " " + description),
          salary: "",
          arrangement: remote ? "REMOTE" : inferArrangement(location, description),
          experience: inferExperience(title, description),
          tags,
          description,
          requirements: [],
          benefits: [],
          source: "Arbeitnow",
          sourceId: String(job.slug || ""),
          applyUrl: String(job.url || ""),
          featured: false,
          postedAt: job.created_at ? String(job.created_at) : new Date().toISOString(),
          category: inferCategory(title, tags),
        };
      });
    } catch (error) {
      console.error("[Arbeitnow] Fetch error:", error);
      return [];
    }
  }
}
