"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Application } from "@/types/Application";
import { AllLecturerPreferences } from "@/services/StatsDataService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { staggerContainer, staggerItem } from "@/lib/animations";

export interface ConsensusRow {
  application: Application;
  ranksByLecturer: Map<string, number>;
  totalRanked: number;
  consensusScore: number;
  consensusLabel: "agree" | "moderate" | "disagree" | "unranked";
}

export interface ConsensusTableProps {
  applications: Application[];
  allPreferences: AllLecturerPreferences[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onCompare: () => void;
}

function extractGpa(creds: string | null | undefined): number {
  if (!creds) return 0;
  const match = creds.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
}

function computeConsensus(
  ranks: number[],
  totalLecturers: number,
): { score: number; label: "agree" | "moderate" | "disagree" | "unranked" } {
  if (ranks.length === 0) {
    return { score: 0, label: "unranked" };
  }
  if (ranks.length === 1) {
    return { score: 1, label: totalLecturers === 1 ? "agree" : "moderate" };
  }

  const mean = ranks.reduce((a, b) => a + b, 0) / ranks.length;
  const variance =
    ranks.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / ranks.length;
  const stdDev = Math.sqrt(variance);

  // Normalize: lower stdDev = higher consensus
  // Score from 0 to 1 where 1 = perfect agreement
  const maxPossibleStdDev = 5;
  const score = Math.max(0, 1 - stdDev / maxPossibleStdDev);

  // Factor in coverage (what fraction of lecturers ranked this candidate)
  const coverage = ranks.length / totalLecturers;
  const adjustedScore = score * 0.7 + coverage * 0.3;

  if (adjustedScore >= 0.7) return { score: adjustedScore, label: "agree" };
  if (adjustedScore >= 0.4) return { score: adjustedScore, label: "moderate" };
  return { score: adjustedScore, label: "disagree" };
}

const consensusColors = {
  agree: "bg-green-500/20 text-green-400 border-green-500/30",
  moderate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  disagree: "bg-red-500/20 text-red-400 border-red-500/30",
  unranked: "bg-muted text-muted-foreground border-border",
};

const consensusDots = {
  agree: "bg-green-400",
  moderate: "bg-yellow-400",
  disagree: "bg-red-400",
  unranked: "bg-muted-foreground/50",
};

export function ConsensusTable({
  applications,
  allPreferences,
  selectedIds,
  onSelectionChange,
  onCompare,
}: ConsensusTableProps) {
  const [sortBy, setSortBy] = useState<"name" | "gpa" | "consensus">(
    "consensus",
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const lecturers = useMemo(
    () =>
      allPreferences.map((p) => ({
        id: p.lecturerId,
        name: p.lecturerName,
      })),
    [allPreferences],
  );

  const rows: ConsensusRow[] = useMemo(() => {
    return applications.map((app) => {
      const ranksByLecturer = new Map<string, number>();

      allPreferences.forEach((lp) => {
        const ranking = lp.rankings.find((r) => r.applicationId === app.id);
        if (ranking) {
          ranksByLecturer.set(lp.lecturerId, ranking.rank);
        }
      });

      const ranks = Array.from(ranksByLecturer.values());
      const { score, label } = computeConsensus(ranks, lecturers.length);

      return {
        application: app,
        ranksByLecturer,
        totalRanked: ranks.length,
        consensusScore: score,
        consensusLabel: label,
      };
    });
  }, [applications, allPreferences, lecturers.length]);

  const sortedRows = useMemo(() => {
    const sorted = [...rows];
    sorted.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "name":
          cmp = a.application.user.name.localeCompare(
            b.application.user.name,
          );
          break;
        case "gpa":
          cmp =
            extractGpa(a.application.academic_creds) -
            extractGpa(b.application.academic_creds);
          break;
        case "consensus":
          cmp = a.consensusScore - b.consensusScore;
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [rows, sortBy, sortDir]);

  const toggleSort = (col: "name" | "gpa" | "consensus") => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === sortedRows.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(sortedRows.map((r) => r.application.id)));
    }
  };

  const SortIcon = ({ col }: { col: "name" | "gpa" | "consensus" }) => {
    if (sortBy !== col)
      return <span className="text-muted-foreground/30 ml-1">&#x2195;</span>;
    return (
      <span className="text-primary ml-1">
        {sortDir === "asc" ? "\u2191" : "\u2193"}
      </span>
    );
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-primary">
            Consensus Rankings
          </h3>
          <Badge
            variant="outline"
            className="bg-primary/20 text-primary border-primary/30"
          >
            {applications.length} candidate
            {applications.length !== 1 ? "s" : ""}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Button size="sm" onClick={onCompare}>
                Compare {selectedIds.size} Selected
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground rounded-lg border border-border">
          No candidates to display
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-10">
                  <Checkbox
                    checked={
                      selectedIds.size === sortedRows.length &&
                      sortedRows.length > 0
                    }
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => toggleSort("name")}
                >
                  Candidate
                  <SortIcon col="name" />
                </TableHead>
                <TableHead>Role</TableHead>
                {lecturers.map((lec) => (
                  <TableHead
                    key={lec.id}
                    className="text-center"
                    title={lec.name}
                  >
                    <span className="truncate max-w-[100px] inline-block">
                      {lec.name.split(" ")[0]}
                    </span>
                  </TableHead>
                ))}
                <TableHead
                  className="text-center cursor-pointer select-none"
                  onClick={() => toggleSort("gpa")}
                >
                  GPA
                  <SortIcon col="gpa" />
                </TableHead>
                <TableHead className="text-center">Ranked By</TableHead>
                <TableHead
                  className="text-center cursor-pointer select-none"
                  onClick={() => toggleSort("consensus")}
                >
                  Consensus
                  <SortIcon col="consensus" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((row) => (
                <motion.tr
                  key={row.application.id}
                  variants={staggerItem}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(row.application.id)}
                      onCheckedChange={() =>
                        toggleSelection(row.application.id)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium text-foreground">
                        {row.application.user.name}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {row.application.user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {row.application.role?.name}
                    </Badge>
                  </TableCell>
                  {lecturers.map((lec) => {
                    const rank = row.ranksByLecturer.get(lec.id);
                    return (
                      <TableCell key={lec.id} className="text-center">
                        {rank !== undefined ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                            {rank}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">-</span>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center">
                    <span className="text-foreground font-medium">
                      {extractGpa(row.application.academic_creds) || "-"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-muted-foreground">
                      {row.totalRanked}/{lecturers.length}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${consensusDots[row.consensusLabel]}`}
                      />
                      <Badge
                        variant="outline"
                        className={`text-xs ${consensusColors[row.consensusLabel]}`}
                      >
                        {row.consensusLabel === "unranked"
                          ? "Unranked"
                          : row.consensusLabel.charAt(0).toUpperCase() +
                            row.consensusLabel.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          Agree (lecturers rank similarly)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          Moderate
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          Disagree
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
          Unranked
        </span>
      </div>
    </motion.div>
  );
}

// Helper to build export data from consensus table state
export function buildConsensusExportData(
  rows: ConsensusRow[],
  allPreferences: AllLecturerPreferences[],
) {
  const lecturerRankings = new Map<string, Map<string, number>>();
  const lecturerNames = new Map<string, string>();

  allPreferences.forEach((lp) => {
    lecturerNames.set(lp.lecturerId, lp.lecturerName);
    const rankMap = new Map<string, number>();
    lp.rankings.forEach((r) => rankMap.set(r.applicationId, r.rank));
    lecturerRankings.set(lp.lecturerId, rankMap);
  });

  const consensusScores = new Map<
    string,
    { score: number; label: string }
  >();
  rows.forEach((row) => {
    consensusScores.set(row.application.id, {
      score: row.consensusScore,
      label: row.consensusLabel,
    });
  });

  return { lecturerRankings, lecturerNames, consensusScores };
}
