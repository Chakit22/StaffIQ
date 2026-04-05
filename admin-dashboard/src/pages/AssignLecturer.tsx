// src/pages/AssignLecturer.tsx
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_LECTURERS, GET_ALL_COURSES } from "../graphQL/queries";
import { ASSIGN_LECTURER_TO_COURSES } from "../graphQL/mutations";
import DashboardLayout from "../components/DashboardLayout";

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
    ASSIGN_LECTURER_TO_COURSES
  );

  const handleCourseSelection = (courseId: string) => {
    setSelectedCourses((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
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
          input: {
            lecturerId: selectedLecturer,
            courseIds: selectedCourses,
          },
        },
      });

      if (!response.data?.assignLecturerToCourses?.error) {
        setMessage("Lecturer successfully assigned to courses!");
        setMessageType("success");
        setSelectedLecturer("");
        setSelectedCourses([]);
      } else {
        setMessage(
          response.data?.assignLecturerToCourses?.error || "Assignment failed."
        );
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
      <div className="p-6">
        <div className="max-w-xl mx-auto bg-card rounded-xl shadow-lg border border-border p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-200">
            Assign Lecturer to Courses
          </h2>

          {message && (
            <p
              className={`text-center text-sm mb-4 ${
                messageType === "success"
                  ? "text-green-400 bg-green-900/20 border border-green-800/30"
                  : "text-red-400 bg-red-900/20 border border-red-800/30"
              } rounded p-2`}
            >
              {message}
            </p>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Select Lecturer
            </label>
            {lecturersLoading ? (
              <p className="text-sm text-muted">Loading lecturers...</p>
            ) : (
              <select
                value={selectedLecturer}
                onChange={(e) => setSelectedLecturer(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
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

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Select Courses
            </label>
            {coursesLoading ? (
              <p className="text-sm text-muted">Loading courses...</p>
            ) : (
              <div className="border border-border rounded-lg p-3 max-h-60 overflow-y-auto">
                {courses.length === 0 ? (
                  <p className="text-muted text-sm">No courses available</p>
                ) : (
                  courses.map((course: Course) => (
                    <div key={course.id} className="mb-2">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course.id)}
                          onChange={() => handleCourseSelection(course.id)}
                          disabled={assignLoading}
                          className="mt-1 h-4 w-4 accent-primary rounded"
                        />
                        <span className="ml-2">
                          <span className="block text-sm font-medium text-gray-300">
                            {course.name}
                          </span>
                          <span className="block text-xs text-muted">
                            {course.course_code}
                          </span>
                        </span>
                      </label>
                    </div>
                  ))
                )}
              </div>
            )}
            <div className="mt-1 text-xs text-muted">
              {selectedCourses.length} course
              {selectedCourses.length !== 1 ? "s" : ""} selected
            </div>
          </div>

          <button
            onClick={handleAssign}
            disabled={assignLoading || lecturersLoading || coursesLoading}
            className={`w-full ${
              assignLoading ? "bg-gray-600" : "bg-primary hover:bg-primary-hover"
            } text-white py-2 rounded-lg transition`}
          >
            {assignLoading ? "Assigning..." : "Assign to Courses"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssignLecturer;
