"use client";

import { createContext, useContext, ReactNode } from "react";

interface RankingContextType {
  rankings: Record<string, Record<string, Record<string, number[]>>>[];
  saveRanking: (courseCode: string, role: string, userId: string, ids: number[]) => void;
}

const RankingContext = createContext<RankingContextType>({
  rankings: [],
  saveRanking: () => {},
});

export function RankingProvider({ children }: { children: ReactNode }) {
  return (
    <RankingContext.Provider value={{ rankings: [], saveRanking: () => {} }}>
      {children}
    </RankingContext.Provider>
  );
}

export function useRanking() {
  return useContext(RankingContext);
}
