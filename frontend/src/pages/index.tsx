"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, glowOnHover } from "@/lib/animations";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.15)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(192,132,252,0.08)_0%,_transparent_50%)]" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-violet-400/8 rounded-full blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main card */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="relative bg-card/70 backdrop-blur-xl p-12 rounded-2xl border border-border shadow-2xl max-w-lg text-center space-y-8"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

        <motion.h1
          className="text-4xl md:text-5xl font-bold text-foreground relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            StaffIQ
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Smart solutions for structured academic staffing
        </motion.p>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex gap-4 justify-center mt-6 flex-wrap relative"
        >
          <motion.div variants={staggerItem} {...glowOnHover}>
            <Button
              onClick={() => router.push("/signin")}
              size="lg"
              className="px-8 text-base"
            >
              Sign In
            </Button>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Button
              variant="outline"
              size="lg"
              className="px-8 text-base border-primary/40 hover:border-primary hover:bg-primary/10"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.footer
        className="mt-12 text-sm text-muted-foreground bg-card/40 backdrop-blur-sm px-6 py-2 rounded-lg border border-border/50 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Built by Team StaffIQ
      </motion.footer>
    </div>
  );
}
