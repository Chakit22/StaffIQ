"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Application } from "@/types/Application";
import { AllLecturerPreferences } from "@/services/StatsDataService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { fadeInUp } from "@/lib/animations";

export interface ComparisonViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applications: Application[];
  allPreferences: AllLecturerPreferences[];
}

function extractGpa(creds: string | null | undefined): number {
  if (!creds) return 0;
  const match = creds.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
}

function GpaBar({
  value,
  maxValue,
  label,
}: {
  value: number;
  maxValue: number;
  label: string;
}) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">
          {value > 0 ? value.toFixed(2) : "N/A"}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function SkillComparison({
  candidates,
}: {
  candidates: Application[];
}) {
  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    candidates.forEach((c) =>
      c.skills?.forEach((s) => skillSet.add(s.name)),
    );
    return Array.from(skillSet).sort();
  }, [candidates]);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground">Skills Comparison</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-3 text-muted-foreground font-medium">
                Skill
              </th>
              {candidates.map((c) => (
                <th
                  key={c.id}
                  className="text-center py-2 px-2 text-muted-foreground font-medium"
                >
                  {c.user.name.split(" ")[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allSkills.map((skill) => (
              <tr key={skill} className="border-b border-border/50">
                <td className="py-1.5 pr-3 text-foreground">{skill}</td>
                {candidates.map((c) => {
                  const has = c.skills?.some((s) => s.name === skill);
                  return (
                    <td key={c.id} className="text-center py-1.5 px-2">
                      {has ? (
                        <span className="inline-block w-5 h-5 rounded-full bg-green-500/20 text-green-400 leading-5 text-center">
                          &#10003;
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ComparisonView({
  open,
  onOpenChange,
  applications,
  allPreferences,
}: ComparisonViewProps) {
  const maxGpa = useMemo(
    () => Math.max(4.0, ...applications.map((a) => extractGpa(a.academic_creds))),
    [applications],
  );

  const rankData = useMemo(() => {
    return applications.map((app) => {
      const ranks: { lecturerName: string; rank: number | null }[] = [];
      allPreferences.forEach((lp) => {
        const found = lp.rankings.find((r) => r.applicationId === app.id);
        ranks.push({
          lecturerName: lp.lecturerName,
          rank: found ? found.rank : null,
        });
      });
      return { application: app, ranks };
    });
  }, [applications, allPreferences]);

  const experienceCounts = useMemo(
    () =>
      applications.map((a) => ({
        name: a.user.name,
        count: a.user.experiences?.length || 0,
      })),
    [applications],
  );

  if (applications.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Candidate Comparison</DialogTitle>
          <DialogDescription>
            Comparing {applications.length} candidates side by side
          </DialogDescription>
        </DialogHeader>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="space-y-6 mt-2"
        >
          {/* Candidate headers */}
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${applications.length}, 1fr)` }}>
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-3 rounded-lg border border-border bg-card text-center"
              >
                <div className="font-semibold text-foreground">
                  {app.user.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {app.role?.name}
                </div>
                <Badge variant="outline" className="text-xs mt-1">
                  {app.availability?.availability}
                </Badge>
              </div>
            ))}
          </div>

          {/* GPA Comparison */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">GPA Comparison</h4>
            <div className="space-y-2">
              {applications.map((app) => (
                <GpaBar
                  key={app.id}
                  value={extractGpa(app.academic_creds)}
                  maxValue={maxGpa}
                  label={app.user.name}
                />
              ))}
            </div>
          </div>

          {/* Ranking Comparison */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              Rankings by Lecturer
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-3 text-muted-foreground font-medium">
                      Lecturer
                    </th>
                    {applications.map((c) => (
                      <th
                        key={c.id}
                        className="text-center py-2 px-2 text-muted-foreground font-medium"
                      >
                        {c.user.name.split(" ")[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allPreferences.map((lp) => (
                    <tr
                      key={lp.lecturerId}
                      className="border-b border-border/50"
                    >
                      <td className="py-1.5 pr-3 text-foreground">
                        {lp.lecturerName}
                      </td>
                      {rankData.map((rd) => {
                        const entry = rd.ranks.find(
                          (r) => r.lecturerName === lp.lecturerName,
                        );
                        return (
                          <td
                            key={rd.application.id}
                            className="text-center py-1.5 px-2"
                          >
                            {entry?.rank != null ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                                {entry.rank}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/30">
                                -
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Experience Count */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              Experience
            </h4>
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${applications.length}, 1fr)` }}>
              {experienceCounts.map((e) => (
                <div
                  key={e.name}
                  className="p-3 rounded-lg border border-border bg-card text-center"
                >
                  <div className="text-2xl font-bold text-primary">
                    {e.count}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {e.count === 1 ? "experience" : "experiences"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Diff */}
          <SkillComparison candidates={applications} />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
