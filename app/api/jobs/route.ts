import { NextResponse } from "next/server";
import { fetchAllJobs, getCachedJobs } from "@/lib/jobs/aggregator";
import type { UnifiedJob } from "@/lib/jobs/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const type = searchParams.get("type") || "";
  const experience = searchParams.get("experience") || "";
  const arrangement = searchParams.get("arrangement") || "";
  const source = searchParams.get("source") || "";
  const sort = searchParams.get("sort") || "relevance";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const forceRefresh = searchParams.get("refresh") === "true";

  // Get jobs — use aggregator for fresh data, cache for fast loads
  let result;
  if (forceRefresh || q || location) {
    result = await fetchAllJobs({ query: q, location, forceRefresh });
  } else {
    const cached = getCachedJobs();
    result = {
      jobs: cached,
      sources: [],
      cached: true,
      totalBeforeDedup: cached.length,
    };
  }

  let jobs = [...result.jobs];

  // Apply additional filters
  if (type) {
    const types = type.split(",");
    jobs = jobs.filter((j) => types.includes(j.type));
  }
  if (experience) {
    const levels = experience.split(",");
    jobs = jobs.filter((j) => levels.includes(j.experience));
  }
  if (arrangement) {
    const arr = arrangement.split(",");
    jobs = jobs.filter((j) => arr.includes(j.arrangement));
  }
  if (source) {
    const sources = source.split(",");
    jobs = jobs.filter((j) => sources.includes(j.source));
  }

  // Sort
  if (sort === "newest") {
    jobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  } else if (sort === "salary-high") {
    jobs.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
  } else if (sort === "salary-low") {
    jobs.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
  }
  // "relevance" keeps the existing order

  // Paginate
  const total = jobs.length;
  const start = (page - 1) * limit;
  const paginatedJobs = jobs.slice(start, start + limit);

  return NextResponse.json({
    jobs: paginatedJobs,
    total,
    page,
    pages: Math.ceil(total / limit),
    sources: result.sources,
    cached: result.cached,
  });
}
