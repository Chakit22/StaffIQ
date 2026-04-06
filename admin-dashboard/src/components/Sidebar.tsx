import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Users,
  BookOpen,
  ShieldBan,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Assign Lecturer", path: "/admin/assign", icon: Users },
  { label: "Manage Courses", path: "/admin/courses", icon: BookOpen },
  { label: "Block Candidates", path: "/admin/block", icon: ShieldBan },
  { label: "Reports", path: "/admin/reports", icon: BarChart3 },
];

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <aside className="w-72 h-full bg-card/50 backdrop-blur-xl border-r border-border flex flex-col relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="p-7 border-b border-border relative">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-extrabold text-sm">S</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              StaffIQ
            </h2>
            <p className="text-[11px] text-muted-text tracking-widest uppercase">
              Admin Console
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-4 pt-6 flex-grow">
        <p className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold mb-3 px-3">
          Navigation
        </p>
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all duration-200 flex items-center gap-3 group ${
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20 shadow-glow"
                  : "text-muted-text hover:bg-white/[0.03] hover:text-gray-300 border border-transparent"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                size={16}
                className={`transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted group-hover:text-gray-400"
                }`}
              />
              {label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-glow" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-danger/10 hover:bg-danger/20 text-danger py-2.5 px-4 rounded-xl transition-all duration-200 text-[13px] font-medium border border-danger/10 hover:border-danger/20"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
