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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const JOBS_PER_PAGE = 6;

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
      {/* Header — clickable */}
      <Link href={`/jobs/${job.slug}`} className="flex items-start gap-3.5">
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
      </Link>

      {/* Description */}
      <Link href={`/jobs/${job.slug}`}>
        <p className="mt-4 text-sm text-gray-500 leading-relaxed line-clamp-2">
          {job.description.split("\n")[0]}
        </p>
      </Link>

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
        <Link
          href={`/jobs/${job.slug}`}
          className="inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all bg-brand hover:bg-brand/90 text-white h-9 px-5"
        >
          View details
        </Link>
      </div>
    </div>
  );
}

/* Pagination */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getVisiblePages().map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`inline-flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-brand text-white"
                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function FeaturedJobs() {
  const [currentPage, setCurrentPage] = useState(1);

  const seedAsUnified: UnifiedJob[] = seedJobs.map((j) => ({
    ...j,
    id: `seed-${j.slug}`,
    sourceId: j.slug,
  }));

  const totalPages = Math.ceil(seedAsUnified.length / JOBS_PER_PAGE);
  const paginatedJobs = seedAsUnified.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  return (
    <section className="py-8 sm:py-12 bg-gray-50/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {(currentPage - 1) * JOBS_PER_PAGE + 1}–
              {Math.min(currentPage * JOBS_PER_PAGE, seedAsUnified.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {seedAsUnified.length}
            </span>{" "}
            featured jobs
          </p>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {paginatedJobs.map((job) => (
            <JobCard key={job.slug} job={job} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        {/* View All */}
        <div className="mt-6 text-center">
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
