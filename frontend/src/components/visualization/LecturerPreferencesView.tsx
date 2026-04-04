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

export interface LecturerPreferencesViewProps {
  preferences: Array<{
    rank: number;
    application: Application;
  }>;
  courseName?: string;
  emptyMessage?: string;
}

export function LecturerPreferencesView({
  preferences,
  courseName,
  emptyMessage = "No preferences set for this course",
}: LecturerPreferencesViewProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">
          My Preferences {courseName && `for ${courseName}`}
        </h3>
        <Badge
          variant="outline"
          className="bg-primary/20 text-primary border-primary/30"
        >
          {preferences.length} ranked candidate
          {preferences.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {preferences.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          {emptyMessage}
        </Card>
      ) : (
        <div className="space-y-3">
          {preferences
            .sort((a, b) => a.rank - b.rank)
            .map((preference) => (
              <motion.div
                key={`${preference.application.id}-${preference.rank}`}
                variants={staggerItem}
                {...scaleOnHover}
              >
                <Card className="p-4 border-l-4 border-l-primary">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                          {preference.rank}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                          {preference.application.user.name}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {preference.application.role.name}
                          </span>
                          <span className="text-sm text-muted-foreground/50">
                            &bull;
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {
                              preference.application.availability
                                .availability
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {preference.application.skills &&
                    preference.application.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3 ml-12">
                        {preference.application.skills.map(
                          (skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill.name}
                            </Badge>
                          ),
                        )}
                      </div>
                    )}
                </Card>
              </motion.div>
            ))}
        </div>
      )}
    </motion.div>
  );
}
