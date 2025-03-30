"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Rankings } from "@/types/Ranking";

interface RankingContextType {
  rankings: Rankings;
  saveRanking: (
    courseCode: string,
    role: string,
    lecturerId: number,
    applicants: number[]
  ) => void;
  getMostLeastAndUnchosen: (
    role: string,
    rankings: Rankings,
    applicants: number[]
  ) => {
    mostChosenApplicant: number | undefined;
    leastChosenApplicant: number | undefined;
    unChosenApplicants: number[] | undefined;
  };
}

const RankingContext = createContext<RankingContextType | undefined>(undefined);

export const RankingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [rankings, setRankings] = useState<Rankings>([]);

  useEffect(() => {
    const storedRankings = localStorage.getItem("rankings");
    if (storedRankings) {
      setRankings(JSON.parse(storedRankings));
    }
  }, []);

  const saveRanking = (
    courseCode: string,
    role: string,
    lecturerId: number,
    applicants: number[]
  ) => {
    const updatedRankings = [...rankings];

    let courseIndex = updatedRankings.findIndex((c) => c[courseCode]);
    if (courseIndex === -1) {
      updatedRankings.push({
        [courseCode]: {
          [role]: {
            [lecturerId]: applicants,
          },
        },
      });
    } else {
      if (!updatedRankings[courseIndex][courseCode][role]) {
        updatedRankings[courseIndex][courseCode][role] = {};
      }
      updatedRankings[courseIndex][courseCode][role][lecturerId] = applicants;
    }

    setRankings(updatedRankings);
    localStorage.setItem("rankings", JSON.stringify(updatedRankings));
  };

  const getMostLeastAndUnchosen = (
    role: string,
    rankings: Rankings,
    applicants: number[]
  ) => {
    let relevantRankings: { [lecturerId: number]: number[] } = {};

    rankings.forEach((course) => {
      for (const courseCode in course) {
        if (course[courseCode][role]) {
          relevantRankings = {
            ...relevantRankings,
            ...course[courseCode][role],
          };
        }
      }
    });

    const n = applicants.length;
    let rankMap: Map<number, number[]> = new Map();
    let chosenApplicants: { id: number; cnt: number }[] = [];

    for (const app of applicants) {
      rankMap.set(app, Array(n).fill(0));
    }

    let max_ranks = -Infinity;
    for (const lecturerId in relevantRankings) {
      if (relevantRankings[Number(lecturerId)].length > max_ranks) {
        max_ranks = relevantRankings[Number(lecturerId)].length;
      }
    }

    for (let i = 0; i < max_ranks; ++i) {
      for (const lecturerId in relevantRankings) {
        const lecturerIdNum = Number(lecturerId);
        if (i < relevantRankings[lecturerIdNum].length) {
          const app_id = relevantRankings[lecturerIdNum][i];
          let rank_arr = rankMap.get(app_id)!;
          rank_arr[i]++;
          rankMap.set(app_id, rank_arr);
        }
      }
    }

    let max_cnt = -Infinity,
      min_cnt = Infinity;
    for (const [app_id, arr] of rankMap) {
      let chosen_cnt = arr.reduce((sum, val) => sum + val, 0);
      chosenApplicants.push({ id: app_id, cnt: chosen_cnt });
      if (chosen_cnt !== 0 && chosen_cnt > max_cnt) max_cnt = chosen_cnt;
      if (chosen_cnt !== 0 && chosen_cnt < min_cnt) min_cnt = chosen_cnt;
    }

    const mostChosenApplicants = chosenApplicants
      .filter((app) => app.cnt === max_cnt)
      .map((app) => app.id);
    const leastChosenApplicants = chosenApplicants
      .filter((app) => app.cnt === min_cnt)
      .map((app) => app.id);

    return {
      mostChosenApplicant: mostChosenApplicants[0],
      leastChosenApplicant: leastChosenApplicants[0],
      unChosenApplicants: chosenApplicants
        .filter((app) => app.cnt === 0)
        .map((app) => app.id),
    };
  };

  return (
    <RankingContext.Provider
      value={{ rankings, saveRanking, getMostLeastAndUnchosen }}
    >
      {children}
    </RankingContext.Provider>
  );
};

export const useRanking = () => {
  const context = useContext(RankingContext);
  if (!context) {
    throw new Error("useRanking must be used within a RankingProvider");
  }
  return context;
};
