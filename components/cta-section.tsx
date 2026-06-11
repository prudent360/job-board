import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-[#0d3a6e] to-brand">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-brand/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 p-8 sm:p-12 lg:p-16">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Find your best{" "}
                <span className="text-sky-300">opportunity</span> today
              </h2>
              <p className="mt-4 text-white/70 text-lg max-w-lg">
                Set up job alerts, build your profile, and let employers find
                you. Join thousands of candidates who found their dream role.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-8"
                >
                  Start My Journey
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white font-medium"
                >
                  Explore More
                </Button>
              </div>
            </div>
            <div className="flex-shrink-0 hidden lg:block">
              <div className="w-64 h-52 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-2">🚀</div>
                  <p className="text-white/60 text-sm">
                    Your career starts here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
