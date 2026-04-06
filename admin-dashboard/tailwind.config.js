module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#06060b",
        card: "#0f0f1a",
        "card-elevated": "#161625",
        border: "#1e1e35",
        "border-glow": "#8b5cf640",
        primary: "#8b5cf6",
        "primary-hover": "#a78bfa",
        accent: "#c084fc",
        "accent-dim": "#c084fc30",
        muted: "#525278",
        "muted-text": "#8888aa",
        surface: "#12121f",
        success: "#22c55e",
        danger: "#ef4444",
        warning: "#f59e0b",
      },
      boxShadow: {
        glow: "0 0 20px rgba(139, 92, 246, 0.15)",
        "glow-lg": "0 0 40px rgba(139, 92, 246, 0.2)",
        "glow-accent": "0 0 30px rgba(192, 132, 252, 0.12)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(ellipse at top, var(--tw-gradient-stops))",
        "gradient-mesh": "radial-gradient(at 40% 20%, rgba(139, 92, 246, 0.08) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(192, 132, 252, 0.05) 0px, transparent 50%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
