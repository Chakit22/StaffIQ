import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Login | Secure Console";
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username.trim()) {
      setError("Username is required.");
      setLoading(false);
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid admin credentials.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      <div className="absolute opacity-10 right-16 bottom-16">
        <Lock size={200} />
      </div>

      <div className="w-full max-w-sm rounded-xl shadow-lg bg-white relative z-10">
        <div className="bg-cyan-500 text-white text-center py-4 rounded-t-xl text-lg font-semibold tracking-wide">
          Admin login
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
          {error && (
            <p className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <div className="relative">
            <User className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-b border-gray-300 focus:outline-none focus:border-cyan-500 placeholder-gray-400"
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-b border-gray-300 focus:outline-none focus:border-cyan-500 placeholder-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1 pl-1">
              Use admin / admin to login.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded mt-4 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
