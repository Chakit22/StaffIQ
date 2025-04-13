"use client";

import { useApplicant } from "@/context/ApplicantProvider";
import { courses } from "@/utils/courses";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAuth } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import { Applicant } from "@/types/ApplicantType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "./ui/checkbox";
import { RankingEditor } from "./RankingEditor";
import ViewDetailsDialog from "./ViewDetailsDialog";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Spinner } from "@/components/ui/spinner";

export default function LecturerComponent() {
  const router = useRouter();
  const {
    applicants,
    getApplicantsByCourse,
    loading: applicantLoading,
  } = useApplicant();
  const { user, loading: authLoading } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(
    undefined
  );
  const [currentApplicants, setCurrentApplicants] = useState<
    Applicant[] | null
  >([]);
  const [selectedApplicants, setSelectedApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Combined loading state
  const isPageLoading = authLoading || applicantLoading;

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }

    // Filter the applicants by the current selected course
    if (selectedCourse) {
      setIsLoading(true);
      console.log(selectedCourse);
      console.log(getApplicantsByCourse(selectedCourse!));
      // Set the elected applicants only if you selected a course
      setCurrentApplicants(getApplicantsByCourse(selectedCourse!));
      // Simulate a small delay to show the loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [applicants, selectedCourse, user, authLoading]);

  const handleSelectedApplicantsChange = (applicant: Applicant) => {
    setSelectedApplicants((prev) =>
      !prev.includes(applicant)
        ? [...prev, applicant]
        : prev.filter((applicant_) => applicant_.id !== applicant.id)
    );
  };

  // Show loading overlay for entire page
  if (isPageLoading) {
    return (
      <div className="w-full h-screen relative">
        <LoadingOverlay fullScreen text="Loading..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 relative">
      {/* Loading overlay for course selection */}
      {isLoading && <LoadingOverlay text="Loading applicants..." />}

      <div className="flex flex-col gap-6 w-full border shadow-sm rounded-xl">
        <div className="shadow-sm bg-blue-500 p-4 rounded-t-xl">
          <div className="text-2xl font-bold text-primary-foreground">
            Select Course
          </div>
          <div className="text-primary-foreground">Select Course</div>
        </div>
        <div className="p-4">
          <Select onValueChange={setSelectedCourse} value={selectedCourse}>
            <SelectTrigger className="w-1/3">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {courses.map((course, i) => (
                  <SelectItem key={i} value={course.code}>
                    {course.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {selectedCourse && (
        <div className="flex flex-col gap-6 w-full border shadow-sm rounded-xl">
          <div className="shadow-sm bg-blue-500 p-4 rounded-t-xl">
            <div className="text-2xl font-bold text-primary-foreground">
              Applicants
            </div>
            <div className="text-primary-foreground">
              {selectedCourse} - {currentApplicants?.length}
            </div>
          </div>
          <div className="p-4">
            {currentApplicants ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Select</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentApplicants?.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedApplicants.some(
                            (applicant_) => applicant_.id === applicant.id
                          )}
                          onCheckedChange={() => {
                            handleSelectedApplicantsChange(applicant);
                          }}
                        />
                      </TableCell>
                      <TableCell>{`${applicant.firstname.toUpperCase()} ${applicant.lastname.toUpperCase()}`}</TableCell>
                      <TableCell>{applicant.role.toUpperCase()}</TableCell>
                      <TableCell>
                        {applicant.availability.toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <ViewDetailsDialog applicant={applicant} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-4 text-center">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Spinner size="md" className="mr-2" />
                    <span>Loading applicants...</span>
                  </div>
                ) : (
                  "No applicants found"
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {currentApplicants &&
        selectedCourse &&
        selectedApplicants.length !== 0 && (
          <div className="grid grid-cols-2 w-full p-8 justify-items-center gap-24">
            <RankingEditor
              course_code={selectedCourse}
              role="tutor"
              selectedApplicants={selectedApplicants.filter(
                (applicant) => applicant.role.toLowerCase() === "tutor"
              )}
              applicants={currentApplicants?.map((applicant) => applicant.id)}
            />
            <RankingEditor
              course_code={selectedCourse}
              role="lab assistant"
              selectedApplicants={selectedApplicants.filter(
                (applicant) => applicant.role.toLowerCase() === "lab assistant"
              )}
              applicants={currentApplicants?.map((applicant) => applicant.id)}
            />
          </div>
        )}
    </div>
  );
}
