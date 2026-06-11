import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import JobSearchPage from "@/components/job-search-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Jobs — JobNest",
  description:
    "Browse and filter thousands of jobs by keyword, location, type, experience, and more.",
};

export default function JobsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50/60">
        <JobSearchPage />
      </main>
      <Footer />
    </>
  );
}
