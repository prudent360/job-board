"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Briefcase,
  Menu,
  Search,
  Building2,
  Users,
  Compass,
  User,
  LogOut,
  LayoutDashboard,
  Bookmark,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { href: "/jobs", label: "Find Jobs", icon: Search },
  { href: "#", label: "Company Reviews", icon: Building2 },
  { href: "#", label: "Find Salaries", icon: Compass },
  { href: "#", label: "Community", icon: Users },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-dark text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Briefcase className="h-6 w-6 text-sky-300" />
          <span>
            Job<span className="text-sky-300">Nest</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-md transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : session?.user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-sm font-bold">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-white/90 max-w-[100px] truncate">
                  {session.user.name?.split(" ")[0]}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-white/50 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-2 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-gray-400" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard?tab=saved"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Bookmark className="h-4 w-4 text-gray-400" />
                      Saved Jobs
                    </Link>
                    <Link
                      href="/dashboard?tab=profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4 text-gray-400" />
                      Profile
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-all text-white/80 hover:text-white hover:bg-white/10 h-7 gap-1 px-2.5"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-semibold transition-all bg-sky-500 hover:bg-sky-400 text-white h-7 gap-1 px-2.5"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md text-white hover:bg-white/10 transition-colors" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-brand-dark border-none">
            <nav className="flex flex-col gap-2 mt-8">
              {session?.user && (
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-white/50 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}

              {session?.user && (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}

              <div className="border-t border-white/10 my-4" />

              {session?.user ? (
                <Button
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold"
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex shrink-0 items-center justify-start rounded-lg text-sm font-medium transition-all text-white/80 hover:text-white hover:bg-white/10 h-8 gap-1.5 px-2.5 w-full"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setOpen(false)}
                    className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-semibold transition-all bg-sky-500 hover:bg-sky-400 text-white h-8 gap-1.5 px-2.5 w-full"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
