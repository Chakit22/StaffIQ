/**
 * Top 4 things to create a Context
 * ContextProps (what all do we need to consume out of the context)
 * Creating a context
 * Creating a provider which provides the values which the consumer needs
 * Consuming a context
 */

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
}

const ApplicantContext = createContext<ApplicantContextProps | undefined>(
  undefined
);

export function ApplicantProvider({ children }: { children: React.ReactNode }) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  // Add an applicant into the list of applicants
  const addApplicant = (applicant: Applicant) => {
    const storedApplicants = localStorage.getItem("applicants");
    const storedApplicants_: Applicant[] = storedApplicants
      ? JSON.parse(storedApplicants)
      : [];
    storedApplicants_.push(applicant);
    localStorage.setItem("applicants", JSON.stringify(storedApplicants_));
    setApplicants(storedApplicants_);
  };

  // Get an applicant of a particular course
  const getApplicantsByCourse = (course_code: string) => {
    return applicants.filter(
      (applicant) => applicant.course_code === course_code
    );
  };

  // Get an applicant of a particular course
  const getApplicantsByCourseAndRole = (course_code: string, role: string) => {
    return applicants.filter(
      (applicant) =>
        applicant.course_code === course_code && applicant.role === role
    );
  };

  useEffect(() => {
    const storedApplicants = localStorage.getItem("applicants");
    const storedApplicants_: Applicant[] = storedApplicants
      ? JSON.parse(storedApplicants)
      : [];

    if (!storedApplicants) {
      localStorage.setItem("applicants", JSON.stringify([] as Applicant[]));
    }

    console.log(storedApplicants_);

    setApplicants(storedApplicants_);
  }, []);

  return (
    <ApplicantContext.Provider
      value={{
        applicants,
        addApplicant,
        getApplicantsByCourse,
        getApplicantsByCourseAndRole,
      }}
    >
      {children}
    </ApplicantContext.Provider>
  );
}

export function useApplicant() {
  const context = useContext(ApplicantContext);

  if (context === undefined) {
    throw new Error("useApplicant must be used within ApplicantProvider");
  }

  return context;
}
