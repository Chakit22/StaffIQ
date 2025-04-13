"use client";

import { useApplicant } from "@/context/ApplicantProvider";
import { courses } from "@/utils/courses";
import { useEffect, useState } from "react";
import Link from "next/link";

// import ApplicantStats from "./ApplicantStats";
import { useAuth } from "@/context/UserProvider";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { RankingEditor } from "./RankingEditor";
import ViewDetailsDialog from "./ViewDetailsDialog";

export default function LecturerComponent() {
  const { applicants, getApplicantsByCourse } = useApplicant();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [selectedCourse, setSelectedCourse] = useState<string>();
  const [currentApplicants, setCurrentApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [selectedApplicants, setSelectedApplicants] = useState<Applicant[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  <h1 className="text-2xl font-bold mb-4">Lecturer Dashboard</h1>;

  //redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
    }
  }, [loading, user]);

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
      {selectedCourse && (
        <div className="border rounded-xl shadow p-4 bg-white">
          <h2 className="text-lg font-semibold mb-4">Applicants</h2>
          {filteredApplicants.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Select</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((a) => (
                  <TableRow key={`${a.id}-${a.role}`}>
                    <TableCell>
                      <Checkbox
                        checked={selectedApplicants.some(
                          (x) => x.id === a.id && x.role === a.role
                        )}
                        onCheckedChange={() => handleSelectToggle(a)}
                      />
                    </TableCell>
                    <TableCell>{a.id}</TableCell>
                    <TableCell>
                      {a.firstname} {a.lastname}
                    </TableCell>
                    <TableCell>{a.role}</TableCell>
                    <TableCell>{a.availability}</TableCell>
                    <TableCell>
                      <ViewDetailsDialog applicant={a} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No applicants found.</p>
          )}
        </div>
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
