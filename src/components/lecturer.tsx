"use client";

import { courses } from "@/utils/courses";
import { useEffect, useState } from "react";
import Link from "next/link";

// import ApplicantStats from "./ApplicantStats";
import { useRouter } from "next/navigation";
import { Applicant } from "@/types/ApplicantType";
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
import { useQueryState, parseAsInteger } from "nuqs";
import LoaderComponent from "./Loading";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useUserStore } from "@/stores/user-store";
import { useApplicantStore } from "@/stores/applicant-store";
import { useCourseStore } from "@/stores/course-store";

export default function LecturerComponent() {
  const {
    applicants,
    getApplicantsByCourse,
    loading: applicantsLoading,
    setInitialState: setApplicantInitialState,
  } = useApplicantStore();
  const { loading: courseLoading, setInitialState: setCourseInitialState } =
    useCourseStore();
  const router = useRouter();
  const {
    user,
    userLoading,
    setInitialState: setUserInitialState,
  } = useUserStore();
  const [, setId] = useQueryState("id", parseAsInteger.withDefault(-1));

  const [selectedCourse, setSelectedCourse] = useState<string>();
  const [currentApplicants, setCurrentApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [selectedApplicants, setSelectedApplicants] = useState<Applicant[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");

  useEffect(() => {
    setApplicantInitialState();
    setCourseInitialState();
    setUserInitialState();
  }, []);

  console.log("lecturer component rendered");

  //redirect if not logged in
  useEffect(() => {
    if (!userLoading) {
      if (!user) router.replace("/signin");
      else setId(user.id);
    }
  }, [userLoading, user, router]);

  //update applicants when course changes
  useEffect(() => {
    if (selectedCourse) {
      const apps = getApplicantsByCourse(selectedCourse);
      setCurrentApplicants(apps);
      setSelectedApplicants([]);
    }
  }, [selectedCourse, applicants]);

  //apply filters and sort
  useEffect(() => {
    let results = [...currentApplicants];

    if (searchTerm) {
      results = results.filter(
        (a) =>
          `${a.firstname} ${a.lastname}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          a.skills.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (availabilityFilter) {
      results = results.filter(
        (a) => a.availability.toLowerCase() === availabilityFilter.toLowerCase()
      );
    }

    if (sortBy === "course") {
      results.sort((a, b) =>
        (a.course_code ?? "").localeCompare(b.course_code ?? "")
      );
    }

    setFilteredApplicants(results);
  }, [searchTerm, availabilityFilter, sortBy, currentApplicants]);

  //toggle applicant selection
  const handleSelectToggle = (applicant: Applicant) => {
    setSelectedApplicants((prev) =>
      prev.some((a) => a.id === applicant.id && a.role === applicant.role)
        ? prev.filter(
            (a) => !(a.id === applicant.id && a.role === applicant.role)
          )
        : [...prev, applicant]
    );
  };

  //remove duplicates
  const uniqueSelectedApplicants = Object.values(
    selectedApplicants.reduce((acc, applicant) => {
      const key = `${applicant.id}-${applicant.role.toLowerCase()}`;
      if (!acc[key]) {
        acc[key] = applicant;
      }
      return acc;
    }, {} as Record<string, Applicant>)
  );

  console.log("userLoading", userLoading);
  console.log("applicants Loading: ", applicantsLoading);

  // Show loading overlay while loading
  if (userLoading || applicantsLoading || courseLoading) {
    return <LoaderComponent />;
  }

  return (
    <div className="flex flex-col gap-8 p-4">
      {/* course selection dropdown */}
      <div className="border rounded-xl shadow p-4 bg-white">
        <h2 className="text-lg font-semibold mb-2">Select Course</h2>
        <Select onValueChange={setSelectedCourse} value={selectedCourse}>
          <SelectTrigger className="w-1/3">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {courses.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* filters */}
      {selectedCourse && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            placeholder="Search by name or skills"
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
                <SelectItem value="full time">Full Time</SelectItem>
                <SelectItem value="part time">Part Time</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={setSortBy} value={sortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
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

      {/* applicant table */}
      {selectedCourse && filteredApplicants.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {filteredApplicants.map((applicant: Applicant) => {
            return (
              <Card key={applicant.id} className="hover:shadow-xl px-6">
                <div className="flex justify-between items-center">
                  <div className="text-md font-bold">{`${applicant.firstname.toUpperCase()} ${applicant.lastname.toUpperCase()}`}</div>
                  <Badge>{applicant.id}</Badge>
                </div>
                {/* Role */}
                <div>
                  <div className="text-gray-400">Role</div>
                  {applicant.role.toUpperCase()}
                </div>
                {/* Availability */}
                <div>
                  <div className="text-gray-400">Availability</div>
                  {applicant.availability.toUpperCase()}
                </div>
                {/* Skills */}
                <div>
                  <div className="text-gray-400">Skills</div>
                  {/* Seperate skills by badge */}
                  <div className="flex justify-start items-center gap-2">
                    {applicant.skills.split(",").map((skill: string, i) => (
                      <Badge key={i}>{skill}</Badge>
                    ))}
                  </div>
                </div>
                {/* Academic credentials */}
                <div>
                  <div className="text-gray-400">Academic Credentials</div>
                  {applicant.academic_creds.toUpperCase()}
                </div>
                <hr />
                {/* Select candidate */}
                <div className="flex justify-start items-center gap-2">
                  <Checkbox
                    checked={selectedApplicants.some(
                      (x) => x.id === applicant.id && x.role === applicant.role
                    )}
                    onCheckedChange={() => handleSelectToggle(applicant)}
                  />
                  Select Candidate
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {selectedCourse && filteredApplicants.length == 0 && (
        <div className="text-center">No applicants found</div>
      )}

      {/* ranking editor section */}
      {uniqueSelectedApplicants.length > 0 && selectedCourse && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RankingEditor
            course_code={selectedCourse}
            role="tutor"
            selectedApplicants={uniqueSelectedApplicants.filter(
              (a) => a.role.toLowerCase() === "tutor"
            )}
            applicants={uniqueSelectedApplicants.map((a) => a.id)}
          />
          <RankingEditor
            course_code={selectedCourse}
            role="lab assistant"
            selectedApplicants={uniqueSelectedApplicants.filter(
              (a) => a.role.toLowerCase() === "lab assistant"
            )}
            applicants={uniqueSelectedApplicants.map((a) => a.id)}
          />
        </div>
      )}
    </div>
  );
}
