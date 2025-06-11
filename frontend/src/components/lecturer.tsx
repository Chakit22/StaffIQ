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
import { ArrowUp, ArrowDown } from "lucide-react";
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
import { GetAllApplicationsSchema } from "@/schemas/applications/get-all-applications.schema";

export default function LecturerComponent() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  // This extracts the parameter from the url and makes sure it is a valid uuid else it will be undefined
  const [id] = useQueryState("id", z.string().uuid().optional());

  // Filters
  // Course Name
  // Get all courses assigned to the lecturer
  const { getAllCoursesAssigned } = useUser();
  const [coursesAssigned, setCoursesAssigned] = useState<Course[]>([]);

  // Role
  // Get all possible roles
  const { getAllRoles } = useRole();
  const [roles, setRoles] = useState<Role[]>([]);

  // availability
  const { getAllAvailabilities } = useAvailability();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);

  // Skills
  const { getAllSkills } = useSkill();
  const [skills, setSkills] = useState<Skill[]>([]);

  // Applications
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

  // Rankings
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(
    new Set()
  );
  const [rankedApplications, setRankedApplications] = useState<Application[]>(
    []
  );
  const [isLoadingRankings, setIsLoadingRankings] = useState<boolean>(false);
  const [showRankingEditor, setShowRankingEditor] = useState<boolean>(false);

  // Active filters
  const [activeFilters, setActiveFilters] = useState<{
    courses?: string[];
    roles?: string[];
    availabilities?: string[];
    skills?: string[];
  }>({});

  // Check is there is an id in the url
  useEffect(() => {
    // Don't redirect while authentication is still loading
    if (loading) return;

    if (!id || !user) {
      router.replace("/signin");
      return;
    }

    // Fetch all courses assigned to the lecturer
    const fetchCoursesAssigned = async () => {
      const response = await getAllCoursesAssigned(user?.id);
      if (response.success) {
        setCoursesAssigned(response.body as Course[]);
      } else {
        toast.error(response.message);
      }
    };

    // Fetch all roles
    const fetchRoles = async () => {
      const response = await getAllRoles();
      if (response.success) {
        setRoles(response.body as Role[]);
      } else {
        toast.error(response.message);
      }
    };

    // Fetch all availabilities
    const fetchAvailabilities = async () => {
      const response = await getAllAvailabilities();
      if (response.success) {
        setAvailabilities(response.body as Availability[]);
      } else {
        toast.error(response.message);
      }
    };

    // Fetch all skills
    const fetchSkills = async () => {
      const response = await getAllSkills();
      if (response.success) {
        setSkills(response.body as Skill[]);
      } else {
        toast.error(response.message);
      }
    };

    // Fetch all applications
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

    // Fetch lecturer rankings if user is logged in
    if (user && user.id) {
      fetchLecturerRankings(user.id);
    }
  }, [id, user, loading]);

  // Fetch lecturer rankings
  const fetchLecturerRankings = async (lecturerId: string) => {
    try {
      setIsLoadingRankings(true);
      const response = await getLecturerRankings(lecturerId);

      if (response.success && Array.isArray(response.body)) {
        // Extract applications from the rankings
        const rankings = response.body;

        // Create a set of selected application IDs
        const selectedIds = new Set<string>();

        // Create a map of applications with their rankings
        const rankedApps: Application[] = [];

        // Process each ranking
        rankings.forEach((ranking: any) => {
          if (ranking.application) {
            selectedIds.add(ranking.application.id);
            rankedApps.push(ranking.application);
          }
        });

        // Sort by rank
        rankedApps.sort((a, b) => {
          const rankA =
            rankings.find((r: any) => r.application.id === a.id)?.rank || 0;
          const rankB =
            rankings.find((r: any) => r.application.id === b.id)?.rank || 0;
          return rankA - rankB;
        });

        // Update state
        setSelectedApplications(selectedIds);
        setRankedApplications(rankedApps);

        // Show ranking editor if there are ranked applications
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

  // Handle filter applications
  const handleApplyFilters = (appliedFilters: {
    courses?: string[];
    roles?: string[];
    availabilities?: string[];
    skills?: string[];
  }) => {
    setActiveFilters(appliedFilters);

    // Apply filters to applications
    let filtered = [...applications];

    // Filter by courses
    if (appliedFilters.courses && appliedFilters.courses.length > 0) {
      filtered = filtered.filter((app) =>
        appliedFilters.courses?.includes(app.course.id)
      );
    }

    // Filter by roles
    if (appliedFilters.roles && appliedFilters.roles.length > 0) {
      filtered = filtered.filter((app) =>
        appliedFilters.roles?.includes(app.role.id)
      );
    }

    // Filter by availabilities
    if (
      appliedFilters.availabilities &&
      appliedFilters.availabilities.length > 0
    ) {
      filtered = filtered.filter((app) =>
        appliedFilters.availabilities?.includes(app.availability.id)
      );
    }

    // Filter by skills
    if (appliedFilters.skills && appliedFilters.skills.length > 0) {
      filtered = filtered.filter((app) =>
        app.skills.some((skill) => appliedFilters.skills?.includes(skill.name))
      );
    }

    setFilteredApplications(filtered);
  };

  // Show loading overlay while authentication is loading
  if (loading) {
    return <LoaderComponent />;
  }

  // If user is not logged in, redirect to signin page
  if (!user) {
    router.replace("/signin");
    return null;
  }

  // Handle checkbox change for selecting/deselecting a candidate
  const handleCandidateSelection = async (
    application: Application,
    checked: boolean
  ) => {
    try {
      if (!user) return;

      // Create a copy of the selected applications set
      const updatedSelectedApplications = new Set(selectedApplications);

      if (checked) {
        // Add to selected applications
        updatedSelectedApplications.add(application.id);

        // Add to ranked applications if not already present
        if (!rankedApplications.some((app) => app.id === application.id)) {
          const updatedRankedApplications = [
            ...rankedApplications,
            application,
          ];
          setRankedApplications(updatedRankedApplications);

          // Save the ranking
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
        // Remove from selected applications
        updatedSelectedApplications.delete(application.id);

        // Remove from ranked applications
        const updatedRankedApplications = rankedApplications.filter(
          (app) => app.id !== application.id
        );
        setRankedApplications(updatedRankedApplications);

        // Delete the ranking
        await deleteRanking(user.id, application.id);
      }

      // Update selected applications
      setSelectedApplications(updatedSelectedApplications);

      // Show/hide ranking editor based on number of selections
      setShowRankingEditor(updatedSelectedApplications.size > 0);
    } catch (error) {
      console.error("Error updating selection:", error);
      toast.error("Failed to update selection");
    }
  };

  // Handle rankings changed event
  const handleRankingsChanged = async () => {
    if (user && user.id) {
      await fetchLecturerRankings(user.id);
    }
  };

  // Count active filters
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
            href="/lecturer/graph"
            className="text-blue-500 underline text-sm self-start"
          >
            📊 View Applicant Stats Graph
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApplications.map((application: Application) => (
              <Card key={application.id} className="hover:shadow-xl p-6">
                <div className="flex justify-between items-center">
                  <div className="text-md font-bold">
                    {application.user.name}
                  </div>
                  <Badge>{application.id.substring(0, 8)}</Badge>
                </div>
                {/* Role */}
                <div>
                  <div className="text-gray-400">Role</div>
                  {application.role.name.toUpperCase()}
                </div>
                {/* Availability */}
                <div>
                  <div className="text-gray-400">Availability</div>
                  {application.availability.availability.toUpperCase()}
                </div>
                {/* Skills */}
                <div>
                  <div className="text-gray-400">Skills</div>
                  {/* Separate skills by badge */}
                  <div className="flex flex-wrap justify-start items-center gap-2">
                    {application.skills.map((skill, i) => (
                      <Badge key={i}>{skill.name}</Badge>
                    ))}
                  </div>
                </div>
                {/* Academic credentials */}
                <div>
                  <div className="text-gray-400">Academic Credentials</div>
                  {application.academic_creds}
                </div>
                <hr className="my-3" />
                {/* Select candidate */}
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
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-md">
            No applicants found matching the selected filters
          </div>
        )}
      </div>
    </div>
  );
}
