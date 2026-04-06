import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import DashboardLayout from "../components/DashboardLayout";
import {
  GET_CANDIDATES_CHOSEN_FOR_EACH_COURSE,
  GET_CANDIDATES_CHOSEN_FOR_MORE_THAN_THREE_COURSES,
  GET_CANDIDATES_NOT_CHOSEN_FOR_ANY_COURSE,
} from "../graphQL/queries";
import { BarChart3, Users, BookOpen, UserX, Loader2 } from "lucide-react";

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

const reportTabs = [
  { key: "courseCandidates", label: "Per Course", icon: BookOpen },
  { key: "multiCourseCandidates", label: "Multi-Course", icon: Users },
  { key: "notChosenCandidates", label: "Unassigned", icon: UserX },
];

const Reports = () => {
  const [activeReport, setActiveReport] = useState("courseCandidates");

  const { data: courseCandidatesData, loading: l1 } = useQuery(
    GET_CANDIDATES_CHOSEN_FOR_EACH_COURSE,
  );
  const { data: multipleCourseCandidatesData, loading: l2 } = useQuery(
    GET_CANDIDATES_CHOSEN_FOR_MORE_THAN_THREE_COURSES,
  );
  const { data: notChosenCandidatesData, loading: l3 } = useQuery(
    GET_CANDIDATES_NOT_CHOSEN_FOR_ANY_COURSE,
  );

  const isLoading = l1 || l2 || l3;

  const thClass =
    "p-4 text-left text-[11px] text-muted-text uppercase tracking-[0.15em] font-semibold";
  const tdClass = "p-4 text-[13px] text-gray-300";

  const renderReport = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-text">
          <Loader2 size={18} className="animate-spin" /> Loading report data...
        </div>
      );
    }

    switch (activeReport) {
      case "courseCandidates": {
        const data: CourseCandidateData[] =
          courseCandidatesData?.getCandidatesChosenForEachCourse || [];
        return (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className={thClass}>Course</th>
                <th className={thClass}>Code</th>
                <th className={thClass}>Count</th>
                <th className={thClass}>Candidates</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted-text p-12 text-sm">
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr key={idx} className="table-row border-b border-border/50 last:border-0">
                    <td className={tdClass + " font-medium"}>{item.course.name}</td>
                    <td className="p-4">
                      <span className="text-[11px] font-mono bg-surface px-2 py-0.5 rounded text-primary border border-border">
                        {item.course.course_code}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary text-[12px] font-bold border border-primary/20">
                        {item.candidateCount}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <div className="max-h-16 overflow-y-auto text-[12px] text-muted-text space-y-0.5">
                        {item.candidates.map((c, i) => (
                          <div key={i}>
                            <span className="text-gray-400">{c.name}</span>
                            <span className="text-muted mx-1">-</span>
                            <span>{c.email}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        );
      }

      case "multiCourseCandidates": {
        const data: MultiCourseCandidate[] =
          multipleCourseCandidatesData?.getCandidatesChosenForMoreThanThreeCourses || [];
        return (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className={thClass}>Candidate</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>Courses</th>
                <th className={thClass}>Course List</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted-text p-12 text-sm">
                    No candidates selected for multiple courses
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr key={idx} className="table-row border-b border-border/50 last:border-0">
                    <td className={tdClass + " font-medium"}>{item.candidate.name}</td>
                    <td className={tdClass + " text-muted-text"}>{item.candidate.email}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-accent/10 text-accent text-[12px] font-bold border border-accent/20">
                        {item.courseCount}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <div className="flex flex-wrap gap-1.5">
                        {item.courses.map((course, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono bg-surface px-2 py-0.5 rounded text-muted-text border border-border"
                          >
                            {course.course_code}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        );
      }

      case "notChosenCandidates": {
        const data: NotChosenCandidate[] =
          notChosenCandidatesData?.getCandidatesNotChosenForAnyCourse || [];
        return (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className={thClass}>Candidate</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>Date Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-muted-text p-12 text-sm">
                    All candidates have been assigned
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr key={idx} className="table-row border-b border-border/50 last:border-0">
                    <td className={tdClass + " font-medium"}>{item.candidate.name}</td>
                    <td className={tdClass + " text-muted-text"}>{item.candidate.email}</td>
                    <td className={tdClass + " text-muted-text"}>
                      {item.candidate.dateOfJoining
                        ? new Date(item.candidate.dateOfJoining).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        );
      }

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-fuchsia-400 flex items-center justify-center">
              <BarChart3 size={18} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Reports
            </h2>
          </div>
          <p className="text-muted-text text-sm">
            Candidate assignment analytics and insights.
          </p>
        </div>

        {/* Tabs */}
        <div className="glass-panel p-1.5 mb-6 inline-flex gap-1">
          {reportTabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveReport(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                activeReport === key
                  ? "bg-primary text-white shadow-glow"
                  : "text-muted-text hover:text-gray-300 hover:bg-white/[0.03]"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Report Content */}
        <div className="glass-panel-elevated overflow-hidden animate-fade-in">
          {renderReport()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
