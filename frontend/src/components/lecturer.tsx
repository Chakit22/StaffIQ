"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Checkbox } from "./ui/checkbox";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import LoaderComponent from "./Loading";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ListOrdered,
  FileText,
  Download,
  GraduationCap,
  Clock,
  MessageSquare,
  Send,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from "./ui/sheet";
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
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import useAI from "@/hooks/useAI";
import { Textarea } from "./ui/textarea";

export default function LecturerComponent() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  const [id] = useQueryState("id", z.string().uuid().optional());

  // URL-synced filters via nuqs
  const [filterCourses, setFilterCourses] = useQueryState(
    "courses",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [filterRoles, setFilterRoles] = useQueryState(
    "roles",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [filterAvailabilities, setFilterAvailabilities] = useQueryState(
    "availabilities",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [filterSkills, setFilterSkills] = useQueryState(
    "skills",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [sortBy, setSortBy] = useQueryState(
    "sort",
    parseAsString.withDefault("name-asc"),
  );

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
    updateComment,
  } = useApplication();
  const [applications, setApplications] = useState<Application[]>([]);

  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(
    new Set(),
  );
  const [rankedApplications, setRankedApplications] = useState<Application[]>([]);
  const [, setIsLoadingRankings] = useState<boolean>(false);

  // Expanded card detail view (only one at a time)
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);


  // Comments
  const [comments, setComments] = useState<Record<string, string>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [savingComment, setSavingComment] = useState<Record<string, boolean>>({});

  // Filter sheet open state
  const [filterOpen, setFilterOpen] = useState(false);

  // Pending filter state (applied only when "Apply" is clicked)
  const [pendingCourses, setPendingCourses] = useState<string[]>([]);
  const [pendingRoles, setPendingRoles] = useState<string[]>([]);
  const [pendingAvailabilities, setPendingAvailabilities] = useState<string[]>([]);
  const [pendingSkills, setPendingSkills] = useState<string[]>([]);

  // Sync pending state when sheet opens
  useEffect(() => {
    if (filterOpen) {
      setPendingCourses(filterCourses);
      setPendingRoles(filterRoles);
      setPendingAvailabilities(filterAvailabilities);
      setPendingSkills(filterSkills);
    }
  }, [filterOpen]);

  // AI Insights
  const { getCandidateSummary } = useAI();
  const [aiSummaries, setAiSummaries] = useState<Record<string, string>>({});
  const [loadingAI, setLoadingAI] = useState<Record<string, boolean>>({});
  const [showAISummary, setShowAISummary] = useState<string | null>(null);

  const handleAIInsights = async (applicationId: string) => {
    if (aiSummaries[applicationId]) {
      setShowAISummary(showAISummary === applicationId ? null : applicationId);
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

  useEffect(() => {
    if (loading) return;
    if (!id || !user) {
      router.replace("/signin");
      return;
    }

    const fetchAll = async () => {
      const [coursesRes, rolesRes, availRes, skillsRes, appsRes] =
        await Promise.all([
          getAllCoursesAssigned(user.id),
          getAllRoles(),
          getAllAvailabilities(),
          getAllSkills(),
          getAllApplications(),
        ]);

      if (coursesRes.success) setCoursesAssigned(coursesRes.body as Course[]);
      if (rolesRes.success) setRoles(rolesRes.body as Role[]);
      if (availRes.success) setAvailabilities(availRes.body as Availability[]);
      if (skillsRes.success) setSkills(skillsRes.body as Skill[]);
      if (appsRes.success) setApplications(appsRes.body as Application[]);

      if (user.id) fetchLecturerRankings(user.id);
    };

    fetchAll();
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rankA = rankings.find((r: any) => r.application.id === a.id)?.rank || 0;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rankB = rankings.find((r: any) => r.application.id === b.id)?.rank || 0;
          return rankA - rankB;
        });
        setSelectedApplications(selectedIds);
        setRankedApplications(rankedApps);
      }
    } catch (error) {
      console.error("Error fetching rankings:", error);
    } finally {
      setIsLoadingRankings(false);
    }
  };

  // Derive filtered + sorted applications
  const filteredApplications = (() => {
    let filtered = [...applications];

    if (filterCourses.length > 0) {
      filtered = filtered.filter((app) => filterCourses.includes(app.course.id));
    }
    if (filterRoles.length > 0) {
      filtered = filtered.filter((app) => filterRoles.includes(app.role.id));
    }
    if (filterAvailabilities.length > 0) {
      filtered = filtered.filter((app) =>
        filterAvailabilities.includes(app.availability.id),
      );
    }
    if (filterSkills.length > 0) {
      filtered = filtered.filter((app) =>
        app.skills.some((skill) => filterSkills.includes(skill.name)),
      );
    }

    // Sort
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.user.name.localeCompare(b.user.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.user.name.localeCompare(a.user.name));
        break;
      case "course":
        filtered.sort((a, b) => a.course.name.localeCompare(b.course.name));
        break;
      case "role":
        filtered.sort((a, b) => a.role.name.localeCompare(b.role.name));
        break;
      case "gpa-desc":
        filtered.sort((a, b) => {
          const extractGpa = (s: string) => {
            const match = s.match(/[\d.]+/);
            return match ? parseFloat(match[0]) : 0;
          };
          return extractGpa(b.academic_creds) - extractGpa(a.academic_creds);
        });
        break;
    }

    return filtered;
  })();

  if (loading) return <LoaderComponent />;
  if (!user) {
    router.replace("/signin");
    return null;
  }

  const handleCandidateSelection = async (
    application: Application,
    checked: boolean,
  ) => {
    try {
      if (!user) return;
      const updated = new Set(selectedApplications);

      if (checked) {
        updated.add(application.id);
        if (!rankedApplications.some((app) => app.id === application.id)) {
          const updatedRanked = [...rankedApplications, application];
          setRankedApplications(updatedRanked);
          await selectCandidate({
            rankings: updatedRanked.map((app, index) => ({
              lecturerId: user.id,
              applicationId: app.id,
              rank: index + 1,
            })),
          });
        }
      } else {
        updated.delete(application.id);
        setRankedApplications(rankedApplications.filter((app) => app.id !== application.id));
        await deleteRanking(user.id, application.id);
      }

      setSelectedApplications(updated);
    } catch (error) {
      console.error("Error updating selection:", error);
      toast.error("Failed to update selection");
    }
  };

  const toggleExpandCard = (application: Application) => {
    const appId = application.id;
    if (expandedCardId === appId) {
      setExpandedCardId(null);
      return;
    }
    setExpandedCardId(appId);
  };

  const handleSaveComment = async (applicationId: string) => {
    if (!user) return;
    const draft = commentDrafts[applicationId] ?? "";
    setSavingComment((prev) => ({ ...prev, [applicationId]: true }));
    try {
      const res = await updateComment({
        lecturerId: user.id,
        applicationId,
        comment: draft,
      });
      if (res.success) {
        setComments((prev) => ({ ...prev, [applicationId]: draft }));
        toast.success("Comment saved");
      } else {
        toast.error(res.message || "Failed to save comment");
      }
    } catch (error) {
      console.error("Error saving comment:", error);
      toast.error("An error occurred while saving comment");
    } finally {
      setSavingComment((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleApplyFilters = () => {
    setFilterCourses(pendingCourses.length > 0 ? pendingCourses : []);
    setFilterRoles(pendingRoles.length > 0 ? pendingRoles : []);
    setFilterAvailabilities(pendingAvailabilities.length > 0 ? pendingAvailabilities : []);
    setFilterSkills(pendingSkills.length > 0 ? pendingSkills : []);
    setFilterOpen(false);
  };

  const handleClearFilters = () => {
    setPendingCourses([]);
    setPendingRoles([]);
    setPendingAvailabilities([]);
    setPendingSkills([]);
    setFilterCourses([]);
    setFilterRoles([]);
    setFilterAvailabilities([]);
    setFilterSkills([]);
    setFilterOpen(false);
  };

  const togglePendingFilter = (
    type: "courses" | "roles" | "availabilities" | "skills",
    value: string,
  ) => {
    const setters = {
      courses: setPendingCourses,
      roles: setPendingRoles,
      availabilities: setPendingAvailabilities,
      skills: setPendingSkills,
    };
    const getters = {
      courses: pendingCourses,
      roles: pendingRoles,
      availabilities: pendingAvailabilities,
      skills: pendingSkills,
    };
    const current = getters[type];
    if (current.includes(value)) {
      setters[type](current.filter((v) => v !== value));
    } else {
      setters[type]([...current, value]);
    }
  };

  const activeFilterCount =
    filterCourses.length + filterRoles.length + filterAvailabilities.length + filterSkills.length;

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto w-full">
      {/* Top Bar — Sort + Filter + Rankings link */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Sort + Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="gpa-desc">GPA (High-Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Link href="/lecturer/stats">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              View Statistics
            </Button>
          </Link>
        </div>

        {/* Right: Rankings link + Filter button */}
        <div className="flex items-center gap-3">
          {selectedApplications.size > 0 && (
            <Link href={`/lecturer/rankings?id=${user.id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ListOrdered className="h-4 w-4" />
                My Rankings
                <Badge variant="secondary" className="ml-1 text-xs">
                  {selectedApplications.size}
                </Badge>
              </Button>
            </Link>
          )}

          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filter
                {activeFilterCount > 0 && (
                  <Badge variant="default" className="ml-1 text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Narrow down applications</SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-6 px-4 py-2">
                {/* Courses */}
                <FilterSection
                  title="Courses"
                  items={coursesAssigned.map((c) => ({
                    id: c.id,
                    label: `${c.course_code} - ${c.name}`,
                  }))}
                  selected={pendingCourses}
                  onToggle={(id) => togglePendingFilter("courses", id)}
                />

                {/* Roles */}
                <FilterSection
                  title="Roles"
                  items={roles.map((r) => ({ id: r.id, label: r.name }))}
                  selected={pendingRoles}
                  onToggle={(id) => togglePendingFilter("roles", id)}
                />

                {/* Availabilities */}
                <FilterSection
                  title="Availability"
                  items={availabilities.map((a) => ({
                    id: a.id,
                    label: a.availability,
                  }))}
                  selected={pendingAvailabilities}
                  onToggle={(id) => togglePendingFilter("availabilities", id)}
                />

                {/* Skills */}
                <FilterSection
                  title="Skills"
                  items={skills.map((s) => ({ id: s.name, label: s.name }))}
                  selected={pendingSkills}
                  onToggle={(id) => togglePendingFilter("skills", id)}
                />
              </div>

              <SheetFooter className="flex gap-2">
                <Button variant="outline" onClick={handleClearFilters} className="flex-1">
                  Clear All
                </Button>
                <Button onClick={handleApplyFilters} className="flex-1">
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active filter pills */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filterCourses.map((id) => {
            const course = coursesAssigned.find((c) => c.id === id);
            return course ? (
              <Badge key={id} variant="secondary" className="flex items-center gap-1 pr-1">
                {course.course_code}
                <button onClick={() => setFilterCourses(filterCourses.filter((c) => c !== id))} className="ml-1 rounded-full hover:bg-destructive/20 p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null;
          })}
          {filterRoles.map((id) => {
            const role = roles.find((r) => r.id === id);
            return role ? (
              <Badge key={id} variant="secondary" className="flex items-center gap-1 pr-1">
                {role.name}
                <button onClick={() => setFilterRoles(filterRoles.filter((r) => r !== id))} className="ml-1 rounded-full hover:bg-destructive/20 p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null;
          })}
          {filterAvailabilities.map((id) => {
            const avail = availabilities.find((a) => a.id === id);
            return avail ? (
              <Badge key={id} variant="secondary" className="flex items-center gap-1 pr-1">
                {avail.availability}
                <button onClick={() => setFilterAvailabilities(filterAvailabilities.filter((a) => a !== id))} className="ml-1 rounded-full hover:bg-destructive/20 p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null;
          })}
          {filterSkills.map((name) => (
            <Badge key={name} variant="secondary" className="flex items-center gap-1 pr-1">
              {name}
              <button onClick={() => setFilterSkills(filterSkills.filter((s) => s !== name))} className="ml-1 rounded-full hover:bg-destructive/20 p-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <button
            onClick={handleClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredApplications.length} application{filteredApplications.length !== 1 ? "s" : ""}
      </div>

      {/* Application Cards */}
      {filteredApplications.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-4"
        >
          {filteredApplications.map((application: Application) => {
            const isExpanded = expandedCardId === application.id;
            return (
              <motion.div key={application.id} variants={staggerItem}>
                <Card
                  className={`p-6 border-border bg-card transition-shadow cursor-pointer ${
                    isExpanded
                      ? "shadow-xl shadow-primary/10 border-primary/30"
                      : "hover:shadow-xl hover:shadow-primary/5"
                  }`}
                  onClick={() => toggleExpandCard(application)}
                >
                  {/* Collapsed Summary Row */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="text-md font-bold">{application.user.name}</div>
                      <Badge variant="outline" className="text-xs">{application.course.course_code}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{application.role.name}</Badge>
                        <Badge variant="outline">{application.availability.availability}</Badge>
                        {application.academic_creds && (
                          <Badge variant="outline">GPA: {application.academic_creds}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          id={`select-${application.id}`}
                          checked={selectedApplications.has(application.id)}
                          onCheckedChange={(checked) =>
                            handleCandidateSelection(application, !!checked)
                          }
                        />
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Detail Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
                        exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
                        className="overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <hr className="my-4 border-border" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column */}
                          <div className="flex flex-col gap-4">
                            {/* Cover Letter */}
                            {application.cover_letter && (
                              <div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                  <FileText className="h-3.5 w-3.5" />
                                  Cover Letter
                                </div>
                                <div className="text-sm whitespace-pre-wrap bg-muted/30 rounded-md p-3">
                                  {application.cover_letter}
                                </div>
                              </div>
                            )}

                            {/* Resume Download */}
                            {application.resume_path && (
                              <div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                  <Download className="h-3.5 w-3.5" />
                                  Resume
                                </div>
                                <a
                                  href={`http://localhost:3000/api/applications/${application.id}/resume`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                  <Download className="h-4 w-4" />
                                  Download Resume (PDF)
                                </a>
                              </div>
                            )}

                            {/* Skills */}
                            {application.skills.length > 0 && (
                              <div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                                  Skills
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {application.skills.map((skill, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {skill.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* GPA & Availability */}
                            <div className="flex gap-4">
                              {application.academic_creds && (
                                <div>
                                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1.5">
                                    <GraduationCap className="h-3.5 w-3.5" />
                                    GPA
                                  </div>
                                  <div className="text-sm font-medium">{application.academic_creds}</div>
                                </div>
                              )}
                              <div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5" />
                                  Availability
                                </div>
                                <div className="text-sm font-medium">{application.availability.availability}</div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column */}
                          <div className="flex flex-col gap-4">
                            {/* AI Insights */}
                            <div>
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
                              {showAISummary === application.id && aiSummaries[application.id] && (
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
                                  <p className="text-sm text-foreground">{aiSummaries[application.id]}</p>
                                </div>
                              )}
                            </div>

                            {/* Comment Section */}
                            <div>
                              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                <MessageSquare className="h-3.5 w-3.5" />
                                Comment
                              </div>
                              <div className="flex gap-2">
                                <Textarea
                                  value={commentDrafts[application.id] ?? comments[application.id] ?? ""}
                                  onChange={(e) =>
                                    setCommentDrafts((prev) => ({
                                      ...prev,
                                      [application.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="Add your comment about this candidate..."
                                  className="min-h-[80px] text-sm"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveComment(application.id)}
                                  disabled={savingComment[application.id]}
                                  className="self-end"
                                >
                                  {savingComment[application.id] ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Send className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="text-center p-12 bg-card/50 rounded-lg text-muted-foreground border border-border">
          No applicants found matching the selected filters
        </div>
      )}
    </div>
  );
}

// Reusable filter section component
function FilterSection({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex justify-between items-center w-full text-left font-medium py-1"
      >
        <span className="text-sm">
          {title}
          {selected.length > 0 && (
            <span className="ml-2 text-xs text-primary">({selected.length})</span>
          )}
        </span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {expanded && (
        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={`filter-${title}-${item.id}`}
                checked={selected.includes(item.id)}
                onCheckedChange={() => onToggle(item.id)}
              />
              <label
                htmlFor={`filter-${title}-${item.id}`}
                className="text-sm leading-none cursor-pointer"
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
