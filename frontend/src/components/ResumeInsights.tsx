"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface ResumeInsightsProps {
  score: number;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
}

export default function ResumeInsights({
  score,
  strengths,
  gaps,
  suggestions,
}: ResumeInsightsProps) {
  const getScoreColor = (s: number) => {
    if (s >= 75) return "text-green-400";
    if (s >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreRingColor = (s: number) => {
    if (s >= 75) return "stroke-green-400";
    if (s >= 50) return "stroke-yellow-400";
    return "stroke-red-400";
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-5"
    >
      {/* Score Circle */}
      <motion.div variants={staggerItem} className="flex justify-center">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-border"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="8"
              strokeDasharray={`${(score / 100) * 264} 264`}
              strokeLinecap="round"
              className={getScoreRingColor(score)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-xs text-muted-foreground">Match</span>
          </div>
        </div>
      </motion.div>

      {/* Strengths */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <h4 className="font-semibold text-green-400 text-sm">Strengths</h4>
        </div>
        <ul className="space-y-1.5">
          {strengths.map((s, i) => (
            <li
              key={i}
              className="text-sm text-foreground bg-green-900/20 border border-green-800/30 rounded-md px-3 py-2"
            >
              {s}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Gaps */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <h4 className="font-semibold text-yellow-400 text-sm">Gaps</h4>
        </div>
        <ul className="space-y-1.5">
          {gaps.map((g, i) => (
            <li
              key={i}
              className="text-sm text-foreground bg-yellow-900/20 border border-yellow-800/30 rounded-md px-3 py-2"
            >
              {g}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Suggestions */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-accent" />
          <h4 className="font-semibold text-accent text-sm">Suggestions</h4>
        </div>
        <ul className="space-y-1.5">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="text-sm text-foreground bg-primary/10 border border-primary/20 rounded-md px-3 py-2"
            >
              {s}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
