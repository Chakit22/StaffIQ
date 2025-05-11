import { useApplicant } from "@/context/ApplicantProvider";
import { useRanking } from "@/context/RankingProvider";
import { useMemo } from "react";

interface GraphStatsProps {
  selectedCourse: string;
  selectedRole: string;
}

export default function useGraphStats({
  selectedCourse,
  selectedRole,
}: GraphStatsProps) {
  const { applicants } = useApplicant();
  const { rankings } = useRanking();

  //filter applicants by selected course and role
  /**
   * Memoized function which only creates this new object when the applicants, selectedCourse, or selectedRole change.
   * Using useEffect would create a new object on every render, which would cause the chart to re-render on every render.
   * Basically using useEffect would cause one more re-render as we would need a new state for filteredApplicants.
   * Also a new object would not be created for applicants on any re-render.
   */
  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      const matchCourse = selectedCourse
        ? a.course_code === selectedCourse
        : true;
      const matchRole = selectedRole
        ? a.role.toLowerCase() === selectedRole.toLowerCase()
        : true;
      return matchCourse && matchRole;
    });
  }, [applicants, selectedCourse, selectedRole]);

  //count roles in filtered applicants
  // This function counts the number of tutors and lab assistants in the filtered applicants.
  const summaryStats = useMemo(() => {
    return filteredApplicants.reduce(
      (acc, curr) => {
        const role = curr.role.toLowerCase() as "tutor" | "lab assistant";
        acc[role]++;
        return acc;
      },
      { tutor: 0, "lab assistant": 0 }
    );
  }, [filteredApplicants]);

  //create pie chart data from availability values
  // This function creates a pie chart data based on how many applicants are part time or full time.
  const availabilityData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredApplicants.forEach((a) => {
      map[a.availability] = (map[a.availability] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredApplicants]);

  //count how many times each applicant was selected
  const applicantSelectionStats = useMemo(() => {
    const map = new Map<number, number>();

    for (const courseRanking of rankings) {
      const courseCode = Object.keys(courseRanking)[0];
      const courseRoles = courseRanking[courseCode];
      for (const role in courseRoles) {
        for (const lecturerId in courseRoles[role]) {
          const rankedIds = courseRoles[role][lecturerId];
          rankedIds.forEach((id) => {
            map.set(id, (map.get(id) || 0) + 1);
          });
        }
      }
    }

    return filteredApplicants.map((a) => ({
      id: a.id,
      name: `${a.firstname} ${a.lastname}`,
      role: a.role,
      course: a.course_code,
      count: map.get(a.id) || 0,
    }));
  }, [rankings, filteredApplicants]);

  // The function for most chosen, least chosen and unchosen applicants
  const countMaxMinUnchosen = (courseCode: string) => {
    const applicantsForCourse = applicantSelectionStats.filter(
      (a) => a.course === courseCode
    );

    if (!applicantsForCourse.length) return null;

    const max = Math.max(...applicantsForCourse.map((a) => a.count));
    const min = Math.min(
      ...applicantsForCourse.filter((a) => a.count > 0).map((a) => a.count)
    );

    return { applicantsForCourse, max, min };
  };

  return {
    filteredApplicants,
    summaryStats,
    availabilityData,
    applicantSelectionStats,
    countMaxMinUnchosen,
  };
}
