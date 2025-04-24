"use client";

import { courses } from "@/utils/courses";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import Layout from "@/components/layout";
import LoaderComponent from "@/components/Loading";
import { useUserStore } from "@/stores/user-store";
import { useApplicantStore } from "@/stores/applicant-store";
import { useRankingStore } from "@/stores/ranking-store";
//color palette for charts
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function GraphPage() {
  const { user, userLoading, setInitialState } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    setInitialState();
  }, []);

  //redirect to signin if not logged in
  useEffect(() => {
    if (!userLoading && !user) router.replace("/signin");
  }, [userLoading, user, router]);

  if (userLoading) {
    return <LoaderComponent />;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1679547202671-f9dbbf466db4?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="min-h-screen bg-white/80 backdrop-blur-sm">
        <Layout>
          <GraphContent />
        </Layout>
      </div>
    </div>
  );
}

function GraphContent() {
  const { applicants } = useApplicantStore();
  const { rankings } = useRankingStore();
  const router = useRouter();

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  //remove duplicates based on id, role, and course
  const uniqueApplicants = useMemo(() => {
    const seen = new Set();
    return applicants.filter((a) => {
      const key = `${a.id}-${a.role}-${a.course_code}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [applicants]);

  //filter applicants by selected course and role
  const filteredApplicants = useMemo(() => {
    return uniqueApplicants.filter((a) => {
      const matchCourse = selectedCourse
        ? a.course_code === selectedCourse
        : true;
      const matchRole = selectedRole
        ? a.role.toLowerCase() === selectedRole.toLowerCase()
        : true;
      return matchCourse && matchRole;
    });
  }, [uniqueApplicants, selectedCourse, selectedRole]);

  //count roles in filtered applicants
  const summaryStats = useMemo(() => {
    return filteredApplicants.reduce(
      (acc, curr) => {
        const role = curr.role.toLowerCase();
        if (role === "tutor" || role === "lab assistant") acc[role]++;
        return acc;
      },
      { tutor: 0, "lab assistant": 0 }
    );
  }, [filteredApplicants]);

  //create pie chart data from availability values
  const availabilityData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredApplicants.forEach((a) => {
      map[a.availability] = (map[a.availability] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredApplicants]);

  //create bar chart data grouped by course and role
  const courseWiseData = useMemo(() => {
    const map: Record<
      string,
      { course: string; tutor: number; "lab assistant": number }
    > = {};
    filteredApplicants.forEach((a) => {
      const courseMeta = courses.find((c) => c.code === a.course_code);
      const courseLabel = courseMeta
        ? `${courseMeta.code} - ${courseMeta.label}`
        : a.course_code;

      if (!map[courseLabel]) {
        map[courseLabel] = {
          course: courseLabel,
          tutor: 0,
          "lab assistant": 0,
        };
      }
      const role = a.role.toLowerCase() as "tutor" | "lab assistant";
      map[courseLabel][role]++;
    });
    return Object.values(map);
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

  return (
    <div className="min-h-screen bg-gray-50 text-blue-900">
      <div className="py-4 mb-8">
        <h1 className="text-2xl font-bold text-center">
          📊 Applicant Analytics
        </h1>
        <div
          className="text-sm mt-2 text-center underline cursor-pointer"
          onClick={() => router.push("/lecturer")}
        >
          ← Back to Lecturer Dashboard
        </div>
      </div>

      {/*dropdown filters*/}
      <div className="flex flex-wrap justify-center gap-4 p-4">
        <select
          className="p-2 border rounded"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} - {c.label}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="tutor">Tutor</option>
          <option value="lab assistant">Lab Assistant</option>
        </select>
      </div>

      {/*summary stats boxes*/}
      <section className="bg-white shadow rounded-lg p-6 w-full max-w-5xl mx-auto mb-10">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Summary Stats
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-100 p-4 rounded">
            Total: {filteredApplicants.length}
          </div>
          <div className="bg-green-100 p-4 rounded">
            Tutors: {summaryStats.tutor}
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            Lab Assistants: {summaryStats["lab assistant"]}
          </div>
        </div>
      </section>

      {/*line chart of applicant selections*/}
      <section className="bg-white p-6 rounded-lg shadow max-w-5xl mx-auto mb-10">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Applicant Popularity Insights
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={applicantSelectionStats}>
            <XAxis dataKey="name" angle={-20} interval={0} textAnchor="end" />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value) => [`${value} selections`, "Selections"]}
              labelFormatter={(label, payload) => {
                const item = payload[0]?.payload;
                return `Applicant: ${item?.name}\n${item?.role} (${item?.course})`;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              activeDot={{ r: 8 }}
              name="Selections"
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/*table showing course-wise applicant stats*/}
      <section className="bg-white p-6 rounded-lg shadow max-w-5xl mx-auto mb-20">
        <h2 className="text-lg font-semibold mb-6 text-center">
          📋 Course-wise Applicant Summary
        </h2>
        {courses.map((course) => {
          const applicantsForCourse = applicantSelectionStats.filter(
            (a) => a.course === course.code
          );

          if (!applicantsForCourse.length) return null;

          const max = Math.max(...applicantsForCourse.map((a) => a.count));
          const min = Math.min(
            ...applicantsForCourse
              .filter((a) => a.count > 0)
              .map((a) => a.count)
          );

          return (
            <div key={course.code} className="mb-8">
              <h3 className="text-md font-semibold mb-2 text-blue-700">
                {course.code} - {course.label}
              </h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700 border-b">
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Role</th>
                      <th className="px-4 py-2">Selections</th>
                      <th className="px-4 py-2">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicantsForCourse.map((a) => {
                      let category = "Unchosen";
                      if (a.count === max && a.count > 0)
                        category = "Most Chosen";
                      else if (a.count === min && a.count > 0)
                        category = "Least Chosen";

                      return (
                        <tr
                          key={`${course.code}-${a.id}-${a.role}`}
                          className="border-b last:border-none"
                        >
                          <td className="px-4 py-2 capitalize">{a.name}</td>
                          <td className="px-4 py-2 capitalize">{a.role}</td>
                          <td className="px-4 py-2">{a.count}</td>
                          <td className="px-4 py-2 text-sm">
                            <span
                              className={`px-2 py-1 rounded font-medium ${
                                category === "Most Chosen"
                                  ? "bg-green-100 text-green-700"
                                  : category === "Least Chosen"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {category}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </section>

      {/*side-by-side pie and bar charts*/}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-20">
        {/*availability pie chart*/}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Availability Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={availabilityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {availabilityData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/*course-role bar chart*/}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Course-wise Role Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={courseWiseData} layout="vertical">
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="course" type="category" width={200} />
              <Tooltip />
              <Legend />
              <Bar dataKey="tutor" stackId="a" fill="#3b82f6" />
              <Bar dataKey="lab assistant" stackId="a" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
