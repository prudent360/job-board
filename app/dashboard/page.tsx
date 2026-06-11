import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DashboardContent from "@/components/dashboard-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — JobNest",
  description: "Manage your saved jobs, profile, and applications.",
};

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50/60">
        <DashboardContent />
      </main>
      <Footer />
    </>
  );
}
