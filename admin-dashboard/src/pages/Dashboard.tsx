import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Home, Book, UserX, BarChart3, HelpCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const dashboardCards = [
  {
    label: "Manage Courses",
    path: "/admin/courses",
    icon: <Book className="w-6 h-6" />,
    color: "bg-blue-500",
  },
  {
    label: "Assign Lecturer",
    path: "/admin/assign",
    icon: <Home className="w-6 h-6" />,
    color: "bg-cyan-500",
  },
  {
    label: "Block Candidates",
    path: "/admin/block",
    icon: <UserX className="w-6 h-6" />,
    color: "bg-red-500",
  },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "bg-purple-500",
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString();

  return (
    <DashboardLayout>
      <div className="px-6 py-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.email || "Admin"}!</h1>
          <p className="text-sm">Today is {today}. You have full access to manage candidates, courses, and lecturers.</p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map(({ label, path, icon, color }) => (
            <div
              key={label}
              onClick={() => navigate(path)}
              className={`cursor-pointer ${color} text-white rounded-xl p-6 shadow-lg flex flex-col items-start hover:scale-[1.03] transition`}
            >
              {icon}
              <h2 className="text-lg font-semibold mt-4">{label}</h2>
              <p className="text-sm opacity-80">Open {label}</p>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="flex items-center gap-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md">
          <HelpCircle className="text-yellow-600 w-6 h-6" />
          <p className="text-sm text-yellow-800">
            Reminder: Ensure all lecturers are assigned to courses before the semester starts.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
