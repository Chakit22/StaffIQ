import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_COURSES } from "../graphQL/queries";
import { CREATE_COURSE, UPDATE_COURSE, DELETE_COURSE } from "../graphQL/mutations";
import DashboardLayout from "../components/DashboardLayout";

interface Course {
  id: string;
  name: string;
  course_code: string;
}

const CourseManager = () => {
  const [name, setName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_ALL_COURSES);
  const [createCourse] = useMutation(CREATE_COURSE);
  const [updateCourse] = useMutation(UPDATE_COURSE);
  const [deleteCourse] = useMutation(DELETE_COURSE);

  const resetForm = () => {
    setName("");
    setCourseCode("");
    setEditId(null);
  };

  const handleAddOrUpdate = async () => {
    if (!name.trim() || !courseCode.trim()) {
      alert("Please fill out both fields.");
      return;
    }

    try {
      if (editId) {
        await updateCourse({
          variables: { input: { id: editId, name, course_code: courseCode } },
        });
      } else {
        await createCourse({
          variables: { input: { name, course_code: courseCode } },
        });
      }
      resetForm();
      refetch();
    } catch (err) {
      console.error("Error saving course:", err);
    }
  };

  const handleEdit = (course: Course) => {
    setName(course.name);
    setCourseCode(course.course_code);
    setEditId(course.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse({ variables: { id } });
        refetch();
      } catch (err) {
        console.error("Error deleting course:", err);
      }
    }
  };

  const courses = data?.getAllCourses?.courses || [];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-3xl mx-auto bg-card p-6 rounded-xl shadow-lg border border-border">
          <h2 className="text-2xl font-semibold mb-6 text-gray-200">Course Management</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Course Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border border-border rounded-lg p-2 text-gray-200 placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Course Code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="bg-background border border-border rounded-lg p-2 text-gray-200 placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleAddOrUpdate}
              className="bg-primary hover:bg-primary-hover text-white font-medium rounded-lg px-4 py-2 transition"
            >
              {editId ? "Update Course" : "Add Course"}
            </button>
          </div>

          {loading && <div className="text-center py-4 text-muted">Loading courses...</div>}
          {error && <div className="text-red-400 text-center py-4">Error: {error.message}</div>}

          <table className="w-full text-left">
            <thead className="bg-background">
              <tr>
                <th className="p-2 border-b border-border text-gray-400 text-sm">Name</th>
                <th className="p-2 border-b border-border text-gray-400 text-sm">Code</th>
                <th className="p-2 border-b border-border text-gray-400 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course: Course) => (
                <tr key={course.id} className="hover:bg-background/50">
                  <td className="p-2 border-b border-border text-gray-300">{course.name}</td>
                  <td className="p-2 border-b border-border text-gray-300">{course.course_code}</td>
                  <td className="p-2 border-b border-border space-x-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-primary hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-400 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && courses.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted p-4">
                    No courses available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseManager;
