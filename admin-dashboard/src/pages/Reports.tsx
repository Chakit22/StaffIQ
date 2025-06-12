import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import DashboardLayout from "../components/DashboardLayout";
import {
  GET_CANDIDATES_CHOSEN_FOR_EACH_COURSE,
  GET_CANDIDATES_CHOSEN_FOR_MORE_THAN_THREE_COURSES,
  GET_CANDIDATES_NOT_CHOSEN_FOR_ANY_COURSE,
} from "../graphQL/queries";

// Define TypeScript interfaces for the API responses
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

  // Fetch data for various reports
  const { data: courseCandidatesData, loading: courseCandidatesLoading } =
    useQuery(GET_CANDIDATES_CHOSEN_FOR_EACH_COURSE);

  const {
    data: multipleCourseCandidatesData,
    loading: multipleCourseCandidatesLoading,
  } = useQuery(GET_CANDIDATES_CHOSEN_FOR_MORE_THAN_THREE_COURSES);

  const { data: notChosenCandidatesData, loading: notChosenCandidatesLoading } =
    useQuery(GET_CANDIDATES_NOT_CHOSEN_FOR_ANY_COURSE);

  const renderReport = () => {
    if (
      courseCandidatesLoading ||
      multipleCourseCandidatesLoading ||
      notChosenCandidatesLoading
    ) {
      return <div className="text-center py-10">Loading reports data...</div>;
    }

    switch (activeReport) {
      case "courseCandidates":
        const courseData: CourseCandidateData[] =
          courseCandidatesData?.getCandidatesChosenForEachCourse || [];
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow">
              <h4 className="text-lg font-semibold mb-4">
                Candidates Per Course
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Course</th>
                      <th className="border p-2 text-left">Course Code</th>
                      <th className="border p-2 text-left">
                        Number of Candidates
                      </th>
                      <th className="border p-2 text-left">Candidates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="border p-2 text-center text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    ) : (
                      courseData.map(
                        (item: CourseCandidateData, index: number) => (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? "bg-gray-50" : ""}
                          >
                            <td className="border p-2">{item.course.name}</td>
                            <td className="border p-2">
                              {item.course.course_code}
                            </td>
                            <td className="border p-2">
                              {item.candidateCount}
                            </td>
                            <td className="border p-2">
                              <div className="max-h-20 overflow-y-auto">
                                {item.candidates.map(
                                  (candidate: Candidate, idx: number) => (
                                    <div key={idx} className="mb-1">
                                      {candidate.name} ({candidate.email})
                                    </div>
                                  )
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "multiCourseCandidates":
        const multiCourseData: MultiCourseCandidate[] =
          multipleCourseCandidatesData?.getCandidatesChosenForMoreThanThreeCourses ||
          [];
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow">
              <h4 className="text-lg font-semibold mb-4">
                Candidates Chosen for Multiple Courses
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Candidate Name</th>
                      <th className="border p-2 text-left">Email</th>
                      <th className="border p-2 text-left">
                        Number of Courses
                      </th>
                      <th className="border p-2 text-left">Courses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {multiCourseData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="border p-2 text-center text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    ) : (
                      multiCourseData.map(
                        (item: MultiCourseCandidate, index: number) => (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? "bg-gray-50" : ""}
                          >
                            <td className="border p-2">
                              {item.candidate.name}
                            </td>
                            <td className="border p-2">
                              {item.candidate.email}
                            </td>
                            <td className="border p-2">{item.courseCount}</td>
                            <td className="border p-2">
                              <div className="max-h-20 overflow-y-auto">
                                {item.courses.map(
                                  (course: Course, idx: number) => (
                                    <div key={idx} className="mb-1">
                                      {course.name} ({course.course_code})
                                    </div>
                                  )
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "notChosenCandidates":
        const notChosenData: NotChosenCandidate[] =
          notChosenCandidatesData?.getCandidatesNotChosenForAnyCourse || [];
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow">
              <h4 className="text-lg font-semibold mb-4">
                Candidates Not Chosen for Any Course
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Candidate Name</th>
                      <th className="border p-2 text-left">Email</th>
                      <th className="border p-2 text-left">Date of Joining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notChosenData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="border p-2 text-center text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    ) : (
                      notChosenData.map(
                        (item: NotChosenCandidate, index: number) => (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? "bg-gray-50" : ""}
                          >
                            <td className="border p-2">
                              {item.candidate.name}
                            </td>
                            <td className="border p-2">
                              {item.candidate.email}
                            </td>
                            <td className="border p-2">
                              {item.candidate.dateOfJoining
                                ? new Date(
                                    item.candidate.dateOfJoining
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a report type</div>;
    }
  };

  return (
    <DashboardLayout>
      <div className="px-6 py-6">
        <h2 className="text-2xl font-bold mb-6">Reports & Insights</h2>

        <div className="mb-6 bg-white p-4 rounded shadow">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveReport("courseCandidates")}
              className={`px-4 py-2 rounded text-sm font-medium ${
                activeReport === "courseCandidates"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Candidates Per Course
            </button>
            <button
              onClick={() => setActiveReport("multiCourseCandidates")}
              className={`px-4 py-2 rounded text-sm font-medium ${
                activeReport === "multiCourseCandidates"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Multi-Course Candidates
            </button>
            <button
              onClick={() => setActiveReport("notChosenCandidates")}
              className={`px-4 py-2 rounded text-sm font-medium ${
                activeReport === "notChosenCandidates"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Candidates Without Courses
            </button>
          </div>
        </div>

        {renderReport()}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
