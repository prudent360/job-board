"use client";

import { seedJobs } from "@/data/seed-jobs";
import type { UnifiedJob } from "@/lib/jobs/types";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Briefcase,
  ExternalLink,
  ArrowLeft,
  Bookmark,
  Share2,
  Globe,
  Users,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

// Convert seed jobs for lookup
const seedAsUnified: UnifiedJob[] = seedJobs.map((j) => ({
  ...j,
  id: `seed-${j.slug}`,
  sourceId: j.slug,
}));

export default function JobDetailContent({ slug }: { slug: string }) {
  const [job, setJob] = useState<UnifiedJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Try seed data first
    const seedMatch = seedAsUnified.find((j) => j.slug === slug);
    if (seedMatch) {
      setJob(seedMatch);
      setLoading(false);
      return;
    }

    // Try API
    const fetchJob = async () => {
      try {
        const res = await fetch("/api/jobs?limit=500");
        if (res.ok) {
          const data = await res.json();
          const match = data.jobs?.find((j: UnifiedJob) => j.slug === slug);
          if (match) {
            setJob(match);
          }
        }
      } catch {
        // Job not found
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h1>
        <p className="text-gray-500 mb-6">
          This job may have been removed or the link is incorrect.
        </p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                style={{ backgroundColor: job.companyColor }}
              >
                {job.company.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-gray-500 mt-1 flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {job.company}
                </p>
              </div>
            </div>

            {/* Meta info */}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gray-400" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-gray-400" />
                {job.type.replace("_", "-")}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-gray-400" />
                {job.arrangement}
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-gray-400" />
                {job.experience}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1.5 font-semibold text-gray-900">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  {job.salary}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gray-400" />
                Posted {timeAgo(job.postedAt)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex gap-3 flex-wrap">
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all bg-brand hover:bg-brand/90 text-white h-10 px-6 gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Apply Now
              </a>
              <button
                onClick={() => setSaved(!saved)}
                className={`inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all border h-10 px-4 gap-2 ${
                  saved
                    ? "bg-brand-light border-brand/20 text-brand"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
                {saved ? "Saved" : "Save Job"}
              </button>
              <button className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 h-10 px-4 gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About the Job</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              {job.description?.split("\n").map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith("## "))
                  return (
                    <h3 key={i} className="font-semibold text-gray-900 text-base mt-5 mb-1">
                      {trimmed.replace("## ", "")}
                    </h3>
                  );
                if (trimmed.startsWith("- "))
                  return (
                    <div key={i} className="flex items-start gap-2.5 pl-1">
                      <span className="text-brand mt-0.5 shrink-0">•</span>
                      <span>{trimmed.replace("- ", "")}</span>
                    </div>
                  );
                return <p key={i}>{trimmed}</p>;
              })}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2.5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="text-brand mt-0.5 shrink-0">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Benefits */}
          {job.benefits.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">What We Offer</h3>
              <div className="space-y-2.5">
                {job.benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-sm text-gray-600"
                  >
                    <span className="text-emerald-500 shrink-0">✓</span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {job.tags.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Skills & Tags</h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-md"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Company Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">About {job.company}</h3>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: job.companyColor }}
              >
                {job.company.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{job.company}</p>
                <p className="text-xs text-gray-400">via {job.source}</p>
              </div>
            </div>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all bg-brand hover:bg-brand/90 text-white h-9 px-5 w-full gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
