"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthContext } from "@/context/UserProvider";
import {
  statsDataService,
  StatsData,
  LecturerPreferences,
  AllLecturerPreferences,
} from "@/services/StatsDataService";
import { Course } from "@/types/Course";
import { toast } from "sonner";
import Layout from "@/components/layout";
import LoaderComponent from "@/components/Loading";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CandidateStatsGrid } from "@/components/visualization/CandidateStatsGrid";
import { LecturerPreferencesView } from "@/components/visualization/LecturerPreferencesView";
import {
  ConsensusTable,
  ConsensusRow,
  buildConsensusExportData,
} from "@/components/visualization/ConsensusTable";
import { ComparisonView } from "@/components/visualization/ComparisonView";
import { exportConsensusCsv } from "@/utils/exportCsv";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const CHART_COLORS = ["#8b5cf6", "#c084fc", "#a78bfa", "#7c3aed", "#ddd6fe"];

const TOOLTIP_STYLE = {
  backgroundColor: "#1a1a2e",
  border: "1px solid #2d2d44",
  borderRadius: "8px",
  color: "#e2e8f0",
};

export default function StatsPage() {
  const { user, loading: userLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) router.replace("/signin");
  }, [userLoading, user, router]);

  if (userLoading) {
    return <LoaderComponent />;
  }

  return (
    <Layout>
      <StatsContent />
    </Layout>
  );
}

// Animated stat card component
function StatCard({
  label,
  value,
  color,
  delay = 0,
}: {
  label: string;
  value: number;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={staggerItem}
      className={`relative overflow-hidden rounded-xl border p-5 ${color}`}
    >
      <div className="relative z-10">
        <motion.div
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.2, duration: 0.4 }}
        >
          {value}
        </motion.div>
        <div className="text-sm mt-1 opacity-80">{label}</div>
      </div>
      <div className="absolute -right-3 -bottom-3 text-6xl font-black opacity-[0.07]">
        {value}
      </div>
    </motion.div>
  );
}

function StatsContent() {
  const { user } = useAuthContext();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseStats, setCourseStats] = useState<StatsData | null>(null);
  const [lecturerPreferences, setLecturerPreferences] =
    useState<LecturerPreferences | null>(null);
  const [allLecturerPrefs, setAllLecturerPrefs] = useState<
    AllLecturerPreferences[]
  >([]);

  // Comparison state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [compareOpen, setCompareOpen] = useState(false);

  // Fetch courses on mount
  useEffect(() => {
    if (!user?.id) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const coursesResponse = await statsDataService.getLecturerCourses(
          user.id,
        );

        if (coursesResponse.success) {
          const fetchedCourses = coursesResponse.body as Course[];
          setCourses(fetchedCourses);
          if (fetchedCourses.length > 0) {
            setSelectedCourseId(fetchedCourses[0].id);
          }
        } else {
          toast.error(coursesResponse.message || "Failed to fetch courses");
        }
      } catch {
        toast.error("An error occurred while loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [user?.id]);

  // Fetch course data when selection changes
  useEffect(() => {
    if (!user?.id || !selectedCourseId) return;

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setSelectedIds(new Set());

        // Fetch stats and own preferences in parallel
        const [statsResponse, preferencesResponse] = await Promise.all([
          statsDataService.getCourseStats(selectedCourseId),
          statsDataService.getLecturerPreferences(selectedCourseId, user.id),
        ]);

        if (statsResponse.success) {
          setCourseStats(statsResponse.body as StatsData);
        } else {
          toast.error(
            statsResponse.message || "Failed to fetch course statistics",
          );
          setCourseStats(null);
        }

        if (preferencesResponse.success) {
          setLecturerPreferences(
            preferencesResponse.body as LecturerPreferences,
          );
        } else {
          setLecturerPreferences(null);
        }

        // Fetch all lecturers' preferences for consensus table
        const lecturersResponse =
          await statsDataService.getCourseLecturers(selectedCourseId);
        if (lecturersResponse.success) {
          const lecturers = lecturersResponse.body || [];
          const nameMap = new Map(
            lecturers.map((l) => [l.id, l.name]),
          );
          const lecturerIds = lecturers.map((l) => l.id);

          const allPrefsResponse =
            await statsDataService.getAllLecturerPreferences(
              selectedCourseId,
              lecturerIds,
              nameMap,
            );
          if (allPrefsResponse.success) {
            setAllLecturerPrefs(allPrefsResponse.body || []);
          }
        }
      } catch {
        toast.error("An error occurred while loading course data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [selectedCourseId, user?.id]);

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId,
  );

  // Combine all applications for consensus table
  const allApplications = useMemo(() => {
    if (!courseStats) return [];
    return [
      ...courseStats.mostChosenCandidates,
      ...courseStats.leastChosenCandidates,
      ...courseStats.unchosenCandidates,
    ];
  }, [courseStats]);

  // Build chart data
  const roleDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    allApplications.forEach((c) => {
      const role = c.role?.name || "Unknown";
      map[role] = (map[role] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [allApplications]);

  const availabilityDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    allApplications.forEach((c) => {
      const avail = c.availability?.availability || "Unknown";
      map[avail] = (map[avail] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [allApplications]);

  // Ranking distribution for horizontal bar chart
  const rankingDistribution = useMemo(() => {
    if (allLecturerPrefs.length === 0) return [];
    const rankCounts: Record<number, number> = {};
    allLecturerPrefs.forEach((lp) => {
      lp.rankings.forEach((r) => {
        rankCounts[r.rank] = (rankCounts[r.rank] || 0) + 1;
      });
    });
    return Object.entries(rankCounts)
      .map(([rank, count]) => ({
        rank: `Rank ${rank}`,
        count,
      }))
      .sort(
        (a, b) =>
          parseInt(a.rank.split(" ")[1]) - parseInt(b.rank.split(" ")[1]),
      );
  }, [allLecturerPrefs]);

  // Comparison candidates
  const comparisonCandidates = useMemo(() => {
    return allApplications.filter((a) => selectedIds.has(a.id));
  }, [allApplications, selectedIds]);

  const handleCompare = useCallback(() => {
    if (selectedIds.size >= 2) {
      setCompareOpen(true);
    }
  }, [selectedIds]);

  // CSV export
  const handleExport = useCallback(() => {
    if (!courseStats || allApplications.length === 0) return;

    // Build consensus data from current state
    const rows: ConsensusRow[] = allApplications.map((app) => {
      const ranksByLecturer = new Map<string, number>();
      allLecturerPrefs.forEach((lp) => {
        const ranking = lp.rankings.find((r) => r.applicationId === app.id);
        if (ranking) ranksByLecturer.set(lp.lecturerId, ranking.rank);
      });
      const ranks = Array.from(ranksByLecturer.values());
      // Simplified consensus calc for export
      let score = 0;
      let label = "unranked";
      if (ranks.length > 0) {
        const mean = ranks.reduce((a, b) => a + b, 0) / ranks.length;
        const variance =
          ranks.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
          ranks.length;
        const stdDev = Math.sqrt(variance);
        score = Math.max(0, 1 - stdDev / 5);
        const coverage = ranks.length / allLecturerPrefs.length;
        const adjusted = score * 0.7 + coverage * 0.3;
        label =
          adjusted >= 0.7
            ? "agree"
            : adjusted >= 0.4
              ? "moderate"
              : "disagree";
        score = adjusted;
      }
      return {
        application: app,
        ranksByLecturer,
        totalRanked: ranks.length,
        consensusScore: score,
        consensusLabel: label as ConsensusRow["consensusLabel"],
      };
    });

    const { lecturerRankings, lecturerNames, consensusScores } =
      buildConsensusExportData(rows, allLecturerPrefs);

    exportConsensusCsv(
      allApplications,
      lecturerRankings,
      lecturerNames,
      consensusScores,
      selectedCourse?.name || "Course",
    );
    toast.success("CSV exported successfully");
  }, [courseStats, allApplications, allLecturerPrefs, selectedCourse]);

  return (
    <div className="bg-background text-foreground flex flex-col gap-6 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-card/50 shadow-sm p-6 border-b border-border">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-3xl font-bold text-foreground">
            Course Statistics
          </h1>
          <div
            className="text-sm cursor-pointer text-primary hover:text-accent transition-colors"
            onClick={() => router.push("/lecturer")}
          >
            &larr; Back to Lecturer Dashboard
          </div>
        </div>
      </div>

      {/* Course Filter + Export */}
      <div className="container mx-auto px-4">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Course Selection</h2>
            <div className="flex items-center gap-3">
              <Select
                value={selectedCourseId}
                onValueChange={setSelectedCourseId}
                disabled={loading || courses.length === 0}
              >
                <SelectTrigger className="w-full sm:w-96">
                  <SelectValue placeholder="Select a course to view statistics" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!loading && allApplications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                >
                  Export CSV
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Loading */}
      {loading && (
        <div className="container mx-auto px-4">
          <LoaderComponent />
        </div>
      )}

      {/* Main Content */}
      {!loading && selectedCourseId && (
        <div className="container mx-auto px-4 space-y-8">
          {/* Animated Summary Stat Cards */}
          {courseStats && (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <StatCard
                label="Total Candidates"
                value={allApplications.length}
                color="bg-primary/10 text-primary border-primary/20"
                delay={0}
              />
              <StatCard
                label="Most Chosen"
                value={courseStats.mostChosenCandidates.length}
                color="bg-green-900/20 text-green-400 border-green-800/30"
                delay={0.1}
              />
              <StatCard
                label="Least Chosen"
                value={courseStats.leastChosenCandidates.length}
                color="bg-yellow-900/20 text-yellow-400 border-yellow-800/30"
                delay={0.2}
              />
              <StatCard
                label="Unchosen"
                value={courseStats.unchosenCandidates.length}
                color="bg-muted text-muted-foreground border-border"
                delay={0.3}
              />
            </motion.div>
          )}

          {/* Consensus Table */}
          {courseStats && allLecturerPrefs.length > 0 && (
            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <Card className="p-6">
                <ConsensusTable
                  applications={allApplications}
                  allPreferences={allLecturerPrefs}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  onCompare={handleCompare}
                />
              </Card>
            </motion.div>
          )}

          {/* Comparison Modal */}
          <ComparisonView
            open={compareOpen}
            onOpenChange={setCompareOpen}
            applications={comparisonCandidates}
            allPreferences={allLecturerPrefs}
          />

          {/* My Preferences */}
          {lecturerPreferences && (
            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <Card className="p-6">
                <LecturerPreferencesView
                  preferences={lecturerPreferences.rankings.map(
                    (ranking) => ({
                      rank: ranking.rank,
                      application: ranking.application,
                    }),
                  )}
                  courseName={selectedCourse?.name}
                />
              </Card>
            </motion.div>
          )}

          {/* Charts Section */}
          {courseStats && (
            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <Card className="p-6">
                <CardTitle className="text-center mb-6">
                  Distribution Charts
                </CardTitle>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Role Distribution */}
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h3 className="text-sm font-semibold mb-3 text-center text-muted-foreground">
                      Role Distribution
                    </h3>
                    <div style={{ minHeight: "220px" }}>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={roleDistribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            label
                          >
                            {roleDistribution.map((_, index) => (
                              <Cell
                                key={`role-${index}`}
                                fill={
                                  CHART_COLORS[
                                    index % CHART_COLORS.length
                                  ]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={TOOLTIP_STYLE} />
                          <Legend
                            wrapperStyle={{
                              color: "#e2e8f0",
                              fontSize: "12px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Availability Distribution */}
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h3 className="text-sm font-semibold mb-3 text-center text-muted-foreground">
                      Availability Distribution
                    </h3>
                    <div style={{ minHeight: "220px" }}>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={availabilityDistribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            label
                          >
                            {availabilityDistribution.map((_, index) => (
                              <Cell
                                key={`avail-${index}`}
                                fill={
                                  CHART_COLORS[
                                    index % CHART_COLORS.length
                                  ]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={TOOLTIP_STYLE} />
                          <Legend
                            wrapperStyle={{
                              color: "#e2e8f0",
                              fontSize: "12px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Ranking Distribution Bar Chart */}
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <h3 className="text-sm font-semibold mb-3 text-center text-muted-foreground">
                      Ranking Distribution
                    </h3>
                    <div style={{ minHeight: "220px" }}>
                      {rankingDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart
                            data={rankingDistribution}
                            layout="vertical"
                            margin={{
                              left: 10,
                              right: 20,
                              top: 5,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#2d2d44"
                              horizontal={false}
                            />
                            <XAxis
                              type="number"
                              tick={{ fill: "#e2e8f0", fontSize: 12 }}
                              axisLine={{ stroke: "#2d2d44" }}
                            />
                            <YAxis
                              type="category"
                              dataKey="rank"
                              tick={{ fill: "#e2e8f0", fontSize: 12 }}
                              axisLine={{ stroke: "#2d2d44" }}
                              width={60}
                            />
                            <Tooltip contentStyle={TOOLTIP_STYLE} />
                            <Bar
                              dataKey="count"
                              fill="#8b5cf6"
                              radius={[0, 4, 4, 0]}
                              barSize={20}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                          No rankings yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Detailed Grid Views */}
          {courseStats && (
            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <Card className="p-6">
                <CardTitle className="text-center mb-6">
                  Detailed Candidate Information
                </CardTitle>
                <div className="space-y-8">
                  <CandidateStatsGrid
                    title="Most Chosen Candidates"
                    candidates={courseStats.mostChosenCandidates}
                    categoryColor="green"
                    emptyMessage="No candidates have been highly ranked yet"
                  />
                  <CandidateStatsGrid
                    title="Least Chosen Candidates"
                    candidates={courseStats.leastChosenCandidates}
                    categoryColor="yellow"
                    emptyMessage="All candidates are equally preferred"
                  />
                  <CandidateStatsGrid
                    title="Unchosen Candidates"
                    candidates={courseStats.unchosenCandidates}
                    categoryColor="gray"
                    emptyMessage="All candidates have been ranked by lecturers"
                  />
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && courses.length === 0 && (
        <div className="container mx-auto px-4">
          <Card className="p-12 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Courses Assigned
            </h3>
            <p className="text-muted-foreground">
              You don&apos;t have any courses assigned yet. Contact the
              administrator to get course assignments.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
