"use client";

import { seedJobs } from "@/data/seed-jobs";
import type { UnifiedJob } from "@/lib/jobs/types";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Briefcase,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function JobCard({ job }: { job: UnifiedJob }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 hover:border-gray-200 hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: job.companyColor }}
          >
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-[15px] leading-tight group-hover:text-brand transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-sm text-gray-500">{job.company}</span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Briefcase className="h-3 w-3" />
                {job.type.replace("_", "-")}
              </span>
            </div>
          </div>
        </div>
        <button className="text-gray-300 hover:text-gray-500 transition-colors shrink-0 mt-1">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-gray-500 leading-relaxed line-clamp-2">
        {job.description.split("\n")[0]}
      </p>

      {/* Tags */}
      <div className="mt-4 flex items-center gap-1.5 flex-wrap">
        {job.tags.slice(0, 4).map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="text-xs font-medium bg-gray-100 text-gray-600 border-none rounded-md px-2.5 py-1"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {job.salary && (
            <span className="flex items-center gap-1 font-medium text-gray-700">
              <DollarSign className="h-3.5 w-3.5 text-gray-400" />
              {job.salary}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            {timeAgo(job.postedAt)}
          </span>
        </div>
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all bg-brand hover:bg-brand/90 text-white h-9 px-5"
        >
          Apply now
        </a>
      </div>
    </div>
  );
}

export default function FeaturedJobs() {
  const seedAsUnified: UnifiedJob[] = seedJobs.map((j) => ({
    ...j,
    id: `seed-${j.slug}`,
    sourceId: j.slug,
  }));

  return (
    <section className="py-8 sm:py-12 bg-gray-50/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {seedAsUnified.length}
            </span>{" "}
            featured jobs
          </p>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            Sort:{" "}
            <select className="font-medium text-gray-900 bg-transparent outline-none cursor-pointer">
              <option>Newest</option>
              <option>Relevance</option>
              <option>Salary</option>
            </select>
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {seedAsUnified.map((job) => (
            <JobCard key={job.slug} job={job} />
          ))}
        </div>

        {/* View All */}
        <div className="mt-8 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 transition-colors"
          >
            View all jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
