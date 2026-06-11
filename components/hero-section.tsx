"use client";

import { Search, MapPin, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSection() {
  const router = useRouter();
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [loc, setLoc] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (loc.trim()) params.set("location", loc.trim());
    if (remoteOnly) params.set("arrangement", "REMOTE");
    router.push(`/jobs${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section className="relative bg-brand-dark text-white overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-[#0d3a6e] to-[#0A66C2]/60" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Let&apos;s find your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-sky-500">
              dream job
            </span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed">
            Discover opportunities from thousands of companies worldwide.
            Search, filter, and apply — all in one place.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-10 max-w-4xl">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-stretch gap-3 p-3 bg-white rounded-xl shadow-2xl shadow-black/20"
          >
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="h-5 w-5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title or keyword"
                className="w-full text-gray-900 text-sm placeholder:text-gray-400 outline-none bg-transparent py-2"
                id="hero-search-keyword"
              />
            </div>

            <div className="hidden sm:block w-px bg-gray-200" />

            <div className="flex items-center gap-2 flex-1 px-3">
              <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                placeholder="Country or timezone"
                className="w-full text-gray-900 text-sm placeholder:text-gray-400 outline-none bg-transparent py-2"
                id="hero-search-location"
              />
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 text-gray-600 text-sm shrink-0">
              <button
                type="button"
                onClick={() => setRemoteOnly(!remoteOnly)}
                className="flex items-center gap-1.5 hover:text-brand transition-colors"
              >
                {remoteOnly ? (
                  <ToggleRight className="h-5 w-5 text-brand" />
                ) : (
                  <ToggleLeft className="h-5 w-5" />
                )}
                Remote
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              className="bg-brand hover:bg-brand/90 text-white font-semibold px-8 rounded-lg shrink-0"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Filter pills */}
        <div className="mt-6 flex flex-wrap gap-2 max-w-4xl">
          {[
            "Experience Level",
            "Company",
            "Job type",
            "Salary",
            "Work mode",
            "Seniority",
          ].map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 text-sm font-medium text-white/70 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all hover:text-white"
            >
              {filter} ▾
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
