import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import {
  Users,
  BookOpen,
  ShieldBan,
  BarChart3,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const dashboardCards = [
  {
    label: "Manage Courses",
    description: "Create, edit, and organize courses",
    path: "/admin/courses",
    icon: BookOpen,
    gradient: "from-violet-600 to-primary",
  },
  {
    label: "Assign Lecturers",
    description: "Map lecturers to their courses",
    path: "/admin/assign",
    icon: Users,
    gradient: "from-primary to-accent",
  },
  {
    label: "Block Candidates",
    description: "Manage user access controls",
    path: "/admin/block",
    icon: ShieldBan,
    gradient: "from-rose-600 to-pink-500",
  },
  {
    label: "Reports",
    description: "Analytics and detailed insights",
    path: "/admin/reports",
    icon: BarChart3,
    gradient: "from-accent to-fuchsia-400",
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="relative overflow-hidden glass-panel p-8">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="text-muted-text text-sm font-medium mb-1">
              {greeting}
            </p>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {user?.email || "Admin"}
            </h1>
            <p className="text-muted-text text-sm mt-3 max-w-lg">
              Full administrative access to StaffIQ. Manage courses, assign
              lecturers, review candidates, and generate reports.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "System Status",
              value: "Operational",
              icon: Zap,
              color: "text-success",
            },
            {
              label: "Active Session",
              value: now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              icon: Clock,
              color: "text-primary",
            },
            {
              label: "Access Level",
              value: "Full Admin",
              icon: TrendingUp,
              color: "text-accent",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-panel p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center border border-border">
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-[11px] text-muted-text uppercase tracking-widest font-medium">
                  {label}
                </p>
                <p className={`text-sm font-bold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Cards */}
        <div>
          <p className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold mb-4">
            Quick Actions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardCards.map(
              ({ label, description, path, icon: Icon, gradient }, idx) => (
                <div
                  key={label}
                  onClick={() => navigate(path)}
                  className="stat-card group cursor-pointer relative overflow-hidden"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Gradient accent bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient} opacity-60 group-hover:opacity-100 transition-opacity`}
                  />

                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-glow group-hover:shadow-glow-lg transition-shadow`}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  <h2 className="text-[15px] font-bold text-gray-200 group-hover:text-white transition-colors">
                    {label}
                  </h2>
                  <p className="text-[12px] text-muted-text mt-1 leading-relaxed">
                    {description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Reminder */}
        <div className="glass-panel p-5 flex items-start gap-4 border-l-2 border-l-warning">
          <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Clock size={14} className="text-warning" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-300">
              Semester Reminder
            </p>
            <p className="text-[12px] text-muted-text mt-1 leading-relaxed">
              Ensure all lecturers are assigned to courses before the semester
              starts. Review the assignment page for any pending allocations.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
