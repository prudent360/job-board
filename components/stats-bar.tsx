import { Briefcase, Building2, Users, TrendingUp } from "lucide-react";

const stats = [
  { icon: Briefcase, value: "142,000+", label: "Active Jobs", color: "text-blue-500" },
  { icon: Building2, value: "12,400+", label: "Companies", color: "text-emerald-500" },
  { icon: Users, value: "2.1M+", label: "Candidates", color: "text-violet-500" },
  { icon: TrendingUp, value: "89%", label: "Success Rate", color: "text-amber-500" },
];

export default function StatsBar() {
  return (
    <section className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
