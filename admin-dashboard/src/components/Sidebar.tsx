import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Assign Lecturer", path: "/admin/assign" },
  { label: "Manage Courses", path: "/admin/courses" },
  { label: "Block Candidates", path: "/admin/block" },
  { label: "Reports", path: "/admin/reports" },
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
    <aside className="w-64 h-full bg-white shadow-lg border-r flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-blue-600 tracking-tight">
          Admin Panel
        </h2>
      </div>
      <nav className="flex flex-col gap-1 px-4 pt-4 flex-grow">
        {navItems.map(({ label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`rounded px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
