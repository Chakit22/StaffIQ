import { Rankings } from "@/types/Ranking";
import { create } from "zustand";

// Define state props
interface RankingStore {
  rankings: Rankings;
  saveRanking: (
    courseCode: string,
    role: string,
    lecturerId: number,
    applicants: number[]
  ) => void;
  loading: boolean;
  setInitialState: () => void;
}

// Create a store
export const useRankingStore = create<RankingStore>(() => ({
  rankings: [],
  loading: true,
  saveRanking: (
    courseCode: string,
    role: string,
    lecturerId: number,
    applicants: number[]
  ) => {
    console.log(courseCode, role, lecturerId, applicants);
  },
  setInitialState: () => {},
}));
