import React from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Shield, Bell } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-background bg-gradient-mesh">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-card/40 backdrop-blur-xl border-b border-border px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-slow" />
            <span className="text-[13px] text-muted-text font-medium">System Online</span>
          </div>

          <div className="flex items-center gap-5">
            {/* Notification bell */}
            <button className="relative p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
              <Bell size={16} className="text-muted-text" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>

            {/* User info */}
            <div className="flex items-center gap-3 pl-5 border-l border-border">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center border border-primary/20">
                <Shield size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-200">
                  {user?.email || "Admin"}
                </p>
                <p className="text-[11px] text-muted-text">Administrator</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-danger/10 transition-colors group"
              title="Sign Out"
            >
              <LogOut size={16} className="text-muted-text group-hover:text-danger transition-colors" />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
