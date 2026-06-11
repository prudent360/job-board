import type { UnifiedJob, JobAdapter } from "./types";
import { RemoteOKAdapter } from "./adapter-remoteok";
import { ArbeitnowAdapter } from "./adapter-arbeitnow";
import { AdzunaAdapter } from "./adapter-adzuna";
import { ReedAdapter } from "./adapter-reed";
import { JSearchAdapter } from "./adapter-jsearch";
import { USAJobsAdapter } from "./adapter-usajobs";
import { seedJobs } from "@/data/seed-jobs";

/* ------------------------------------------------------------------ */
/*  In-memory cache (replaced by Redis/DB in production)               */
/* ------------------------------------------------------------------ */

let jobCache: UnifiedJob[] = [];
let lastFetchTime = 0;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/* ------------------------------------------------------------------ */
/*  All registered adapters                                            */
/* ------------------------------------------------------------------ */

const adapters: JobAdapter[] = [
  new RemoteOKAdapter(),
  new ArbeitnowAdapter(),
  new AdzunaAdapter(),
  new ReedAdapter(),
  new JSearchAdapter(),
  new USAJobsAdapter(),
];

/**
 * Get the status of all adapters
 */
export function getAdapterStatus() {
  return adapters.map((a) => ({
    name: a.name,
    configured: a.isConfigured(),
  }));
}

/**
 * Deduplicate jobs by title + company (normalized)
 */
function deduplicateJobs(jobs: UnifiedJob[]): UnifiedJob[] {
  const seen = new Map<string, UnifiedJob>();

  for (const job of jobs) {
    const key = `${job.title.toLowerCase().trim()}|${job.company.toLowerCase().trim()}`;
    if (!seen.has(key)) {
      seen.set(key, job);
    }
  }

  return Array.from(seen.values());
}

/**
 * Convert seed jobs to UnifiedJob format
 */
function seedToUnified(): UnifiedJob[] {
  return seedJobs.map((j) => ({
    ...j,
    id: `seed-${j.slug}`,
    sourceId: j.slug,
  }));
}

/**
 * Fetch jobs from ALL configured adapters in parallel.
 * Returns merged + deduplicated results.
 */
export async function fetchAllJobs(params?: {
  query?: string;
  location?: string;
  forceRefresh?: boolean;
}): Promise<{
  jobs: UnifiedJob[];
  sources: { name: string; count: number; configured: boolean; error?: string }[];
  cached: boolean;
  totalBeforeDedup: number;
}> {
  // Return cache if fresh
  if (
    !params?.forceRefresh &&
    jobCache.length > 0 &&
    Date.now() - lastFetchTime < CACHE_TTL
  ) {
    return {
      jobs: filterJobs(jobCache, params),
      sources: getAdapterStatus().map((s) => ({
        ...s,
        count: jobCache.filter((j) => j.source === s.name).length,
      })),
      cached: true,
      totalBeforeDedup: jobCache.length,
    };
  }

  // Fetch from all adapters in parallel
  const configuredAdapters = adapters.filter((a) => a.isConfigured());
  const results = await Promise.allSettled(
    configuredAdapters.map((adapter) =>
      adapter.fetchJobs(params).then((jobs) => ({
        name: adapter.name,
        jobs,
        error: undefined as string | undefined,
      }))
    )
  );

  const sources: { name: string; count: number; configured: boolean; error?: string }[] = [];
  let allJobs: UnifiedJob[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const adapterName = configuredAdapters[i].name;

    if (result.status === "fulfilled") {
      allJobs = allJobs.concat(result.value.jobs);
      sources.push({
        name: adapterName,
        count: result.value.jobs.length,
        configured: true,
      });
    } else {
      sources.push({
        name: adapterName,
        count: 0,
        configured: true,
        error: String(result.reason),
      });
    }
  }

  // Add unconfigured adapters to sources
  for (const adapter of adapters) {
    if (!adapter.isConfigured()) {
      sources.push({
        name: adapter.name,
        count: 0,
        configured: false,
      });
    }
  }

  const totalBeforeDedup = allJobs.length;

  // Always include seed jobs as fallback / demo data
  allJobs = [...seedToUnified(), ...allJobs];
  sources.push({ name: "Seed Data", count: seedJobs.length, configured: true });

  // Deduplicate
  allJobs = deduplicateJobs(allJobs);

  // Sort by posted date (newest first)
  allJobs.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );

  // Cache
  jobCache = allJobs;
  lastFetchTime = Date.now();

  return {
    jobs: filterJobs(allJobs, params),
    sources,
    cached: false,
    totalBeforeDedup,
  };
}

/**
 * Filter jobs based on search params
 */
function filterJobs(
  jobs: UnifiedJob[],
  params?: { query?: string; location?: string }
): UnifiedJob[] {
  let filtered = [...jobs];

  if (params?.query) {
    const q = params.query.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.tags.some((t) => t.toLowerCase().includes(q)) ||
        j.category.toLowerCase().includes(q)
    );
  }

  if (params?.location) {
    const loc = params.location.toLowerCase();
    filtered = filtered.filter((j) =>
      j.location.toLowerCase().includes(loc)
    );
  }

  return filtered;
}

/**
 * Get cached jobs (for fast page loads, no external fetch)
 */
export function getCachedJobs(): UnifiedJob[] {
  if (jobCache.length > 0) return jobCache;
  return seedToUnified();
}

/**
 * Clear the cache to force a fresh fetch
 */
export function clearCache() {
  jobCache = [];
  lastFetchTime = 0;
}
