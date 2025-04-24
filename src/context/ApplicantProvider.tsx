"use client";

import { Applicant } from "@/types/ApplicantType";
import { createContext, useContext, useEffect, useState } from "react";
// import { useLoading } from "./LoadingProvider";

interface ApplicantContextProps {
  applicants: Applicant[];
  addApplicant: (applicant: Applicant) => void;
  getApplicantsByCourse: (course_code: string) => Applicant[];
  getApplicantsByCourseAndRole: (
    course_code: string,
    role: string
  ) => Applicant[];
  getApplicationsOfCurrentUser: (user_id: number) => Applicant[];
  applicantsLoading: boolean;
}

const ApplicantContext = createContext<ApplicantContextProps | undefined>(
  undefined
);

export function ApplicantProvider({ children }: { children: React.ReactNode }) {
  console.log("Application provider re-rendered!");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  // const { loadingStates, setLoading } = useLoading();

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
    setLoading("applicantsLoading", false);
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

  // Get an applicant of a particular course and role

  //Get applicants for a course with a specific role
  const getApplicantsByCourseAndRole = (course_code: string, role: string) => {
    return applicants.filter(
      (applicant) =>
        applicant.course_code === course_code &&
        applicant.role.toLowerCase() === role.toLowerCase()
    );
  };

  // console.log("Inside Applicants Provider!");

  return (
    <ApplicantContext.Provider
      value={{
        applicants,
        addApplicant,
        getApplicantsByCourse,
        getApplicantsByCourseAndRole,
        getApplicationsOfCurrentUser,
        applicantsLoading: loadingStates["applicantsLoading"],
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
