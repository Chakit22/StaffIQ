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
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "./ui/checkbox";
import { RankingEditor } from "./RankingEditor";

export default function LecturerComponent() {
  const router = useRouter();
  const { applicants, getApplicantsByCourse, getApplicantsByCourseAndRole } =
    useApplicant();
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [currentApplicants, setCurrentApplicants] = useState<
    Applicant[] | null
  >([]);
  const [selectedApplicants, setSelectedApplicants] = useState<Applicant[]>([]);

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }

    setLoading(false);
    // Filter the applicants by the current selected course
    if (selectedCourse) {
      console.log(selectedCourse);
      console.log(getApplicantsByCourse(selectedCourse!));
      // Set the elected applicants only if you selected a course
      setCurrentApplicants(getApplicantsByCourse(selectedCourse!));
    }
  }, [applicants, selectedCourse]);

  const handleSelectedApplicantsChange = (applicant: Applicant) => {
    setSelectedApplicants((prev) =>
      !prev.includes(applicant)
        ? [...prev, applicant]
        : prev.filter((applicant_) => applicant_.id !== applicant.id)
    );
  };

  return (
    <div className="flex flex-col gap-10">
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
                  <SelectItem value={course.code}>{course.label}</SelectItem>
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
                      <TableCell>View Details</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div>No applicants</div>
            )}
          </div>
        </div>
      )}
      {selectedApplicants.length !== 0 && (
        <div className="grid grid-cols-2 w-full p-8 justify-items-center gap-24">
          <RankingEditor
            role="tutor"
            selectedApplicants={selectedApplicants.filter(
              (applicant) => applicant.role.toLowerCase() === "tutor"
            )}
          />
          <RankingEditor
            role="lab assistant"
            selectedApplicants={selectedApplicants.filter(
              (applicant) => applicant.role.toLowerCase() === "lab assistant"
            )}
          />
        </div>
      )}
    </div>
  );
}
