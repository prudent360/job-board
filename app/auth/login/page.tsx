"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-dark via-[#0d3a6e] to-brand relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold text-xl"
          >
            <Briefcase className="h-6 w-6 text-sky-300" />
            Job<span className="text-sky-300">Nest</span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Welcome back to your{" "}
              <span className="text-sky-300">career journey</span>
            </h1>
            <p className="mt-4 text-white/60 text-lg leading-relaxed">
              Access your saved jobs, track applications, and discover new
              opportunities tailored to you.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "142,000+ active jobs from 9+ sources",
                "AI-powered job matching",
                "One-click apply to your dream role",
              ].map((feat) => (
                <div
                  key={feat}
                  className="flex items-center gap-3 text-white/70"
                >
                  <div className="w-5 h-5 rounded-full bg-sky-400/20 flex items-center justify-center shrink-0">
                    <span className="text-sky-300 text-xs">✓</span>
                  </div>
                  <span className="text-sm">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} JobNest. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link
            href="/"
            className="lg:hidden flex items-center gap-2 font-bold text-xl text-gray-900 mb-8"
          >
            <Briefcase className="h-6 w-6 text-brand" />
            Job<span className="text-brand">Nest</span>
          </Link>

          <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
          <p className="mt-2 text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-brand font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>

          {error && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 h-11 bg-white"
                  required
                  id="login-email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-brand hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 h-11 bg-white"
                  required
                  minLength={6}
                  id="login-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-brand hover:bg-brand/90 text-white font-semibold"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ArrowRight className="h-4 w-4 mr-2" />
              )}
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-gray-50 px-3 text-gray-400 uppercase tracking-wide">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { name: "Google", icon: "G" },
                { name: "LinkedIn", icon: "in" },
                { name: "GitHub", icon: "GH" },
              ].map((provider) => (
                <Button
                  key={provider.name}
                  variant="outline"
                  className="h-11 bg-white hover:bg-gray-50 font-semibold text-sm"
                  disabled
                >
                  {provider.icon}
                </Button>
              ))}
            </div>
            <p className="mt-2 text-center text-[10px] text-gray-400">
              OAuth providers coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
