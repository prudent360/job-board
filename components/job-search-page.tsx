"use client";

import type { UnifiedJob } from "@/lib/jobs/types";
import { seedJobs } from "@/data/seed-jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Bookmark,
  BookmarkCheck,
  DollarSign,
  Building2,
  Briefcase,
  ExternalLink,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Share2,
  Globe,
  Monitor,
  Home,
} from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Loader2 } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full-Time" },
  { value: "PART_TIME", label: "Part-Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FREELANCE", label: "Freelance" },
];

const EXPERIENCE_LEVELS = [
  { value: "ENTRY", label: "Entry Level" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MID", label: "Mid-Level" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead" },
  { value: "EXECUTIVE", label: "Executive" },
];

const ARRANGEMENTS = [
  { value: "REMOTE", label: "Remote", icon: Globe },
  { value: "HYBRID", label: "Hybrid", icon: Home },
  { value: "ONSITE", label: "On-site", icon: Monitor },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Most Recent" },
  { value: "salary-high", label: "Salary: High to Low" },
  { value: "salary-low", label: "Salary: Low to High" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

/* ------------------------------------------------------------------ */
/*  Filter Dropdown                                                    */
/* ------------------------------------------------------------------ */

function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg border transition-all ${
          selected.length > 0
            ? "bg-brand/10 text-brand border-brand/30"
            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
        }`}
      >
        {label}
        {selected.length > 0 && (
          <span className="bg-brand text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {selected.length}
          </span>
        )}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-[200px] py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onToggle(opt.value)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    selected.includes(opt.value)
                      ? "bg-brand border-brand"
                      : "border-gray-300"
                  }`}
                >
                  {selected.includes(opt.value) && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={
                    selected.includes(opt.value)
                      ? "text-gray-900 font-medium"
                      : "text-gray-600"
                  }
                >
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Job Card                                                           */
/* ------------------------------------------------------------------ */

function JobCard({
  job,
  isActive,
  onClick,
  isSaved,
  onSave,
}: {
  job: UnifiedJob;
  isActive: boolean;
  onClick: () => void;
  isSaved: boolean;
  onSave: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 hover:shadow-md group cursor-pointer ${
        isActive
          ? "border-brand bg-blue-50/60 shadow-sm ring-1 ring-brand/20"
          : "border-gray-100 bg-white hover:border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: job.companyColor }}
          >
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-[15px] leading-tight">
              {job.title}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {job.company}
            </p>
          </div>
        </div>
        <button
          className={`transition-colors shrink-0 ${
            isSaved
              ? "text-brand"
              : "text-gray-300 hover:text-brand"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onSave();
          }}
          aria-label={isSaved ? "Unsave job" : "Save job"}
        >
          {isSaved ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {job.location}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1 font-medium text-gray-700">
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
        {job.featured && (
          <Badge className="text-[10px] font-medium bg-amber-50 text-amber-700 border-none">
            ⭐ Featured
          </Badge>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          {timeAgo(job.postedAt)}
        </span>
        <span className="text-xs text-gray-400">
          via {job.source}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Job Detail Panel                                                   */
/* ------------------------------------------------------------------ */

function JobDetail({
  job,
  isSaved,
  onSave,
}: {
  job: UnifiedJob;
  isSaved: boolean;
  onSave: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
            <p className="text-gray-500 mt-1 flex items-center gap-1.5 text-sm">
              <Building2 className="h-4 w-4" />
              {job.company}
            </p>
          </div>
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
            style={{ backgroundColor: job.companyColor }}
          >
            {job.company.slice(0, 2).toUpperCase()}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gray-400" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-gray-400" />
            {job.type.replace("_", "-")}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1.5 font-semibold text-gray-900">
              <DollarSign className="h-4 w-4 text-gray-400" />
              {job.salary}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gray-400" />
            {timeAgo(job.postedAt)}
          </span>
        </div>

        <div className="mt-5 flex gap-3 flex-wrap">
          <Button
            className="bg-brand hover:bg-brand/90 text-white font-semibold px-6"
            asChild
          >
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Apply Now
            </a>
          </Button>
          <Button variant="outline" className="font-medium" onClick={onSave}>
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 mr-2 text-brand" />
            ) : (
              <Bookmark className="h-4 w-4 mr-2" />
            )}
            {isSaved ? "Saved" : "Save Job"}
          </Button>
          <Button variant="outline" size="icon" className="shrink-0">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6 max-h-[calc(100vh-340px)] overflow-y-auto">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 text-base">
            About the Job
          </h3>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2.5">
            {job.description?.split("\n").map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return null;
              if (trimmed.startsWith("## "))
                return (
                  <h4
                    key={i}
                    className="font-semibold text-gray-900 text-[15px] mt-5 mb-1"
                  >
                    {trimmed.replace("## ", "")}
                  </h4>
                );
              if (trimmed.startsWith("- "))
                return (
                  <div key={i} className="flex items-start gap-2 pl-1">
                    <span className="text-brand mt-0.5 shrink-0">•</span>
                    <span>{trimmed.replace("- ", "")}</span>
                  </div>
                );
              return <p key={i}>{trimmed}</p>;
            })}
          </div>
        </div>

        {job.requirements.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-base">
              Requirements
            </h3>
            <ul className="space-y-2">
              {job.requirements.map((req, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-gray-600"
                >
                  <span className="text-brand mt-0.5 shrink-0">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.benefits.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-base">
              What We Offer
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {job.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 text-sm text-gray-600 bg-emerald-50/60 rounded-lg px-3 py-2.5"
                >
                  <span className="text-emerald-500 shrink-0">✓</span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        )}

        {job.tags.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-base">
              Skills & Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 text-xs px-3 py-1"
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

/* ------------------------------------------------------------------ */
/*  Main Search Page Component                                         */
/* ------------------------------------------------------------------ */

// Convert seed data to UnifiedJob shape for initial render
const seedAsUnified: UnifiedJob[] = seedJobs.map((j) => ({
  ...j,
  id: `seed-${j.slug}`,
  sourceId: j.slug,
}));

export default function JobSearchPage() {
  // Search & filter state
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedArrangements, setSelectedArrangements] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [allJobs, setAllJobs] = useState<UnifiedJob[]>(seedAsUnified);
  const [activeJob, setActiveJob] = useState<UnifiedJob>(seedAsUnified[0]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [sourceSummary, setSourceSummary] = useState<{ name: string; count: number }[]>([]);

  // Fetch from aggregator API on mount
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/jobs?refresh=true&limit=200");
        if (res.ok) {
          const data = await res.json();
          if (data.jobs && data.jobs.length > 0) {
            setAllJobs(data.jobs);
            setActiveJob(data.jobs[0]);
            if (data.sources) setSourceSummary(data.sources);
          }
        }
      } catch {
        // Keep seed data on error
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Toggle helpers
  const toggleFilter = useCallback(
    (
      value: string,
      selected: string[],
      setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
      setter(
        selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value]
      );
    },
    []
  );

  const toggleSaved = useCallback((slug: string) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const clearAllFilters = () => {
    setKeyword("");
    setLocation("");
    setSelectedTypes([]);
    setSelectedExperience([]);
    setSelectedArrangements([]);
  };

  // Active filter count
  const activeFilterCount =
    selectedTypes.length +
    selectedExperience.length +
    selectedArrangements.length;

  // Filtered & sorted jobs
  const filteredJobs = useMemo(() => {
    let jobs = [...allJobs];

    // Keyword
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Location
    if (location.trim()) {
      const loc = location.toLowerCase();
      jobs = jobs.filter((j) => j.location.toLowerCase().includes(loc));
    }

    // Type
    if (selectedTypes.length > 0) {
      jobs = jobs.filter((j) => selectedTypes.includes(j.type));
    }

    // Experience
    if (selectedExperience.length > 0) {
      jobs = jobs.filter((j) => selectedExperience.includes(j.experience));
    }

    // Arrangement
    if (selectedArrangements.length > 0) {
      jobs = jobs.filter((j) => selectedArrangements.includes(j.arrangement));
    }

    // Sort
    if (sortBy === "newest") {
      jobs.sort(
        (a, b) =>
          new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      );
    } else if (sortBy === "salary-high") {
      jobs.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
    } else if (sortBy === "salary-low") {
      jobs.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
    }

    return jobs;
  }, [keyword, location, selectedTypes, selectedExperience, selectedArrangements, sortBy, allJobs]);

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <div className="bg-brand-dark text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-5">
            Find your perfect role
          </h1>

          {/* Search inputs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 bg-white rounded-lg px-4 py-2.5">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, keyword, or company"
                className="w-full text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
              />
              {keyword && (
                <button onClick={() => setKeyword("")}>
                  <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-1 sm:max-w-xs bg-white rounded-lg px-4 py-2.5">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location or timezone"
                className="w-full text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
              />
              {location && (
                <button onClick={() => setLocation("")}>
                  <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <Button
              className="bg-brand hover:bg-brand/90 text-white font-semibold px-8 rounded-lg"
              size="lg"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <FilterDropdown
              label="Job Type"
              options={JOB_TYPES}
              selected={selectedTypes}
              onToggle={(v) => toggleFilter(v, selectedTypes, setSelectedTypes)}
            />
            <FilterDropdown
              label="Experience"
              options={EXPERIENCE_LEVELS}
              selected={selectedExperience}
              onToggle={(v) =>
                toggleFilter(v, selectedExperience, setSelectedExperience)
              }
            />

            {/* Arrangement toggle buttons */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
              {ARRANGEMENTS.map((arr) => (
                <button
                  key={arr.value}
                  onClick={() =>
                    toggleFilter(
                      arr.value,
                      selectedArrangements,
                      setSelectedArrangements
                    )
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    selectedArrangements.includes(arr.value)
                      ? "bg-brand text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <arr.icon className="h-3 w-3" />
                  {arr.label}
                </button>
              ))}
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="h-3 w-3" />
                Clear all ({activeFilterCount})
              </button>
            )}

            <div className="ml-auto flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm text-gray-700 bg-transparent outline-none cursor-pointer font-medium"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />
                Fetching jobs from sources...
              </span>
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredJobs.length}
                </span>{" "}
                jobs
                {sourceSummary.length > 0 && (
                  <span className="text-gray-400">
                    {" "}from {sourceSummary.filter((s) => s.count > 0).length} sources
                  </span>
                )}
                {keyword && (
                  <span>
                    {" "}
                    for &quot;<span className="font-medium text-brand">{keyword}</span>&quot;
                  </span>
                )}
                {location && (
                  <span>
                    {" "}
                    in &quot;<span className="font-medium text-brand">{location}</span>&quot;
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Try adjusting your search or filters to find more opportunities.
            </p>
            <Button variant="outline" onClick={clearAllFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Job list */}
            <div className="lg:col-span-2 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.slug}
                  job={job}
                  isActive={activeJob.slug === job.slug}
                  onClick={() => setActiveJob(job)}
                  isSaved={savedJobs.has(job.slug)}
                  onSave={() => toggleSaved(job.slug)}
                />
              ))}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-3 hidden lg:block sticky top-36 self-start">
              <JobDetail
                job={activeJob}
                isSaved={savedJobs.has(activeJob.slug)}
                onSave={() => toggleSaved(activeJob.slug)}
              />
            </div>

            {/* Mobile detail */}
            <div className="lg:hidden">
              <JobDetail
                job={activeJob}
                isSaved={savedJobs.has(activeJob.slug)}
                onSave={() => toggleSaved(activeJob.slug)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
