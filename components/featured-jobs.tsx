"use client";

import { seedJobs } from "@/data/seed-jobs";
import type { UnifiedJob } from "@/lib/jobs/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Bookmark,
  DollarSign,
  Building2,
  ArrowRight,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function JobCard({
  job,
  isActive,
  onClick,
}: {
  job: UnifiedJob;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 hover:shadow-md group cursor-pointer ${
        isActive
          ? "border-brand bg-blue-50/50 shadow-sm"
          : "border-gray-100 bg-white hover:border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: job.companyColor }}
          >
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
              {job.title}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{job.company}</p>
          </div>
        </div>
        <button
          className="text-gray-300 hover:text-brand transition-colors shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Bookmark className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {job.location}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {job.salary}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <Badge
          variant="secondary"
          className="text-[10px] font-medium bg-blue-50 text-blue-700 border-none"
        >
          {job.type.replace("_", "-")}
        </Badge>
        <Badge
          variant="secondary"
          className="text-[10px] font-medium bg-emerald-50 text-emerald-700 border-none"
        >
          {job.arrangement}
        </Badge>
        <Badge
          variant="secondary"
          className="text-[10px] font-medium bg-violet-50 text-violet-700 border-none"
        >
          {job.experience}
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {timeAgo(job.postedAt)}
        </span>
        <span className="text-brand font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          View <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

function JobDetail({ job }: { job: UnifiedJob }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
            <p className="text-gray-500 mt-1 flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {job.company}
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: job.companyColor }}
          >
            {job.company.slice(0, 2).toUpperCase()}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gray-400" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-gray-400" />
            {job.type.replace("_", "-")}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-gray-400" />
              {job.salary}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gray-400" />
            {timeAgo(job.postedAt)}
          </span>
        </div>

        <div className="mt-5 flex gap-3">
          <Button className="bg-brand hover:bg-brand/90 text-white font-semibold px-6">
            <ExternalLink className="h-4 w-4 mr-2" />
            Apply Now
          </Button>
          <Button variant="outline" className="font-medium">
            <Bookmark className="h-4 w-4 mr-2" />
            Save Job
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">About the Job</h3>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            {job.description?.split("\n").map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return null;
              if (trimmed.startsWith("## "))
                return (
                  <h4 key={i} className="font-semibold text-gray-900 text-base mt-4">
                    {trimmed.replace("## ", "")}
                  </h4>
                );
              if (trimmed.startsWith("- "))
                return (
                  <div key={i} className="flex items-start gap-2 pl-1">
                    <span className="text-brand mt-0.5">•</span>
                    <span>{trimmed.replace("- ", "")}</span>
                  </div>
                );
              return <p key={i}>{trimmed}</p>;
            })}
          </div>
        </div>

        {job.requirements.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
            <ul className="space-y-2">
              {job.requirements.map((req, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="text-brand mt-0.5">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.benefits.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              What We Offer
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {job.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2"
                >
                  <span className="text-emerald-500">✓</span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        )}

        {job.tags.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeaturedJobs() {
  const seedAsUnified: UnifiedJob[] = seedJobs.map((j) => ({ ...j, id: `seed-${j.slug}`, sourceId: j.slug }));
  const [activeJob, setActiveJob] = useState<UnifiedJob>(seedAsUnified[0]);

  return (
    <section className="py-12 sm:py-16 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-brand uppercase tracking-wide">
              Recommended jobs · {seedJobs.length} results
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Sort by: <span className="text-brand">Relevance</span>
            </h2>
          </div>
          <Button variant="outline" className="hidden sm:flex">
            View All Jobs
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Job list — left */}
          <div className="lg:col-span-2 space-y-3 max-h-[800px] overflow-y-auto pr-1 scrollbar-thin">
            {seedAsUnified.map((job) => (
              <JobCard
                key={job.slug}
                job={job}
                isActive={activeJob.slug === job.slug}
                onClick={() => setActiveJob(job)}
              />
            ))}
          </div>

          {/* Job detail — right */}
          <div className="lg:col-span-3 hidden lg:block sticky top-20 self-start">
            <JobDetail job={activeJob} />
          </div>
        </div>

        {/* Mobile: show active job below */}
        <div className="lg:hidden mt-6">
          <JobDetail job={activeJob} />
        </div>
      </div>
    </section>
  );
}
