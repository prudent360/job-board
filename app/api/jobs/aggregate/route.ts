import { NextResponse } from "next/server";
import { fetchAllJobs, clearCache, getAdapterStatus } from "@/lib/jobs/aggregator";

/**
 * GET /api/jobs/aggregate — Check adapter status
 */
export async function GET() {
  const status = getAdapterStatus();

  return NextResponse.json({
    adapters: status,
    message: "POST to this endpoint to trigger a fresh fetch from all sources.",
  });
}

/**
 * POST /api/jobs/aggregate — Trigger a fresh aggregation fetch
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const query = (body as Record<string, unknown>).query as string | undefined;
    const location = (body as Record<string, unknown>).location as string | undefined;

    // Clear cache to force fresh fetch
    clearCache();

    const result = await fetchAllJobs({
      query: query || "",
      location: location || "",
      forceRefresh: true,
    });

    return NextResponse.json({
      success: true,
      totalJobs: result.jobs.length,
      totalBeforeDedup: result.totalBeforeDedup,
      sources: result.sources,
      cached: result.cached,
      message: `Fetched ${result.jobs.length} jobs from ${result.sources.filter((s) => s.count > 0).length} sources.`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
