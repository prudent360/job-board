import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import StatsBar from "@/components/stats-bar";
import FeaturedJobs from "@/components/featured-jobs";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsBar />
        <FeaturedJobs />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
