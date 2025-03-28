"use client";

import { useApplicant } from "@/context/ApplicantProvider";
import Layout from "./layout";
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
import { Card } from "./ui/card";
import { useAuth } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import { Applicant } from "@/types/ApplicantType";

export default function LecturerComponent() {
  const { applicants } = useApplicant();
  const { user } = useAuth();
  const lecturerCourses = user?.courseIds;
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentApplicants, setCurrentApplicants] =
    useState<Applicant[]>(applicants);

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
    setLoading(false);
    setCurrentApplicants(applicants);
  }, [applicants]);

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
                {lecturerCourses?.map((course, i) => (
                  <SelectItem value={course}>{course}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-6 w-full border shadow-sm rounded-xl">
        <div className="shadow-sm bg-blue-500 p-4 rounded-t-xl">
          <div className="text-2xl font-bold text-primary-foreground">
            Applicants
          </div>
          <div className="text-primary-foreground">Select Course</div>
        </div>
        <div className="p-4">
          {loading && <div>Loading Applicants</div>}
          {!loading && (
            <div>
              {currentApplicants.map((applicant) => applicant.firstname)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
