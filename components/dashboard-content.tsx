"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  User,
  FileText,
  Bell,
  Settings,
  Briefcase,
  MapPin,
  Clock,
  ExternalLink,
  Trash2,
  Upload,
  Mail,
  Phone,
  Globe,
  Loader2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Tab definitions                                                    */
/* ------------------------------------------------------------------ */

const TABS = [
  { key: "overview", label: "Overview", icon: Briefcase },
  { key: "saved", label: "Saved Jobs", icon: Bookmark },
  { key: "profile", label: "Profile", icon: User },
  { key: "resume", label: "Resume", icon: FileText },
  { key: "alerts", label: "Job Alerts", icon: Bell },
  { key: "settings", label: "Settings", icon: Settings },
];

/* ------------------------------------------------------------------ */
/*  Overview Tab                                                       */
/* ------------------------------------------------------------------ */

function OverviewTab() {
  const { data: session } = useSession();

  const stats = [
    { label: "Saved Jobs", value: "0", icon: Bookmark, color: "text-blue-500 bg-blue-50" },
    { label: "Applications", value: "0", icon: FileText, color: "text-emerald-500 bg-emerald-50" },
    { label: "Profile Views", value: "—", icon: User, color: "text-violet-500 bg-violet-50" },
    { label: "Job Alerts", value: "0", icon: Bell, color: "text-amber-500 bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
        </h2>
        <p className="text-gray-500 mt-1">
          Here&apos;s an overview of your job search activity.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-100 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="/jobs"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground text-sm font-medium transition-all h-auto py-4 flex flex-col items-center gap-2"
          >
            <Briefcase className="h-5 w-5 text-brand" />
            <span className="text-sm font-medium">Browse Jobs</span>
          </a>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
          >
            <Upload className="h-5 w-5 text-brand" />
            <span className="text-sm font-medium">Upload Resume</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
          >
            <Bell className="h-5 w-5 text-brand" />
            <span className="text-sm font-medium">Set Job Alert</span>
          </Button>
        </div>
      </div>

      {/* Recommended */}
      <div className="bg-gradient-to-br from-brand-dark to-brand rounded-xl p-6 text-white">
        <h3 className="font-bold text-lg">Complete your profile</h3>
        <p className="text-white/70 mt-1 text-sm">
          A complete profile increases your chances of being discovered by
          employers by 3x.
        </p>
        <div className="mt-4 flex gap-3">
          <Button
            className="bg-white text-brand-dark hover:bg-white/90 font-semibold"
            size="sm"
          >
            Complete Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Saved Jobs Tab                                                     */
/* ------------------------------------------------------------------ */

function SavedJobsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Saved Jobs</h2>
          <p className="text-gray-500 mt-1">
            Jobs you&apos;ve bookmarked for later.
          </p>
        </div>
      </div>

      {/* Empty state */}
      <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
        <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No saved jobs yet
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          When you find a job you like, click the bookmark icon to save it here.
        </p>
        <a
          href="/jobs"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium transition-all bg-brand hover:bg-brand/90 text-white h-8 gap-1.5 px-2.5"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Browse Jobs
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Profile Tab                                                        */
/* ------------------------------------------------------------------ */

function ProfileTab() {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Profile</h2>
        <p className="text-gray-500 mt-1">
          Manage your personal information and preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-brand flex items-center justify-center text-white text-2xl font-bold">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Profile Photo</h3>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG or GIF. Max 2MB.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Upload
              </Button>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Personal Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  defaultValue={session?.user?.name || ""}
                  className="pl-10 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  defaultValue={session?.user?.email || ""}
                  className="pl-10 bg-white"
                  disabled
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="+44 7XXX XXXXXX"
                  className="pl-10 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="London, UK"
                  className="pl-10 bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Website / Portfolio
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="https://yourportfolio.com"
                className="pl-10 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Bio
            </label>
            <textarea
              rows={3}
              placeholder="Tell employers about yourself..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand bg-white resize-none"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {["JavaScript", "React", "TypeScript", "Node.js"].map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-blue-50 text-blue-700 text-xs pl-2.5 pr-1.5 py-1 gap-1"
              >
                {skill}
                <button className="hover:text-red-500 transition-colors">
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Input placeholder="Add a skill..." className="bg-white max-w-xs" />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-brand hover:bg-brand/90 text-white font-semibold px-8"
            disabled={saving}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Resume Tab                                                         */
/* ------------------------------------------------------------------ */

function ResumeTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Resume</h2>
        <p className="text-gray-500 mt-1">
          Upload your resume for quick applications.
        </p>
      </div>

      <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-brand/50 transition-colors">
        <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload your resume
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          PDF, DOC, or DOCX. Max 5MB. Your resume helps employers understand
          your background.
        </p>
        <Button className="bg-brand hover:bg-brand/90 text-white">
          <Upload className="h-4 w-4 mr-2" />
          Choose File
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard (with Suspense for useSearchParams)                 */
/* ------------------------------------------------------------------ */

function DashboardInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  const switchTab = (key: string) => {
    setActiveTab(key);
    router.push(`/dashboard?tab=${key}`, { scroll: false });
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!session) return null;

  const tabContent: Record<string, React.ReactNode> = {
    overview: <OverviewTab />,
    saved: <SavedJobsTab />,
    profile: <ProfileTab />,
    resume: <ResumeTab />,
    alerts: (
      <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Job alerts coming soon
        </h3>
        <p className="text-gray-500">
          Get notified when new jobs match your criteria.
        </p>
      </div>
    ),
    settings: (
      <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
        <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Settings coming soon
        </h3>
        <p className="text-gray-500">
          Manage your account preferences and notifications.
        </p>
      </div>
    ),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-gray-100 rounded-xl p-4 sticky top-20">
            {/* User info */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center text-white text-lg font-bold">
                {session.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {session.user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>

            {/* Tab nav */}
            <nav className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => switchTab(tab.key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.key
                      ? "bg-brand/10 text-brand"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tabContent[activeTab] || tabContent.overview}
        </div>
      </div>
    </div>
  );
}

export default function DashboardContent() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      }
    >
      <DashboardInner />
    </Suspense>
  );
}
