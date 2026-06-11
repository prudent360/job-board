"use client";

import type { UnifiedJob } from "@/lib/jobs/types";
import { seedJobs } from "@/data/seed-jobs";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  DollarSign,
  ExternalLink,
  Search,
  X,
  CheckCircle2,
  Users,
  MoreHorizontal,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Loader2 } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full-time job" },
  { value: "PART_TIME", label: "Part-time job" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FREELANCE", label: "Freelance" },
];

const EXPERIENCE_LEVELS = [
  { value: "ENTRY", label: "Entry level" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MID", label: "Intermediate" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead" },
  { value: "EXECUTIVE", label: "Expert" },
];

const CATEGORIES = [
  "All Categories",
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Data & AI",
  "Sales",
  "Finance",
  "Operations",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "relevance", label: "Relevance" },
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
/*  Job Card                                                           */
/* ------------------------------------------------------------------ */

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
              <span className="flex items-center gap-0.5 text-xs text-brand">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin className="h-3 w-3" />
                {job.arrangement}
              </span>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                {Math.floor(Math.random() * 80 + 10)} applicants
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
        {job.tags.slice(0, 5).map((tag) => (
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
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {Math.floor(Math.random() * 30 + 5)} proposals
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

/* ------------------------------------------------------------------ */
/*  Filter Sidebar                                                     */
/* ------------------------------------------------------------------ */

function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  selectedExperience,
  onToggleExperience,
  selectedTypes,
  onToggleType,
  onReset,
  jobCounts,
}: {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedExperience: string[];
  onToggleExperience: (val: string) => void;
  selectedTypes: string[];
  onToggleType: (val: string) => void;
  onReset: () => void;
  jobCounts: { experience: Record<string, number>; type: Record<string, number> };
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-gray-900">Filter</h3>
        <button
          onClick={onReset}
          className="text-sm text-brand hover:text-brand/80 font-medium transition-colors flex items-center gap-1"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Categories</h4>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-brand appearance-none bg-white cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Experience Level */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Experience level</h4>
        <div className="space-y-2.5">
          {EXPERIENCE_LEVELS.map((level) => (
            <label
              key={level.value}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedExperience.includes(level.value)
                      ? "bg-brand border-brand"
                      : "border-gray-300 group-hover:border-gray-400"
                  }`}
                  onClick={() => onToggleExperience(level.value)}
                >
                  {selectedExperience.includes(level.value) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-600">{level.label}</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {jobCounts.experience[level.value] || 0}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Job Type */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Job type</h4>
        <div className="space-y-2.5">
          {JOB_TYPES.map((type) => (
            <label
              key={type.value}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedTypes.includes(type.value)
                      ? "bg-brand border-brand"
                      : "border-gray-300 group-hover:border-gray-400"
                  }`}
                  onClick={() => onToggleType(type.value)}
                >
                  {selectedTypes.includes(type.value) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-600">{type.label}</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {jobCounts.type[type.value] || 0}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Price range</h4>
        <input
          type="text"
          placeholder="Enter fixed price"
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-brand bg-white placeholder:text-gray-400"
        />
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
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [allJobs, setAllJobs] = useState<UnifiedJob[]>(seedAsUnified);
  const [loading, setLoading] = useState(false);

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
    (value: string, selected: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
      setter(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
    },
    []
  );

  const clearAllFilters = () => {
    setKeyword("");
    setLocation("");
    setSelectedCategory("All Categories");
    setSelectedTypes([]);
    setSelectedExperience([]);
  };

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

    // Category
    if (selectedCategory !== "All Categories") {
      jobs = jobs.filter((j) => j.category === selectedCategory);
    }

    // Type
    if (selectedTypes.length > 0) {
      jobs = jobs.filter((j) => selectedTypes.includes(j.type));
    }

    // Experience
    if (selectedExperience.length > 0) {
      jobs = jobs.filter((j) => selectedExperience.includes(j.experience));
    }

    // Sort
    if (sortBy === "newest") {
      jobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    } else if (sortBy === "salary-high") {
      jobs.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
    } else if (sortBy === "salary-low") {
      jobs.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
    }

    return jobs;
  }, [keyword, location, selectedCategory, selectedTypes, selectedExperience, sortBy, allJobs]);

  // Counts for sidebar
  const jobCounts = useMemo(() => {
    const experience: Record<string, number> = {};
    const type: Record<string, number> = {};
    allJobs.forEach((j) => {
      experience[j.experience] = (experience[j.experience] || 0) + 1;
      type[j.type] = (type[j.type] || 0) + 1;
    });
    return { experience, type };
  }, [allJobs]);

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-light/60 via-white to-white" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-violet-200/30 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-gray-900">
            The #1 job board for
            <br />
            <span className="text-brand">freelance jobs</span>
          </h1>
          <p className="mt-4 text-base text-gray-500 max-w-xl mx-auto">
            Looking for a job? Browse latest freelance job openings to view &amp; apply!
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch gap-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 flex-1 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Product/UI/UX designer"
                  className="w-full text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
                />
                {keyword && (
                  <button onClick={() => setKeyword("")}>
                    <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 flex-1 px-4 py-3">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Country or timezone"
                  className="w-full text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
                />
                {location && (
                  <button onClick={() => setLocation("")}>
                    <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 text-sm transition-colors shrink-0">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Job list — left */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />
                    Fetching jobs from sources...
                  </span>
                ) : (
                  <>
                    Showing results (
                    <span className="font-semibold text-gray-900">
                      {filteredJobs.length}
                    </span>
                    )
                  </>
                )}
              </p>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                Sort:{" "}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="font-medium text-gray-900 bg-transparent outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job cards */}
            {filteredJobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Try adjusting your search or filters to find more opportunities.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 h-9 px-5"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <JobCard key={job.slug} job={job} />
                ))}
              </div>
            )}
          </div>

          {/* Filter sidebar — right */}
          <div className="w-full lg:w-72 shrink-0 order-first lg:order-last">
            <FilterSidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedExperience={selectedExperience}
              onToggleExperience={(v) => toggleFilter(v, selectedExperience, setSelectedExperience)}
              selectedTypes={selectedTypes}
              onToggleType={(v) => toggleFilter(v, selectedTypes, setSelectedTypes)}
              onReset={clearAllFilters}
              jobCounts={jobCounts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
