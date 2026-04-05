import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import DashboardLayout from "../components/DashboardLayout";
import {
  GET_CANDIDATES_CHOSEN_FOR_EACH_COURSE,
  GET_CANDIDATES_CHOSEN_FOR_MORE_THAN_THREE_COURSES,
  GET_CANDIDATES_NOT_CHOSEN_FOR_ANY_COURSE,
} from "../graphQL/queries";

interface Candidate {
  id: string;
  name: string;
  email: string;
  access?: boolean;
  dateOfJoining?: string;
}

interface Course {
  id: string;
  name: string;
  course_code: string;
}

interface CourseCandidateData {
  course: Course;
  candidates: Candidate[];
  candidateCount: number;
}

interface MultiCourseCandidate {
  candidate: Candidate;
  courseCount: number;
  courses: Course[];
}

interface NotChosenCandidate {
  candidate: Candidate;
}

const Reports = () => {
  const [activeReport, setActiveReport] = useState<string>("courseCandidates");

  const { data: courseCandidatesData, loading: courseCandidatesLoading } =
    useQuery(GET_CANDIDATES_CHOSEN_FOR_EACH_COURSE);

  const {
    data: multipleCourseCandidatesData,
    loading: multipleCourseCandidatesLoading,
  } = useQuery(GET_CANDIDATES_CHOSEN_FOR_MORE_THAN_THREE_COURSES);

  const { data: notChosenCandidatesData, loading: notChosenCandidatesLoading } =
    useQuery(GET_CANDIDATES_NOT_CHOSEN_FOR_ANY_COURSE);

  const tableHeaderClass = "p-2 border-b border-border text-gray-400 text-sm text-left";
  const tableCellClass = "p-2 border-b border-border text-gray-300";

  const renderReport = () => {
    if (courseCandidatesLoading || multipleCourseCandidatesLoading || notChosenCandidatesLoading) {
      return <div className="text-center py-10 text-muted">Loading reports data...</div>;
    }

    switch (activeReport) {
      case "courseCandidates":
        const courseData: CourseCandidateData[] =
          courseCandidatesData?.getCandidatesChosenForEachCourse || [];
        return (
          <div className="bg-card p-6 rounded-xl border border-border">
            <h4 className="text-lg font-semibold mb-4 text-gray-200">Candidates Per Course</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={tableHeaderClass}>Course</th>
                    <th className={tableHeaderClass}>Code</th>
                    <th className={tableHeaderClass}>Count</th>
                    <th className={tableHeaderClass}>Candidates</th>
                  </tr>
                </thead>
                <tbody>
                  {courseData.length === 0 ? (
                    <tr><td colSpan={4} className="text-center text-muted p-4">No data available</td></tr>
                  ) : (
                    courseData.map((item: CourseCandidateData, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-background/30" : ""}>
                        <td className={tableCellClass}>{item.course.name}</td>
                        <td className={tableCellClass}>{item.course.course_code}</td>
                        <td className={tableCellClass}>{item.candidateCount}</td>
                        <td className={tableCellClass}>
                          <div className="max-h-20 overflow-y-auto text-sm">
                            {item.candidates.map((c: Candidate, idx: number) => (
                              <div key={idx} className="mb-1">{c.name} ({c.email})</div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "multiCourseCandidates":
        const multiCourseData: MultiCourseCandidate[] =
          multipleCourseCandidatesData?.getCandidatesChosenForMoreThanThreeCourses || [];
        return (
          <div className="bg-card p-6 rounded-xl border border-border">
            <h4 className="text-lg font-semibold mb-4 text-gray-200">Candidates Chosen for Multiple Courses</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={tableHeaderClass}>Name</th>
                    <th className={tableHeaderClass}>Email</th>
                    <th className={tableHeaderClass}>Courses</th>
                    <th className={tableHeaderClass}>Course List</th>
                  </tr>
                </thead>
                <tbody>
                  {multiCourseData.length === 0 ? (
                    <tr><td colSpan={4} className="text-center text-muted p-4">No data available</td></tr>
                  ) : (
                    multiCourseData.map((item: MultiCourseCandidate, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-background/30" : ""}>
                        <td className={tableCellClass}>{item.candidate.name}</td>
                        <td className={tableCellClass}>{item.candidate.email}</td>
                        <td className={tableCellClass}>{item.courseCount}</td>
                        <td className={tableCellClass}>
                          <div className="max-h-20 overflow-y-auto text-sm">
                            {item.courses.map((course: Course, idx: number) => (
                              <div key={idx} className="mb-1">{course.name} ({course.course_code})</div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "notChosenCandidates":
        const notChosenData: NotChosenCandidate[] =
          notChosenCandidatesData?.getCandidatesNotChosenForAnyCourse || [];
        return (
          <div className="bg-card p-6 rounded-xl border border-border">
            <h4 className="text-lg font-semibold mb-4 text-gray-200">Candidates Not Chosen for Any Course</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={tableHeaderClass}>Name</th>
                    <th className={tableHeaderClass}>Email</th>
                    <th className={tableHeaderClass}>Date Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {notChosenData.length === 0 ? (
                    <tr><td colSpan={3} className="text-center text-muted p-4">No data available</td></tr>
                  ) : (
                    notChosenData.map((item: NotChosenCandidate, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-background/30" : ""}>
                        <td className={tableCellClass}>{item.candidate.name}</td>
                        <td className={tableCellClass}>{item.candidate.email}</td>
                        <td className={tableCellClass}>
                          {item.candidate.dateOfJoining
                            ? new Date(item.candidate.dateOfJoining).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return <div className="text-muted">Select a report type</div>;
    }
  };

  return (
    <DashboardLayout>
      <div className="px-6 py-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-200">Reports & Insights</h2>

        <div className="mb-6 bg-card p-4 rounded-xl border border-border">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "courseCandidates", label: "Candidates Per Course" },
              { key: "multiCourseCandidates", label: "Multi-Course Candidates" },
              { key: "notChosenCandidates", label: "Candidates Without Courses" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveReport(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeReport === key
                    ? "bg-primary text-white"
                    : "bg-background text-gray-400 hover:bg-primary/20 hover:text-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {renderReport()}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
