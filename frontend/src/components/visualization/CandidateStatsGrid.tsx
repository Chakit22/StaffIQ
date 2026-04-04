"use client";

import { motion } from "framer-motion";
import { Application } from "@/types/Application";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  staggerContainer,
  staggerItem,
  scaleOnHover,
} from "@/lib/animations";

export interface CandidateStatsGridProps {
  title: string;
  candidates: Application[];
  categoryColor: "green" | "yellow" | "gray";
  emptyMessage?: string;
}

export function CandidateStatsGrid({
  title,
  candidates,
  categoryColor,
  emptyMessage = "No candidates in this category",
}: CandidateStatsGridProps) {
  const colorClasses = {
    green: "bg-green-900/30 text-green-400 border-green-800",
    yellow: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
    gray: "bg-muted text-muted-foreground border-border",
  };

  const accentBorder = {
    green: "border-l-green-500",
    yellow: "border-l-yellow-500",
    gray: "border-l-muted-foreground/30",
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <Badge variant="outline" className={colorClasses[categoryColor]}>
          {candidates.length} candidate{candidates.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {candidates.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          {emptyMessage}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((candidate) => (
            <motion.div
              key={candidate.id}
              variants={staggerItem}
              {...scaleOnHover}
            >
              <Card
                className={`p-4 border-l-4 ${accentBorder[categoryColor]} hover:shadow-md hover:shadow-primary/5 transition-shadow border-border`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-foreground">
                      {candidate.user.name}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {candidate.role.name}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Course:</span>{" "}
                      {candidate.course.name}
                    </div>
                    <div>
                      <span className="font-medium">Availability:</span>{" "}
                      {candidate.availability.availability}
                    </div>
                  </div>

                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {candidate.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {candidate.academic_creds && (
                    <div className="text-xs text-muted-foreground mt-2">
                      <span className="font-medium">GPA:</span>{" "}
                      {candidate.academic_creds}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
