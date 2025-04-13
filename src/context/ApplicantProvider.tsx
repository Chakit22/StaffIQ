"use client";

import { Applicant } from "@/types/ApplicantType";
import { createContext, useContext, useEffect, useState } from "react";

interface ApplicantContextProps {
  applicants: Applicant[];
  addApplicant: (applicant: Applicant) => void;
  getApplicantsByCourse: (course_code: string) => Applicant[];
  getApplicantsByCourseAndRole: (
    course_code: string,
    role: string
  ) => Applicant[];
  getApplicationsOfCurrentUser: (user_id: number) => Applicant[];
}

const ApplicantContext = createContext<ApplicantContextProps | undefined>(
  undefined
);

export function ApplicantProvider({ children }: { children: React.ReactNode }) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  //Load applicants from localStorage on initial render
  useEffect(() => {
    const storedApplicants = localStorage.getItem("applicants");
    const storedApplicants_: Applicant[] = storedApplicants
      ? JSON.parse(storedApplicants)
      : [];

    if (!storedApplicants) {
      localStorage.setItem("applicants", JSON.stringify([]));
    }

    setApplicants(storedApplicants_);
  }, []);

  //Add new applicant from localstorage when the page loads
  const addApplicant = (applicant: Applicant) => {
    const storedApplicants = localStorage.getItem("applicants");
    const storedApplicants_: Applicant[] = storedApplicants
      ? JSON.parse(storedApplicants)
      : [];

    const alreadyExists = storedApplicants_.some(
      (a) =>
        a.id === applicant.id &&
        a.course_code === applicant.course_code &&
        a.role === applicant.role
    );

    if (!alreadyExists) {
      storedApplicants_.push(applicant);
      localStorage.setItem("applicants", JSON.stringify(storedApplicants_));
      setApplicants(storedApplicants_);
    }
  };

  // Get applications of the current user
  const getApplicationsOfCurrentUser = (user_id: number) => {
    return applicants.filter((applicant) => applicant.user_id === user_id);
  };

  // Get an applicant of a particular course
  const getApplicantsByCourse = (course_code: string) => {
    return applicants.filter(
      (applicant) => applicant.course_code === course_code
    );
  };

  //Get applicants for a course with a specific role
  const getApplicantsByCourseAndRole = (course_code: string, role: string) => {
    return applicants.filter(
      (applicant) =>
        applicant.course_code === course_code &&
        applicant.role.toLowerCase() === role.toLowerCase()
    );
  };

  return (
    <ApplicantContext.Provider
      value={{
        applicants,
        addApplicant,
        getApplicantsByCourse,
        getApplicantsByCourseAndRole,
        getApplicationsOfCurrentUser,
      }}
    >
      {children}
    </ApplicantContext.Provider>
  );
}

//Custom hook to use applicant context
export function useApplicant() {
  const context = useContext(ApplicantContext);
  if (context === undefined) {
    throw new Error("useApplicant must be used within an ApplicantProvider");
  }
  return context;
}
