/**
 * CONTAINER COMPONENT - Stats Page Coordinator
 *
 * This component implements the Container/Presentation Component pattern,
 * serving as the coordination layer between data services and visualization components.
 *
 * ARCHITECTURAL RESPONSIBILITIES:
 * 1. ORCHESTRATION: Coordinates data fetching through service layer
 * 2. STATE MANAGEMENT: Manages UI state (loading, selected course, error handling)
 * 3. DATA TRANSFORMATION: Adapts service layer data for visualization components
 * 4. USER INTERACTION: Handles course selection and filter changes
 *
 * This approach ensures that:
 * - Business logic stays in the service layer
 * - Presentation logic stays in visualization components
 * - This component only handles coordination and state management
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/UserProvider";
import {
  statsDataService,
  StatsData,
  LecturerPreferences,
} from "@/services/StatsDataService";
import { Course } from "@/types/Course";
import { toast } from "sonner";
import Layout from "@/components/layout";
import LoaderComponent from "@/components/Loading";
import { Card } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
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
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CHART_COLORS = ["#8b5cf6", "#c084fc", "#a78bfa", "#7c3aed"];

export default function StatsPage() {
  const { user, loading: userLoading } = useAuthContext();
  const router = useRouter();

  // Redirect to signin if not logged in
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

/**
 * Main stats content component - handles data coordination
 * Separates data fetching logic from the page wrapper
 */
function StatsContent() {
  const { user } = useAuthContext();
  const router = useRouter();

  // UI State Management
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  // Data State - structured to match service layer outputs
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseStats, setCourseStats] = useState<StatsData | null>(null);
  const [lecturerPreferences, setLecturerPreferences] =
    useState<LecturerPreferences | null>(null);

  // Data fetching effects - delegates to service layer
  useEffect(() => {
    if (!user?.id) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch courses assigned to lecturer using service layer
        const coursesResponse = await statsDataService.getLecturerCourses(
          user.id
        );

        if (coursesResponse.success) {
          const fetchedCourses = coursesResponse.body as Course[];
          setCourses(fetchedCourses);

          // Auto-select first course if available
          if (fetchedCourses.length > 0) {
            setSelectedCourseId(fetchedCourses[0].id);
          }
        } else {
          toast.error(coursesResponse.message || "Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("An error occurred while loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [user?.id]);

  // Effect for fetching course-specific data when course selection changes
  useEffect(() => {
    if (!user?.id || !selectedCourseId) return;

    const fetchCourseData = async () => {
      try {
        setLoading(true);

        // Fetch course stats and lecturer preferences in parallel
        const [statsResponse, preferencesResponse] = await Promise.all([
          statsDataService.getCourseStats(selectedCourseId),
          statsDataService.getLecturerPreferences(selectedCourseId, user.id),
        ]);

        if (statsResponse.success) {
          setCourseStats(statsResponse.body as StatsData);
        } else {
          toast.error(
            statsResponse.message || "Failed to fetch course statistics"
          );
          setCourseStats(null);
        }

        if (preferencesResponse.success) {
          setLecturerPreferences(
            preferencesResponse.body as LecturerPreferences
          );
        } else {
          toast.error(
            preferencesResponse.message || "Failed to fetch preferences"
          );
          setLecturerPreferences(null);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast.error("An error occurred while loading course data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [selectedCourseId, user?.id]);

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId
  );

  return (
    <div className="bg-background text-foreground flex flex-col gap-6 min-h-screen">
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
            ← Back to Lecturer Dashboard
          </div>
        </div>
      </div>

      {/* Course Filter */}
      <div className="container mx-auto px-4">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Course Selection</h2>
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
          </div>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="container mx-auto px-4">
          <LoaderComponent />
        </div>
      )}

      {/* Main Content */}
      {!loading && selectedCourseId && (
        <div className="container mx-auto px-4 space-y-8">
          {/* Lecturer Preferences Section */}
          {lecturerPreferences && (
            <Card className="p-6">
              <LecturerPreferencesView
                preferences={lecturerPreferences.rankings.map((ranking) => ({
                  rank: ranking.rank,
                  application: ranking.application,
                }))}
                courseName={selectedCourse?.name}
              />
            </Card>
          )}

          {/* Course Statistics Section */}
          {courseStats && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <Card className="p-6">
                <CardTitle className="text-center">Summary Stats</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-primary/20 text-primary p-4 rounded-lg border border-primary/20">
                    Total:{" "}
                    {courseStats.mostChosenCandidates.length +
                      courseStats.leastChosenCandidates.length +
                      courseStats.unchosenCandidates.length}
                  </div>
                  <div className="bg-green-900/20 text-green-400 p-4 rounded-lg border border-green-800/30">
                    Most Chosen: {courseStats.mostChosenCandidates.length}
                  </div>
                  <div className="bg-yellow-900/20 text-yellow-400 p-4 rounded-lg border border-yellow-800/30">
                    Least Chosen: {courseStats.leastChosenCandidates.length}
                  </div>
                </div>
              </Card>

              {/* Distribution Charts */}
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Role Distribution */}
                  <div className="bg-card p-6 rounded-lg border border-border overflow-hidden">
                    <h2 className="text-lg font-semibold mb-4 text-center">
                      Role Distribution
                    </h2>
                    <div style={{ minHeight: "250px" }}>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={(() => {
                              const allCandidates = [
                                ...courseStats.mostChosenCandidates,
                                ...courseStats.leastChosenCandidates,
                                ...courseStats.unchosenCandidates,
                              ];
                              const roleMap: Record<string, number> = {};
                              allCandidates.forEach((candidate) => {
                                const role = candidate.role?.name || "Unknown";
                                roleMap[role] = (roleMap[role] || 0) + 1;
                              });
                              return Object.entries(roleMap).map(
                                ([name, value]) => ({ name, value })
                              );
                            })()}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {(() => {
                              const allCandidates = [
                                ...courseStats.mostChosenCandidates,
                                ...courseStats.leastChosenCandidates,
                                ...courseStats.unchosenCandidates,
                              ];
                              const roleMap: Record<string, number> = {};
                              allCandidates.forEach((candidate) => {
                                const role = candidate.role?.name || "Unknown";
                                roleMap[role] = (roleMap[role] || 0) + 1;
                              });
                              return Object.entries(roleMap).map((_, index) => (
                                <Cell
                                  key={`role-cell-${index}`}
                                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                                />
                              ));
                            })()}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a1a2e",
                              border: "1px solid #2d2d44",
                              borderRadius: "8px",
                              color: "#e2e8f0",
                            }}
                          />
                          <Legend
                            wrapperStyle={{ color: "#e2e8f0" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Availability Distribution */}
                  <div className="bg-card p-6 rounded-lg border border-border overflow-hidden">
                    <h2 className="text-lg font-semibold mb-4 text-center">
                      Availability Distribution
                    </h2>
                    <div style={{ minHeight: "250px" }}>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={(() => {
                              const allCandidates = [
                                ...courseStats.mostChosenCandidates,
                                ...courseStats.leastChosenCandidates,
                                ...courseStats.unchosenCandidates,
                              ];
                              const availabilityMap: Record<string, number> =
                                {};
                              allCandidates.forEach((candidate) => {
                                const availability =
                                  candidate.availability?.availability ||
                                  "Unknown";
                                availabilityMap[availability] =
                                  (availabilityMap[availability] || 0) + 1;
                              });
                              return Object.entries(availabilityMap).map(
                                ([name, value]) => ({ name, value })
                              );
                            })()}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {(() => {
                              const allCandidates = [
                                ...courseStats.mostChosenCandidates,
                                ...courseStats.leastChosenCandidates,
                                ...courseStats.unchosenCandidates,
                              ];
                              const availabilityMap: Record<string, number> =
                                {};
                              allCandidates.forEach((candidate) => {
                                const availability =
                                  candidate.availability?.availability ||
                                  "Unknown";
                                availabilityMap[availability] =
                                  (availabilityMap[availability] || 0) + 1;
                              });
                              return Object.entries(availabilityMap).map(
                                (_, index) => (
                                  <Cell
                                    key={`availability-cell-${index}`}
                                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                                  />
                                )
                              );
                            })()}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a1a2e",
                              border: "1px solid #2d2d44",
                              borderRadius: "8px",
                              color: "#e2e8f0",
                            }}
                          />
                          <Legend
                            wrapperStyle={{ color: "#e2e8f0" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Detailed Grid Views */}
              <Card className="p-6">
                <CardTitle className="text-center mb-6">
                  Detailed Candidate Information
                </CardTitle>

                <div className="space-y-8">
                  {/* Most Chosen Candidates */}
                  <CandidateStatsGrid
                    title="Most Chosen Candidates"
                    candidates={courseStats.mostChosenCandidates}
                    categoryColor="green"
                    emptyMessage="No candidates have been highly ranked yet"
                  />

                  {/* Least Chosen Candidates */}
                  <CandidateStatsGrid
                    title="Least Chosen Candidates"
                    candidates={courseStats.leastChosenCandidates}
                    categoryColor="yellow"
                    emptyMessage="All candidates are equally preferred"
                  />

                  {/* Unchosen Candidates */}
                  <CandidateStatsGrid
                    title="Unchosen Candidates"
                    candidates={courseStats.unchosenCandidates}
                    categoryColor="gray"
                    emptyMessage="All candidates have been ranked by lecturers"
                  />
                </div>
              </Card>
            </div>
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
