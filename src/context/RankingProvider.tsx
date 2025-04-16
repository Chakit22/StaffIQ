"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Rankings } from "@/types/Ranking";
import { useLoading } from "./LoadingProvider";

interface RankingContextType {
  rankings: Rankings;
  saveRanking: (
    courseCode: string,
    role: string,
    lecturerId: number,
    applicants: number[]
  ) => void;
  getMostLeastAndUnchosen: (
    courseCode: string,
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
  const { loadingStates, setLoading } = useLoading();

  useEffect(() => {
    const storedRankings = localStorage.getItem("rankings");
    if (storedRankings) {
      setRankings(JSON.parse(storedRankings));
    }
    setLoading("rankingLoading", false);
  }, []);

  const saveRanking = (
    courseCode: string,
    role: string,
    lecturerId: number,
    applicants: number[]
  ) => {
    const updatedRankings = [...rankings];

    const courseIndex = updatedRankings.findIndex(
      (c) => c[courseCode] != undefined
    );

    console.log("updated Rankings :");
    console.log(updatedRankings);
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
    courseCode: string,
    role: string,
    rankings: Rankings,
    applicants: number[]
  ) => {
    const courseIndex = rankings.findIndex((c) => c[courseCode] != undefined);

    // There is not ratings updated for this course
    if (courseIndex === -1) {
      return {
        mostChosenApplicant: undefined,
        leastChosenApplicant: undefined,
        unChosenApplicants: undefined,
      };
    }

    const relevantRankings: { [lecturerId: number]: number[] } =
      rankings[courseIndex][courseCode][role];

    const n = applicants.length;
    const rankMap: Map<number, number[]> = new Map();
    const chosenApplicants: { id: number; cnt: number }[] = [];

    for (const app of applicants) {
      rankMap.set(app, Array(n).fill(0));
    }

    let max_ranks = -Infinity;
    for (const lecturerId in relevantRankings) {
      if (relevantRankings[lecturerId].length > max_ranks) {
        max_ranks = relevantRankings[Number(lecturerId)].length;
      }
    }

    for (let i = 0; i < max_ranks; ++i) {
      for (const lecturerId in relevantRankings) {
        if (i < relevantRankings[lecturerId].length) {
          const app_id = relevantRankings[lecturerId][i];
          const rank_arr = rankMap.get(app_id)!;
          rank_arr[i]++;
          rankMap.set(app_id, rank_arr);
        }
      }
    }

    let max_cnt = -Infinity,
      min_cnt = Infinity;
    for (const [app_id, arr] of rankMap) {
      const chosen_cnt = arr.reduce((sum, val) => sum + val, 0);
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
