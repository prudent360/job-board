import type { JobAdapter, UnifiedJob } from "./types";
import {
  generateSlug, companyToColor, inferExperience,
  inferArrangement, inferCategory, extractTags, stripHtml,
} from "./types";

/**
 * USAJobs — Requires Authorization Key + User-Agent email.
 * https://developer.usajobs.gov/
 */
export class USAJobsAdapter implements JobAdapter {
  name = "USAJobs";

  private authKey = process.env.USAJOBS_API_KEY || "";
  private userAgent = process.env.USAJOBS_EMAIL || "";

  isConfigured() {
    return !!(this.authKey && this.userAgent);
  }

  async fetchJobs(params?: { query?: string; location?: string; page?: number }): Promise<UnifiedJob[]> {
    if (!this.isConfigured()) return [];

    try {
      const url = new URL("https://data.usajobs.gov/api/Search");
      if (params?.query) url.searchParams.set("Keyword", params.query);
      if (params?.location) url.searchParams.set("LocationName", params.location);
      url.searchParams.set("ResultsPerPage", "50");
      const page = params?.page || 1;
      url.searchParams.set("Page", String(page));

      const res = await fetch(url.toString(), {
        headers: {
          "Authorization-Key": this.authKey,
          "User-Agent": this.userAgent,
          Host: "data.usajobs.gov",
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) throw new Error(`USAJobs returned ${res.status}`);

      const data = await res.json();
      const results = data?.SearchResult?.SearchResultItems || [];

      return results.map((item: Record<string, unknown>): UnifiedJob => {
        const match = item.MatchedObjectDescriptor as Record<string, unknown>;
        const title = String(match?.PositionTitle || "");
        const company = String(match?.OrganizationName || match?.DepartmentName || "US Government");
        const userArea = match?.UserArea as Record<string, unknown> | undefined;
        const details = userArea?.Details as Record<string, unknown> | undefined;
        const description = stripHtml(String(match?.QualificationSummary || details?.MajorDuties || ""));
        const locations = Array.isArray(match?.PositionLocation) ? match.PositionLocation : [];
        const locObj = locations[0] as Record<string, unknown> | undefined;
        const location = locObj ? String(locObj.LocationName || "") : "";
        const tags = extractTags(title, description);

        const remuneration = Array.isArray(match?.PositionRemuneration)
          ? match.PositionRemuneration[0] as Record<string, unknown> | undefined
          : undefined;
        const salaryMin = remuneration?.MinimumRange ? Number(remuneration.MinimumRange) : undefined;
        const salaryMax = remuneration?.MaximumRange ? Number(remuneration.MaximumRange) : undefined;
        const salary = salaryMin && salaryMax
          ? `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()}/yr`
          : "";

        return {
          id: `usajobs-${match?.PositionID || crypto.randomUUID()}`,
          title,
          slug: generateSlug(title, company),
          company,
          companyColor: "#0A66C2",
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
          benefits: ["Federal benefits package", "Retirement plan", "Health insurance"],
          source: "USAJobs",
          sourceId: String(match?.PositionID || ""),
          applyUrl: String((Array.isArray(match?.ApplyURI) ? match.ApplyURI[0] : null) || match?.PositionURI || ""),
          featured: false,
          postedAt: match?.PublicationStartDate ? String(match.PublicationStartDate) : new Date().toISOString(),
          category: inferCategory(title, tags),
        };
      });
    } catch (error) {
      console.error("[USAJobs] Fetch error:", error);
      return [];
    }
  }
}
