"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { RankingEditor } from "./RankingEditor";
import { useQueryState } from "nuqs";
import LoaderComponent from "./Loading";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import z from "zod";
import { useAuthContext } from "@/context/UserProvider";
import useUser from "@/hooks/useUser";
import useCourse from "@/hooks/useCourse";
import { Application } from "@/types/Application";
import { Course } from "@/types/Course";
import useRole from "@/hooks/useRole";
import { Role } from "@/types/Role";
import { Availability } from "@/types/Availability";
import useAvailability from "@/hooks/useAvailability";
import useSkill from "@/hooks/useSkill";
import { Skill } from "@/types/Skill";

export default function LecturerComponent() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  // This extracts the parameter from the url and makes sure it is a valid uuid else it will be undefined
  const [id] = useQueryState("id", z.string().uuid().optional());

  // Get all applications for a course
  const { getAllApplicationsForCourse } = useCourse();

  // Filters
  // Course Name
  // Get all courses assigned to the lecturer
  const { getAllCoursesAssigned } = useUser();
  // Role
  // Get all possible roles
  const { getAllRoles } = useRole();
  // availability
  const { getAllAvailabilities } = useAvailability();
  // Skills
  const { getAllSkills } = useSkill();

  // All filters in one state
  const [filters, setFilters] = useState<{
    courses: Course[];
    roles: Role[];
    availabilities: Availability[];
    skills: Skill[];
  }>({
    courses: [],
    roles: [],
    availabilities: [],
    skills: [],
  });

  // Search Terms
  const [searchTerm, setSearchTerm] = useState<string>("");

  // SortBy
  // Course Name (ascending or descending)
  const [courseNameSort, setCourseNameSort] = useState<string>("");
  // Availablity (ascending or descending)
  const [availabilitySort, setAvailabilitySort] = useState<string>("");

  // Check is there is an id in the url
  useEffect(() => {
    if (!id || !user) {
      router.replace("/signin");
    }
  }, [id, router, user]);

  // Show loading overlay while loading
  if (loading) {
    return <LoaderComponent />;
  }

  // If user is not logged in, redirect to signin page
  if (!user) {
    router.replace("/signin");
  }

  return (
    <div className="flex flex-col gap-8">
      {/* course selection dropdown */}
      <div className="border rounded-xl shadow p-4 bg-blue-50">
        <h2 className="text-lg font-semibold pb-2">Select Course</h2>
        <Select onValueChange={setSelectedCourse} value={selectedCourse}>
          <SelectTrigger className="min-w-1/3">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {coursesAssigned.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.course_code} - {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* filters */}
      {selectedCourse && (
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <Input
            placeholder="Search by name, course or skills"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            onValueChange={setAvailabilityFilter}
            value={availabilityFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="full time">Full Time</SelectItem>
                <SelectItem value="part time">Part Time</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={setRoleFilter} value={roleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="tutor">Tutor</SelectItem>
                <SelectItem value="lab assistant">Lab Assistant</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={setSortBy} value={sortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">None</SelectItem>
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="availability">Availability</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* link to stats */}
      <Link
        href="/lecturer/graph"
        className="text-blue-500 underline text-sm mt-2 self-start"
      >
        📊 View Applicant Stats Graph
      </Link>

      {/* applications */}
      {selectedCourse && currentApplications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredApplications.map((application: Application) => (
            <Card key={application.id} className="hover:shadow-xl p-6">
              <div className="flex justify-between items-center">
                <div className="text-md font-bold">{application.user.name}</div>
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
                {application.availability.toUpperCase()}
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
              <hr />
              {/* Select candidate */}
              <div className="flex justify-start items-center gap-2">
                <Checkbox
                  checked={selectedApplicants.some(
                    (x) =>
                      x.id === application.id &&
                      x.role.id === application.role.id
                  )}
                  onCheckedChange={() => handleSelectToggle(application)}
                />
                Select Candidate
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedCourse && filteredApplications.length === 0 && (
        <div className="text-center">No applicants found</div>
      )}

      {/* ranking editor section */}
      {uniqueSelectedApplicants.length > 0 && selectedCourse && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RankingEditor
            course_code={selectedCourse}
            role="tutor"
            selectedApplicants={uniqueSelectedApplicants.filter(
              (a) => a.role.name.toLowerCase() === "tutor"
            )}
            applicants={uniqueSelectedApplicants.map((a) => a.id)}
          />
          <RankingEditor
            course_code={selectedCourse}
            role="lab assistant"
            selectedApplicants={uniqueSelectedApplicants.filter(
              (a) => a.role.name.toLowerCase() === "lab assistant"
            )}
            applicants={uniqueSelectedApplicants.map((a) => a.id)}
          />
        </div>
      )}
    </div>
  );
}
