import type { JobAdapter, UnifiedJob } from "./types";
import {
  generateSlug, companyToColor, inferExperience, inferJobType,
  inferArrangement, inferCategory, extractTags, stripHtml,
} from "./types";

/**
 * JSearch (via RapidAPI) — Requires RapidAPI key.
 * https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
 */
export class JSearchAdapter implements JobAdapter {
  name = "JSearch";

  private apiKey = process.env.RAPIDAPI_KEY || "";

  isConfigured() {
    return !!this.apiKey;
  }

  async fetchJobs(params?: { query?: string; location?: string; page?: number }): Promise<UnifiedJob[]> {
    if (!this.isConfigured()) return [];

    try {
      const query = params?.query || "developer";
      const location = params?.location || "";
      const url = new URL("https://jsearch.p.rapidapi.com/search");
      url.searchParams.set("query", `${query} ${location}`.trim());
      url.searchParams.set("page", String(params?.page || 1));
      url.searchParams.set("num_pages", "1");

      const res = await fetch(url.toString(), {
        headers: {
          "X-RapidAPI-Key": this.apiKey,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) throw new Error(`JSearch returned ${res.status}`);

      const data = await res.json();
      const jobs = Array.isArray(data.data) ? data.data : [];

      return jobs.slice(0, 50).map((job: Record<string, unknown>): UnifiedJob => {
        const title = String(job.job_title || "");
        const company = String(job.employer_name || "Unknown");
        const description = stripHtml(String(job.job_description || ""));
        const city = String(job.job_city || "");
        const state = String(job.job_state || "");
        const country = String(job.job_country || "");
        const location = [city, state, country].filter(Boolean).join(", ");
        const tags = extractTags(title, description);
        const isRemote = Boolean(job.job_is_remote);
        const salaryMin = job.job_min_salary ? Number(job.job_min_salary) : undefined;
        const salaryMax = job.job_max_salary ? Number(job.job_max_salary) : undefined;
        const currency = String(job.job_salary_currency || "USD");
        const symbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
        const salary = salaryMin && salaryMax
          ? `${symbol}${salaryMin.toLocaleString()} - ${symbol}${salaryMax.toLocaleString()}/yr`
          : "";

        return {
          id: `jsearch-${job.job_id || crypto.randomUUID()}`,
          title,
          slug: generateSlug(title, company),
          company,
          companyColor: companyToColor(company),
          companyLogo: job.employer_logo ? String(job.employer_logo) : undefined,
          location: location || (isRemote ? "Remote" : "Not specified"),
          type: inferJobType(String(job.job_employment_type || "")),
          salary,
          salaryMin,
          salaryMax,
          arrangement: isRemote ? "REMOTE" : inferArrangement(location, description),
          experience: inferExperience(title, description),
          tags,
          description,
          requirements: [],
          benefits: [],
          source: "JSearch",
          sourceId: String(job.job_id || ""),
          applyUrl: String(job.job_apply_link || ""),
          featured: false,
          postedAt: job.job_posted_at_datetime_utc ? String(job.job_posted_at_datetime_utc) : new Date().toISOString(),
          category: inferCategory(title, tags),
        };
      });
    } catch (error) {
      console.error("[JSearch] Fetch error:", error);
      return [];
    }
  }
}
