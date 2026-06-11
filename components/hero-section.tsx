"use client";

import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSection() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [loc, setLoc] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (loc.trim()) params.set("location", loc.trim());
    router.push(`/jobs${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-light/60 via-white to-white" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/5 rounded-full blur-3xl" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-violet-200/30 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.15] text-gray-900">
          The #1 job board for
          <br />
          <span className="text-brand">freelance jobs</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          Looking for a job? Browse latest freelance job openings to view &amp; apply!
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-stretch gap-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-2 flex-1 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Product/UI/UX designer"
                className="w-full text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
                id="hero-search-keyword"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword("")}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-1 px-4 py-3">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                placeholder="Country or timezone"
                className="w-full text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
                id="hero-search-location"
              />
            </div>

            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 text-sm transition-colors shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
