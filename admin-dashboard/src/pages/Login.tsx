import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Login | StaffIQ";
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-5 shadow-glow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Staff<span className="text-primary">IQ</span>
          </h1>
          <p className="text-muted-text text-sm mt-2 tracking-wide">
            Administrative Console
          </p>
        </div>

        {/* Login card */}
        <div className="glass-panel-elevated p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 text-sm text-danger bg-danger/10 border border-danger/20 p-3 rounded-xl animate-fade-in">
                <div className="w-1.5 h-1.5 rounded-full bg-danger flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="text-[11px] text-muted-text uppercase tracking-[0.15em] font-semibold mb-2 block">
                Username
              </label>
              <div className="relative">
                <User
                  size={16}
                  className={`absolute top-1/2 left-4 transform -translate-y-1/2 transition-colors duration-200 ${
                    focusedField === "username" ? "text-primary" : "text-muted"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-muted-text uppercase tracking-[0.15em] font-semibold mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className={`absolute top-1/2 left-4 transform -translate-y-1/2 transition-colors duration-200 ${
                    focusedField === "password" ? "text-primary" : "text-muted"
                  }`}
                />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="input-field pl-11"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full flex items-center justify-center gap-2 mt-2 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-muted mt-6">
          Secure administrative access only
        </p>
      </div>
    </div>
  );
};

export default Login;
