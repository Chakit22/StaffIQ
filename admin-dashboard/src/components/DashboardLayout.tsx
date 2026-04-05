import React from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-200 tracking-tight">
            Admin Portal
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 p-2 rounded-full">
                <User size={18} className="text-primary" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-300">
                  {user?.email || "Admin User"}
                </p>
                <p className="text-xs text-muted">Administrator</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-4 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
