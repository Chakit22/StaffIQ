"use client";

import { createContext, useContext, ReactNode } from "react";

interface Applicant {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  course_code: string;
  role: string;
  availability: string;
  skills: string;
}

interface ApplicantContextType {
  applicants: Applicant[];
}

const ApplicantContext = createContext<ApplicantContextType>({
  applicants: [],
});

export function ApplicantProvider({ children }: { children: ReactNode }) {
  return (
    <ApplicantContext.Provider value={{ applicants: [] }}>
      {children}
    </ApplicantContext.Provider>
  );
}

export function useApplicant() {
  return useContext(ApplicantContext);
}
