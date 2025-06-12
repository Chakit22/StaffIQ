import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import DashboardLayout from "../components/DashboardLayout";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  GET_CANDIDATES_CHOSEN_FOR_EACH_COURSE,
  GET_CANDIDATES_CHOSEN_FOR_MORE_THAN_THREE_COURSES,
  GET_CANDIDATES_NOT_CHOSEN_FOR_ANY_COURSE,
  GET_ALL_APPLICATIONS,
} from "../graphQL/queries";

const COLORS = [
  "#34d399",
  "#f87171",
  "#60a5fa",
  "#a78bfa",
  "#fbbf24",
  "#ec4899",
];

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

  const { data: allApplicationsData, loading: allApplicationsLoading } =
    useQuery(GET_ALL_APPLICATIONS);

  // Process data for charts when available
  const courseApplicationsChart = React.useMemo(() => {
    if (!courseCandidatesData?.getCandidatesChosenForEachCourse) return [];
    return courseCandidatesData.getCandidatesChosenForEachCourse.map(
      (item: any) => ({
        name: item.course.course_code,
        candidates: item.candidateCount,
      })
    );
  }, [courseCandidatesData]);

  const applicationStatusData = React.useMemo(() => {
    if (!allApplicationsData?.getAllApplications) return [];

    // Count applications by course
    const courseMap = new Map();
    allApplicationsData.getAllApplications.forEach((app: any) => {
      const courseCode = app.course.course_code;
      courseMap.set(courseCode, (courseMap.get(courseCode) || 0) + 1);
    });

    return Array.from(courseMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [allApplicationsData]);

  // Prepare candidate distribution data
  const candidateDistributionData = React.useMemo(() => {
    if (
      !multipleCourseCandidatesData?.getCandidatesChosenForMoreThanThreeCourses
    )
      return [];

    return multipleCourseCandidatesData.getCandidatesChosenForMoreThanThreeCourses.map(
      (item: any) => ({
        name: item.candidate.name.split(" ")[0], // First name only for brevity
        courses: item.courseCount,
      })
    );
  }, [multipleCourseCandidatesData]);

  const renderReport = () => {
    if (
      courseCandidatesLoading ||
      multipleCourseCandidatesLoading ||
      notChosenCandidatesLoading ||
      allApplicationsLoading
    ) {
      return <div className="text-center py-10">Loading reports data...</div>;
    }

    switch (activeReport) {
      case "courseCandidates":
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow">
              <h4 className="text-lg font-semibold mb-4">
                Candidates Per Course
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseApplicationsChart}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="candidates"
                    fill="#3b82f6"
                    name="Candidate Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "applicationStatus":
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow">
              <h4 className="text-lg font-semibold mb-4">
                Application Distribution
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={applicationStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    dataKey="value"
                  >
                    {applicationStatusData.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "candidateDistribution":
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow">
              <h4 className="text-lg font-semibold mb-4">
                Candidates with Multiple Courses
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={candidateDistributionData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="courses" fill="#8884d8" name="Course Count" />
                </BarChart>
              </ResponsiveContainer>
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
        <h2 className="text-2xl font-bold mb-6">Reports & Visual Insights</h2>

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
              onClick={() => setActiveReport("applicationStatus")}
              className={`px-4 py-2 rounded text-sm font-medium ${
                activeReport === "applicationStatus"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Application Distribution
            </button>
            <button
              onClick={() => setActiveReport("candidateDistribution")}
              className={`px-4 py-2 rounded text-sm font-medium ${
                activeReport === "candidateDistribution"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Multi-Course Candidates
            </button>
          </div>
        </div>

        {renderReport()}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
