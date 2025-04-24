import { Applicant } from "@/types/ApplicantType";
import { create } from "zustand";

// Define state props
interface ApplicantStore {
  applicants: Applicant[];
  addApplicant: (applicant: Applicant) => void;
  getApplicantsByCourse: (course_code: string) => Applicant[];
  getApplicantsByCourseAndRole: (
    course_code: string,
    role: string
  ) => Applicant[];
  getApplicationsOfCurrentUser: (user_id: number) => Applicant[];
  loading: boolean;
  setInitialState: () => void;
}

// Create a store
export const useApplicantStore = create<ApplicantStore>((set, get) => ({
  applicants: [],
  loading: true,
  addApplicant: (applicant: Applicant) => {
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
      set((state) => ({ ...state, applicants: storedApplicants_ }));
    }
  },
  getApplicantsByCourse: (course_code: string) => {
    return get().applicants.filter(
      (applicant) => applicant.course_code === course_code
    );
  },
  getApplicantsByCourseAndRole: (course_code: string, role: string) => {
    return get().applicants.filter(
      (applicant) =>
        applicant.course_code === course_code &&
        applicant.role.toLowerCase() === role.toLowerCase()
    );
  },
  getApplicationsOfCurrentUser: (user_id: number) => {
    return get().applicants.filter(
      (applicant) => applicant.user_id === user_id
    );
  },
  setInitialState: () => {
    const storedApplicants = localStorage.getItem("applicants");
    const storedApplicants_: Applicant[] = storedApplicants
      ? JSON.parse(storedApplicants)
      : [];

    if (!storedApplicants) {
      localStorage.setItem("applicants", JSON.stringify([]));
    }

    set((state) => ({ ...state, applicants: storedApplicants_ }));
    set((state) => ({ ...state, loading: false }));
  },
}));
