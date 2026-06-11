import type { JobAdapter, UnifiedJob } from "./types";
import {
  generateSlug, companyToColor, inferExperience,
  inferArrangement, inferCategory, extractTags, stripHtml,
} from "./types";

/**
 * Adzuna — Requires APP_ID + APP_KEY.
 * https://developer.adzuna.com/
 */
export class AdzunaAdapter implements JobAdapter {
  name = "Adzuna";

  private appId = process.env.ADZUNA_APP_ID || "";
  private appKey = process.env.ADZUNA_APP_KEY || "";

  isConfigured() {
    return !!(this.appId && this.appKey);
  }

  async fetchJobs(params?: { query?: string; location?: string; page?: number }): Promise<UnifiedJob[]> {
    if (!this.isConfigured()) return [];

    try {
      const country = "gb"; // Default to UK
      const page = params?.page || 1;
      const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`);
      url.searchParams.set("app_id", this.appId);
      url.searchParams.set("app_key", this.appKey);
      url.searchParams.set("results_per_page", "50");
      url.searchParams.set("content-type", "application/json");
      if (params?.query) url.searchParams.set("what", params.query);
      if (params?.location) url.searchParams.set("where", params.location);

      const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
      if (!res.ok) throw new Error(`Adzuna returned ${res.status}`);

      const data = await res.json();
      const jobs = Array.isArray(data.results) ? data.results : [];

      return jobs.map((job: Record<string, unknown>): UnifiedJob => {
        const title = String(job.title || "");
        const company = String((job.company as Record<string, unknown>)?.display_name || "Unknown");
        const description = stripHtml(String(job.description || ""));
        const location = String((job.location as Record<string, unknown>)?.display_name || "");
        const tags = extractTags(title, description);
        const salaryMin = job.salary_min ? Number(job.salary_min) : undefined;
        const salaryMax = job.salary_max ? Number(job.salary_max) : undefined;
        const salary = salaryMin && salaryMax
          ? `£${salaryMin.toLocaleString()} - £${salaryMax.toLocaleString()}/yr`
          : salaryMin ? `£${salaryMin.toLocaleString()}/yr` : "";

        return {
          id: `adzuna-${job.id || crypto.randomUUID()}`,
          title,
          slug: generateSlug(title, company),
          company,
          companyColor: companyToColor(company),
          location,
          type: "FULL_TIME",
          salary,
          salaryMin,
          salaryMax,
          arrangement: inferArrangement(location, description),
          experience: inferExperience(title, description),
          tags,
          description,
          requirements: [],
          benefits: [],
          source: "Adzuna",
          sourceId: String(job.id || ""),
          applyUrl: String(job.redirect_url || ""),
          featured: false,
          postedAt: job.created ? String(job.created) : new Date().toISOString(),
          category: inferCategory(title, tags),
        };
      });
    } catch (error) {
      console.error("[Adzuna] Fetch error:", error);
      return [];
    }
  }
}
