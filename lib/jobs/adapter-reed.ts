import type { JobAdapter, UnifiedJob } from "./types";
import {
  generateSlug, companyToColor, inferExperience,
  inferArrangement, inferCategory, extractTags, stripHtml,
} from "./types";

/**
 * Reed — Requires API key (Basic Auth).
 * https://www.reed.co.uk/developers/jobseeker
 */
export class ReedAdapter implements JobAdapter {
  name = "Reed";

  private apiKey = process.env.REED_API_KEY || "";

  isConfigured() {
    return !!this.apiKey;
  }

  async fetchJobs(params?: { query?: string; location?: string; page?: number }): Promise<UnifiedJob[]> {
    if (!this.isConfigured()) return [];

    try {
      const url = new URL("https://www.reed.co.uk/api/1.0/search");
      if (params?.query) url.searchParams.set("keywords", params.query);
      if (params?.location) url.searchParams.set("locationName", params.location);
      url.searchParams.set("resultsToTake", "50");
      const skip = ((params?.page || 1) - 1) * 50;
      url.searchParams.set("resultsToSkip", String(skip));

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Basic ${Buffer.from(this.apiKey + ":").toString("base64")}`,
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) throw new Error(`Reed returned ${res.status}`);

      const data = await res.json();
      const jobs = Array.isArray(data.results) ? data.results : [];

      return jobs.map((job: Record<string, unknown>): UnifiedJob => {
        const title = String(job.jobTitle || "");
        const company = String(job.employerName || "Unknown");
        const description = stripHtml(String(job.jobDescription || ""));
        const location = String(job.locationName || "");
        const tags = extractTags(title, description);
        const salaryMin = job.minimumSalary ? Number(job.minimumSalary) : undefined;
        const salaryMax = job.maximumSalary ? Number(job.maximumSalary) : undefined;
        const salary = salaryMin && salaryMax
          ? `£${salaryMin.toLocaleString()} - £${salaryMax.toLocaleString()}/yr`
          : salaryMin ? `£${salaryMin.toLocaleString()}/yr` : "";

        return {
          id: `reed-${job.jobId || crypto.randomUUID()}`,
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
          source: "Reed",
          sourceId: String(job.jobId || ""),
          applyUrl: String(job.jobUrl || ""),
          featured: false,
          postedAt: job.date ? String(job.date) : new Date().toISOString(),
          category: inferCategory(title, tags),
        };
      });
    } catch (error) {
      console.error("[Reed] Fetch error:", error);
      return [];
    }
  }
}
