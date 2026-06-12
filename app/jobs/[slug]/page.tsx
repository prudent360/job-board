import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import JobDetailContent from "@/components/job-detail-content";
import { seedJobs } from "@/data/seed-jobs";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = seedJobs.find((j) => j.slug === slug);

  return {
    title: job ? `${job.title} at ${job.company} — JobNest` : "Job Details — JobNest",
    description: job
      ? `${job.title} position at ${job.company}. ${job.salary}. ${job.location}.`
      : "View job details and apply.",
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50/60">
        <JobDetailContent slug={slug} />
      </main>
      <Footer />
    </>
  );
}
