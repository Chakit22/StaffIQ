"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Checkbox } from "./ui/checkbox";
import { useQueryState } from "nuqs";
import LoaderComponent from "./Loading";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
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
  const { getAllApplications } = useApplication();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);

  // Active filters
  const [activeFilters, setActiveFilters] = useState<{
    courses?: string[];
    roles?: string[];
    availabilities?: string[];
    skills?: string[];
  }>({});

  // Check is there is an id in the url
  useEffect(() => {
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
  }, []);

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

  // Show loading overlay while loading
  if (loading) {
    return <LoaderComponent />;
  }

  // If user is not logged in, redirect to signin page
  if (!user) {
    router.replace("/signin");
    return null;
  }

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
                    // checked={application.selected}
                    onCheckedChange={() => {}}
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
