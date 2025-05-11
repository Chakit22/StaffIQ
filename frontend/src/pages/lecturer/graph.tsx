"use client";

import { useAuth } from "@/context/UserProvider";
import { RankingProvider } from "@/context/RankingProvider";
import { courses } from "@/utils/courses";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardTitle } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGraphStats from "@/hooks/useGraphStats";

//color palette for charts
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function GraphPage() {
  const { user, userLoading } = useAuth();
  const router = useRouter();

  //redirect to signin if not logged in
  useEffect(() => {
    if (!userLoading && !user) router.replace("/signin");
  }, [userLoading, user, router]);

  if (userLoading) {
    return <LoaderComponent />;
  }

  return (
    <Layout>
      <RankingProvider>
        <GraphContent />
      </RankingProvider>
    </Layout>
  );
}

function GraphContent() {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Custom hook to get filtered applicants, summary stats, availability data, and applicant selection stats
  const {
    filteredApplicants,
    summaryStats,
    availabilityData,
    applicantSelectionStats,
    countMaxMinUnchosen,
  } = useGraphStats({
    selectedCourse,
    selectedRole,
  });

  return (
    <div className="bg-gray-50 text-blue-900 flex flex-col gap-4">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-2xl font-bold">📊 Applicant Analytics</h1>
        <div
          className="text-sm underline cursor-pointer"
          onClick={() => router.push("/lecturer")}
        >
          ← Back to Lecturer Dashboard
        </div>
      </div>

      {/*dropdown filters*/}
      <div className="flex flex-wrap justify-center gap-4 p-4">
        <Select
          value={selectedCourse}
          onValueChange={(value) => setSelectedCourse(value)}
        >
          <SelectTrigger className="max-w-full">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.code} - {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedRole}
          onValueChange={(value) => setSelectedRole(value)}
        >
          <SelectTrigger className="max-w-full">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tutor">Tutor</SelectItem>
            <SelectItem value="lab assistant">Lab Assistant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/*summary stats boxes*/}
      <Card className="p-6">
        <CardTitle className="text-center">Summary Stats</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-100 p-4 rounded">
            Total: {filteredApplicants.length}
          </div>
          <div className="bg-green-100 p-4 rounded">
            Tutors: {summaryStats["tutor"]}
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            Lab Assistants: {summaryStats["lab assistant"]}
          </div>
        </div>
      </Card>

      {/*line chart of applicant selections*/}
      <Card className="p-6">
        <CardTitle className="text-center">
          Applicant Popularity Insights
        </CardTitle>
        <div className="w-full overflow-x-auto">
          <div style={{ minWidth: "500px" }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicantSelectionStats} margin={{ bottom: 40 }}>
                <XAxis
                  dataKey="name"
                  angle={-20}
                  interval={0}
                  textAnchor="end"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    // On smaller screens, truncate long names
                    return value.length > 15
                      ? `${value.substring(0, 15)}...`
                      : value;
                  }}
                  height={60}
                />
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
          </div>
        </div>
      </Card>

      {/*table showing course-wise applicant stats*/}
      <Card className="p-6">
        <CardTitle className="text-center">
          📋 Course-wise Applicant Summary
        </CardTitle>
        {courses.map((course) => {
          const result = countMaxMinUnchosen(course.code);

          if (!result) return null;
          const { applicantsForCourse, max, min } = result;

          return (
            <div key={course.code} className="flex flex-col gap-2 mb-6">
              <h3 className="text-md font-semibold text-blue-700">
                {course.code} - {course.label}
              </h3>
              <div className="border rounded overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-100 text-gray-700 border-b">
                    <TableRow>
                      <TableHead className="px-4 py-2">Name</TableHead>
                      <TableHead className="px-4 py-2">Role</TableHead>
                      <TableHead className="px-4 py-2">Selections</TableHead>
                      <TableHead className="px-4 py-2">Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applicantsForCourse.map((a) => {
                      let category = "Unchosen";
                      if (a.count === max && a.count > 0)
                        category = "Most Chosen";
                      else if (a.count === min && a.count > 0)
                        category = "Least Chosen";

                      return (
                        <TableRow
                          key={`${course.code}-${a.id}-${a.role}`}
                          className="border-b last:border-none"
                        >
                          <TableCell className="px-4 py-2 capitalize">
                            {a.name}
                          </TableCell>
                          <TableCell className="px-4 py-2 capitalize">
                            {a.role}
                          </TableCell>
                          <TableCell className="px-4 py-2">{a.count}</TableCell>
                          <TableCell className="px-4 py-2 text-sm">
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
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          );
        })}
      </Card>

      {/*side-by-side pie charts*/}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/*availability pie chart*/}
          <div className="bg-white p-6 rounded-lg shadow overflow-hidden">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Availability Distribution
            </h2>
            <div style={{ minHeight: "250px" }}>
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
          </div>
        </div>
      </Card>
    </div>
  );
}
