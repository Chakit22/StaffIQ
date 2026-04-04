"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Position } from "@/types/Position";
import { Calendar, Users, Briefcase, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { staggerItem } from "@/lib/animations";

interface PositionCardProps {
  position: Position;
  onApply: (position: Position) => void;
}

export default function PositionCard({ position, onApply }: PositionCardProps) {
  const deadlineDate = new Date(position.deadline);
  const isExpired = deadlineDate < new Date();
  const daysLeft = Math.ceil(
    (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  return (
    <motion.div variants={staggerItem}>
      <Card className="shadow-md hover:shadow-xl transition-shadow duration-200 h-full">
        <CardContent className="p-5 flex flex-col gap-3 h-full">
          {/* Header */}
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <h3 className="text-lg font-bold truncate">{position.title}</h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {position.course.course_code} - {position.course.name}
                </span>
              </div>
            </div>
            <Badge
              variant={isExpired ? "destructive" : "default"}
              className="shrink-0"
            >
              {isExpired ? "Closed" : `${daysLeft}d left`}
            </Badge>
          </div>

          {/* Role */}
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">{position.role.name}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {position.description}
          </p>

          {/* Requirements */}
          {position.requirements && (
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Requirements
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {position.requirements}
              </p>
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-4 mt-auto pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>
                {position.positions_available} spot
                {position.positions_available !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{deadlineDate.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Apply button */}
          <Button
            onClick={() => onApply(position)}
            disabled={isExpired}
            className="w-full mt-1"
          >
            {isExpired ? "Deadline Passed" : "Apply Now"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
