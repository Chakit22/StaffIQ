"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Checkbox } from "./ui/checkbox";
import { useQueryState } from "nuqs";
import LoaderComponent from "./Loading";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, Sparkles, Loader2, X } from "lucide-react";
import z from "zod";
import { useAuthContext } from "@/context/UserProvider";
import useUser from "@/hooks/useUser";
import { Application } from "@/types/Application";
import { Course } from "@/types/Course";
import useRole from "@/hooks/useRole";
import { Role } from "@/types/Role";
import { Availability } from "@/types/Availability";
import useAvailability from "@/hooks/useAvailability";
import useSkill from "@/hooks/useSkill";
import { Skill } from "@/types/Skill";
import { toast } from "sonner";
import useApplication from "@/hooks/useApplication";
import FilterSidebar from "./FilterSidebar";
import { ApplicationRankingEditor } from "./ApplicationRankingEditor";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, scaleOnHover } from "@/lib/animations";
import useAI from "@/hooks/useAI";

export default function LecturerComponent() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  const [id] = useQueryState("id", z.string().uuid().optional());

  const { getAllCoursesAssigned } = useUser();
  const [coursesAssigned, setCoursesAssigned] = useState<Course[]>([]);

  const { getAllRoles } = useRole();
  const [roles, setRoles] = useState<Role[]>([]);

  const { getAllAvailabilities } = useAvailability();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);

  const { getAllSkills } = useSkill();
  const [skills, setSkills] = useState<Skill[]>([]);

  const {
    getAllApplications,
    selectCandidate,
    getLecturerRankings,
    deleteRanking,
  } = useApplication();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);

  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(
    new Set()
  );
  const [rankedApplications, setRankedApplications] = useState<Application[]>(
    []
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadingRankings, setIsLoadingRankings] = useState<boolean>(false);
  const [showRankingEditor, setShowRankingEditor] = useState<boolean>(false);

  // Expanded cover letters
  const [expandedCoverLetters, setExpandedCoverLetters] = useState<Set<string>>(
    new Set()
  );

  // AI Insights
  const { getCandidateSummary } = useAI();
  const [aiSummaries, setAiSummaries] = useState<Record<string, string>>({});
  const [loadingAI, setLoadingAI] = useState<Record<string, boolean>>({});
  const [showAISummary, setShowAISummary] = useState<string | null>(null);

  const handleAIInsights = async (applicationId: string) => {
    if (aiSummaries[applicationId]) {
      setShowAISummary(
        showAISummary === applicationId ? null : applicationId,
      );
      return;
    }

    setLoadingAI((prev) => ({ ...prev, [applicationId]: true }));
    try {
      const response = await getCandidateSummary(applicationId);
      if (response.success && response.body?.summary) {
        setAiSummaries((prev) => ({
          ...prev,
          [applicationId]: response.body!.summary,
        }));
        setShowAISummary(applicationId);
      } else {
        toast.error(response.message || "Failed to get AI insights");
      }
    } catch (error) {
      console.error("Error getting AI insights:", error);
      toast.error("An error occurred while getting AI insights");
    } finally {
      setLoadingAI((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  // Active filters
  const [activeFilters, setActiveFilters] = useState<{
    courses?: string[];
    roles?: string[];
    availabilities?: string[];
    skills?: string[];
  }>({});

  useEffect(() => {
    if (loading) return;

    if (!id || !user) {
      router.replace("/signin");
      return;
    }

    const fetchCoursesAssigned = async () => {
      const response = await getAllCoursesAssigned(user?.id);
      if (response.success) {
        setCoursesAssigned(response.body as Course[]);
      } else {
        toast.error(response.message);
      }
    };

    const fetchRoles = async () => {
      const response = await getAllRoles();
      if (response.success) {
        setRoles(response.body as Role[]);
      } else {
        toast.error(response.message);
      }
    };

    const fetchAvailabilities = async () => {
      const response = await getAllAvailabilities();
      if (response.success) {
        setAvailabilities(response.body as Availability[]);
      } else {
        toast.error(response.message);
      }
    };

    const fetchSkills = async () => {
      const response = await getAllSkills();
      if (response.success) {
        setSkills(response.body as Skill[]);
      } else {
        toast.error(response.message);
      }
    };

    const fetchApplications = async () => {
      const response = await getAllApplications();
      if (response.success) {
        const apps = response.body as Application[];
        setApplications(apps);
        setFilteredApplications(apps);
      } else {
        toast.error(response.message);
      }
    };

    fetchCoursesAssigned();
    fetchRoles();
    fetchAvailabilities();
    fetchSkills();
    fetchApplications();

    if (user && user.id) {
      fetchLecturerRankings(user.id);
    }
  }, [id, user, loading]);

  const fetchLecturerRankings = async (lecturerId: string) => {
    try {
      setIsLoadingRankings(true);
      const response = await getLecturerRankings(lecturerId);

      if (response.success && Array.isArray(response.body)) {
        const rankings = response.body;
        const selectedIds = new Set<string>();
        const rankedApps: Application[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rankings.forEach((ranking: any) => {
          if (ranking.application) {
            selectedIds.add(ranking.application.id);
            rankedApps.push(ranking.application);
          }
        });

        rankedApps.sort((a, b) => {
          const rankA =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rankings.find((r: any) => r.application.id === a.id)?.rank || 0;
          const rankB =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rankings.find((r: any) => r.application.id === b.id)?.rank || 0;
          return rankA - rankB;
        });

        setSelectedApplications(selectedIds);
        setRankedApplications(rankedApps);

        if (rankedApps.length > 0) {
          setShowRankingEditor(true);
        }
      } else {
        toast.error(response.message || "Failed to fetch rankings");
      }
    } catch (error) {
      console.error("Error fetching rankings:", error);
      toast.error("An error occurred while fetching rankings");
    } finally {
      setIsLoadingRankings(false);
    }
  };

  const handleApplyFilters = (appliedFilters: {
    courses?: string[];
    roles?: string[];
    availabilities?: string[];
    skills?: string[];
  }) => {
    setActiveFilters(appliedFilters);

    let filtered = [...applications];

    if (appliedFilters.courses && appliedFilters.courses.length > 0) {
      filtered = filtered.filter((app) =>
        appliedFilters.courses?.includes(app.course.id)
      );
    }

    if (appliedFilters.roles && appliedFilters.roles.length > 0) {
      filtered = filtered.filter((app) =>
        appliedFilters.roles?.includes(app.role.id)
      );
    }

    if (
      appliedFilters.availabilities &&
      appliedFilters.availabilities.length > 0
    ) {
      filtered = filtered.filter((app) =>
        appliedFilters.availabilities?.includes(app.availability.id)
      );
    }

    if (appliedFilters.skills && appliedFilters.skills.length > 0) {
      filtered = filtered.filter((app) =>
        app.skills.some((skill) => appliedFilters.skills?.includes(skill.name))
      );
    }

    setFilteredApplications(filtered);
  };

  if (loading) {
    return <LoaderComponent />;
  }

  if (!user) {
    router.replace("/signin");
    return null;
  }

  const handleCandidateSelection = async (
    application: Application,
    checked: boolean
  ) => {
    try {
      if (!user) return;

      const updatedSelectedApplications = new Set(selectedApplications);

      if (checked) {
        updatedSelectedApplications.add(application.id);

        if (!rankedApplications.some((app) => app.id === application.id)) {
          const updatedRankedApplications = [
            ...rankedApplications,
            application,
          ];
          setRankedApplications(updatedRankedApplications);

          const rankingsToUpdate = {
            rankings: updatedRankedApplications.map((app, index) => ({
              lecturerId: user.id,
              applicationId: app.id,
              rank: index + 1,
            })),
          };

          await selectCandidate(rankingsToUpdate);
        }
      } else {
        updatedSelectedApplications.delete(application.id);

        const updatedRankedApplications = rankedApplications.filter(
          (app) => app.id !== application.id
        );
        setRankedApplications(updatedRankedApplications);

        await deleteRanking(user.id, application.id);
      }

      setSelectedApplications(updatedSelectedApplications);
      setShowRankingEditor(updatedSelectedApplications.size > 0);
    } catch (error) {
      console.error("Error updating selection:", error);
      toast.error("Failed to update selection");
    }
  };

  const handleRankingsChanged = async () => {
    if (user && user.id) {
      await fetchLecturerRankings(user.id);
    }
  };

  const toggleCoverLetter = (id: string) => {
    setExpandedCoverLetters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const activeFilterCount =
    (activeFilters.courses?.length || 0) +
    (activeFilters.roles?.length || 0) +
    (activeFilters.availabilities?.length || 0) +
    (activeFilters.skills?.length || 0);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4">
      {/* Sidebar with filters */}
      <div className="w-full md:w-1/4">
        <FilterSidebar
          courses={coursesAssigned}
          roles={roles}
          availabilities={availabilities}
          skills={skills}
          onApplyFilters={handleApplyFilters}
        />
      </div>

      {/* Main content area */}
      <div className="w-full md:w-3/4 flex flex-col gap-8">
        {/* link to stats */}
        <div className="flex justify-between items-center">
          <Link
            href="/lecturer/stats"
            className="text-primary hover:text-accent transition-colors text-sm self-start"
          >
            View Course Statistics
          </Link>

          {activeFilterCount > 0 && (
            <Badge variant="outline" className="px-3 py-1">
              {activeFilterCount} active filter
              {activeFilterCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {/* Ranking Editor */}
        {showRankingEditor && user && (
          <ApplicationRankingEditor
            lecturerId={user.id}
            rankedApplications={rankedApplications}
            onRankingsChanged={handleRankingsChanged}
          />
        )}

        {/* Applications */}
        {filteredApplications.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredApplications.map((application: Application) => (
              <motion.div key={application.id} variants={staggerItem} {...scaleOnHover}>
              <Card className="hover:shadow-xl hover:shadow-primary/5 p-6 border-border bg-card transition-shadow">
                <div className="flex justify-between items-center">
                  <div className="text-md font-bold">
                    {application.user.name}
                  </div>
                  <Badge>{application.id.substring(0, 8)}</Badge>
                </div>
                {/* Role */}
                <div>
                  <div className="text-muted-foreground">Role</div>
                  {application.role.name.toUpperCase()}
                </div>
                {/* Availability */}
                <div>
                  <div className="text-muted-foreground">Availability</div>
                  {application.availability.availability.toUpperCase()}
                </div>
                {/* Skills */}
                <div>
                  <div className="text-muted-foreground">Skills</div>
                  <div className="flex flex-wrap justify-start items-center gap-2">
                    {application.skills.map((skill, i) => (
                      <Badge key={i}>{skill.name}</Badge>
                    ))}
                  </div>
                </div>
                {/* Academic credentials */}
                <div>
                  <div className="text-muted-foreground">Academic Credentials</div>
                  {application.academic_creds}
                </div>
                {/* Cover Letter */}
                {application.cover_letter && (
                  <div>
                    <div className="text-muted-foreground">Cover Letter</div>
                    <div className="text-sm whitespace-pre-wrap">
                      {expandedCoverLetters.has(application.id)
                        ? application.cover_letter
                        : application.cover_letter.length > 100
                          ? `${application.cover_letter.substring(0, 100)}...`
                          : application.cover_letter}
                    </div>
                    {application.cover_letter.length > 100 && (
                      <button
                        onClick={() => toggleCoverLetter(application.id)}
                        className="text-xs text-primary hover:underline mt-1 flex items-center gap-0.5"
                      >
                        {expandedCoverLetters.has(application.id) ? (
                          <>
                            Show less <ChevronUp className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            Show more <ChevronDown className="h-3 w-3" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
                <hr className="my-3 border-border" />
                {/* AI Insights & Select candidate */}
                <div className="flex justify-between items-center">
                  <div className="flex justify-start items-center gap-2">
                    <Checkbox
                      id={`select-${application.id}`}
                      checked={selectedApplications.has(application.id)}
                      onCheckedChange={(checked) =>
                        handleCandidateSelection(application, !!checked)
                      }
                    />
                    <label
                      htmlFor={`select-${application.id}`}
                      className="text-sm"
                    >
                      Select Candidate
                    </label>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIInsights(application.id)}
                    disabled={loadingAI[application.id]}
                    className="flex items-center gap-1 text-accent border-accent/30 hover:bg-accent/10"
                  >
                    {loadingAI[application.id] ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    AI Insights
                  </Button>
                </div>
                {/* AI Summary Display */}
                {showAISummary === application.id &&
                  aiSummaries[application.id] && (
                    <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-md relative">
                      <button
                        onClick={() => setShowAISummary(null)}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <p className="text-xs font-semibold text-accent mb-1 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI Assessment
                      </p>
                      <p className="text-sm text-foreground">
                        {aiSummaries[application.id]}
                      </p>
                    </div>
                  )}
              </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center p-8 bg-card/50 rounded-md text-muted-foreground border border-border">
            No applicants found matching the selected filters
          </div>
        )}
      </div>
    </div>
  );
}
