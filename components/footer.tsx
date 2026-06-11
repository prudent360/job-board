import Link from "next/link";
import { Briefcase } from "lucide-react";

const footerLinks = {
  "For Job Seekers": [
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Salary Guide", href: "#" },
    { label: "Career Advice", href: "#" },
    { label: "Company Profiles", href: "#" },
    { label: "Student Career Center", href: "#" },
  ],
  "For Employers": [
    { label: "Products", href: "#" },
    { label: "Solutions", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Resources", href: "#" },
    { label: "Help", href: "#" },
  ],
  "Helpful Resources": [
    { label: "About Us", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Privacy Center", href: "#" },
    { label: "Security Center", href: "#" },
    { label: "Accessibility Center", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl text-gray-900"
            >
              <Briefcase className="h-5 w-5 text-brand" />
              <span>
                Job<span className="text-brand">Nest</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xs">
              Discover the best opportunities from thousands of companies.
              Built for job seekers and employers.
            </p>
            <div className="mt-4 flex items-center">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 text-sm border border-gray-200 rounded-l-lg px-3 py-2 outline-none focus:border-brand bg-gray-50"
              />
              <button className="text-sm px-3 py-2 bg-brand text-white rounded-r-lg hover:bg-brand/90 transition-colors font-medium">
                →
              </button>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-gray-900 text-sm mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-brand transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} JobNest. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Cookies"].map((link) => (
              <Link
                key={link}
                href="#"
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
