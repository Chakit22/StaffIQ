import { Ranking } from "@/types/Ranking";

// Find the most chosen, leastChosen and unchosen applicants for the given role
export const getMostLeastAndUnchosen = (
  role: string,
  rankings: Ranking,
  applicants: string[]
): {
  mostChosenApplicant: string | undefined;
  leastChosenApplicant: string | undefined;
  unChosenApplicants: string[] | undefined;
} => {
  const n = applicants.length;
  //   Map<app_ids, ranks[]>
  let rankMap: Map<string, number[]> = new Map();

  let chosenApplicants: { id: string; cnt: number }[] = [];

  for (const app of applicants) {
    // Set all the count to 0 for the applicant
    rankMap.set(app, Array(n).fill(0));
  }

  //   Find the maximum number of ranks
  let max_ranks = -Infinity;

  for (const lecturer_id of Object.keys(rankings)) {
    if (rankings[lecturer_id].length > max_ranks) {
      max_ranks = rankings[lecturer_id].length;
    }
  }

  for (let i = 0; i < max_ranks; ++i) {
    for (const lecturer_id of Object.keys(rankings)) {
      if (i < rankings[lecturer_id].length) {
        const app_id = rankings[lecturer_id][i];
        let rank_arr = rankMap.get(app_id)!;
        rank_arr[i]++;
        rankMap.set(app_id, rank_arr);
      }
    }
  }

  let max_cnt = -Infinity,
    min_cnt = Infinity;

  for (const [app_id, arr] of rankMap) {
    let chosen_cnt = 0;
    for (let i = 0; i < arr.length; ++i) {
      chosen_cnt += arr[i];
    }
    chosenApplicants.push({ id: app_id, cnt: chosen_cnt });
    if (chosen_cnt != 0 && chosen_cnt > max_cnt) {
      max_cnt = chosen_cnt;
    }

    if (chosen_cnt != 0 && chosen_cnt < min_cnt) {
      min_cnt = chosen_cnt;
    }
  }

  const mostChosenApplicants = chosenApplicants
    .filter((applicant) => applicant.cnt === max_cnt)
    .map((applicant) => applicant.id);

  const leastChosenApplicants = chosenApplicants
    .filter((applicant) => applicant.cnt === min_cnt)
    .map((applicant) => applicant.id);

  if (min_cnt == max_cnt) {
    // All are equall chosen so no most and least chosen candidates
    // return {
    //   mostChosenApplicant: null,
    //   leastChosenApplicant: null,
    //   unChosenApplicants: chosenApplicants
    //     .filter((applicant) => applicant.cnt === 0)
    //     .map((applicant) => applicant.id),
    // };

    // For now return the first value from the list
    return {
      mostChosenApplicant: mostChosenApplicants[0],
      leastChosenApplicant: leastChosenApplicants[0],
      unChosenApplicants: chosenApplicants
        .filter((applicant) => applicant.cnt === 0)
        .map((applicant) => applicant.id),
    };
  }

  // Returns the lsit of mostChosen and leastChosen Applicants
  // Picks the first one
  return {
    mostChosenApplicant: mostChosenApplicants[0],
    leastChosenApplicant: leastChosenApplicants[0],
    unChosenApplicants: chosenApplicants
      .filter((applicant) => applicant.cnt === 0)
      .map((applicant) => applicant.id),
  };
};
