import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_LECTURERS, GET_ALL_COURSES } from "../graphQL/queries";
import { ASSIGN_LECTURER_TO_COURSES } from "../graphQL/mutations";
import DashboardLayout from "../components/DashboardLayout";
import { Users, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface Lecturer {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
  course_code: string;
}

const AssignLecturer = () => {
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const { data: lecturersData, loading: lecturersLoading } =
    useQuery(GET_ALL_LECTURERS);
  const { data: coursesData, loading: coursesLoading } =
    useQuery(GET_ALL_COURSES);
  const [assignLecturerMutation, { loading: assignLoading }] = useMutation(
    ASSIGN_LECTURER_TO_COURSES,
  );

  const handleCourseSelection = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  const handleAssign = async () => {
    setMessage("");
    setMessageType("");

    if (!selectedLecturer) {
      setMessage("Please select a lecturer.");
      setMessageType("error");
      return;
    }
    if (selectedCourses.length === 0) {
      setMessage("Please select at least one course.");
      setMessageType("error");
      return;
    }

    try {
      const response = await assignLecturerMutation({
        variables: {
          input: { lecturerId: selectedLecturer, courseIds: selectedCourses },
        },
      });

      if (!response.data?.assignLecturerToCourses?.error) {
        setMessage("Lecturer successfully assigned to courses!");
        setMessageType("success");
        setSelectedLecturer("");
        setSelectedCourses([]);
      } else {
        setMessage(response.data?.assignLecturerToCourses?.error || "Assignment failed.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error assigning lecturer:", error);
      setMessage("An error occurred while assigning the lecturer.");
      setMessageType("error");
    }
  };

  const lecturers = lecturersData?.getAllLecturers || [];
  const courses = coursesData?.getAllCourses?.courses || [];

  return (
    <DashboardLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Users size={18} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Assign Lecturer
            </h2>
          </div>
          <p className="text-muted-text text-sm">
            Map lecturers to their courses for the current semester.
          </p>
        </div>

        <div className="glass-panel-elevated p-7 space-y-6">
          {message && (
            <div
              className={`flex items-center gap-2 text-sm p-3 rounded-xl animate-fade-in ${
                messageType === "success"
                  ? "text-success bg-success/10 border border-success/20"
                  : "text-danger bg-danger/10 border border-danger/20"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {message}
            </div>
          )}

          {/* Lecturer Select */}
          <div>
            <label className="text-[11px] text-muted-text uppercase tracking-[0.15em] font-semibold mb-2 block">
              Select Lecturer
            </label>
            {lecturersLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-text py-3">
                <Loader2 size={14} className="animate-spin" /> Loading...
              </div>
            ) : (
              <select
                value={selectedLecturer}
                onChange={(e) => setSelectedLecturer(e.target.value)}
                className="input-field appearance-none"
                disabled={assignLoading}
              >
                <option value="">-- Choose a Lecturer --</option>
                {lecturers.map((lecturer: Lecturer) => (
                  <option key={lecturer.id} value={lecturer.id}>
                    {lecturer.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Course Selection */}
          <div>
            <label className="text-[11px] text-muted-text uppercase tracking-[0.15em] font-semibold mb-2 block">
              Select Courses
            </label>
            {coursesLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-text py-3">
                <Loader2 size={14} className="animate-spin" /> Loading...
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-xl p-3 max-h-60 overflow-y-auto space-y-1">
                {courses.length === 0 ? (
                  <p className="text-muted-text text-sm p-2">No courses available</p>
                ) : (
                  courses.map((course: Course) => {
                    const isSelected = selectedCourses.includes(course.id);
                    return (
                      <label
                        key={course.id}
                        className={`flex items-start cursor-pointer p-2.5 rounded-lg transition-all duration-150 ${
                          isSelected
                            ? "bg-primary/10 border border-primary/20"
                            : "border border-transparent hover:bg-white/[0.02]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCourseSelection(course.id)}
                          disabled={assignLoading}
                          className="mt-0.5 accent-primary"
                        />
                        <span className="ml-3">
                          <span className="block text-[13px] font-medium text-gray-300">
                            {course.name}
                          </span>
                          <span className="block text-[11px] text-muted-text">
                            {course.course_code}
                          </span>
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            )}
            <p className="mt-2 text-[11px] text-muted-text">
              {selectedCourses.length} course
              {selectedCourses.length !== 1 ? "s" : ""} selected
            </p>
          </div>

          <button
            onClick={handleAssign}
            disabled={assignLoading || lecturersLoading || coursesLoading}
            className={`btn-primary w-full flex items-center justify-center gap-2 ${
              assignLoading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {assignLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Users size={16} />
            )}
            {assignLoading ? "Assigning..." : "Assign to Courses"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssignLecturer;
