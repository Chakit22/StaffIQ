import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_COURSES } from "../graphQL/queries";
import {
  CREATE_COURSE,
  UPDATE_COURSE,
  DELETE_COURSE,
} from "../graphQL/mutations";

interface Course {
  id: string;
  name: string;
  course_code: string;
}

const CourseManager = () => {
  const [name, setName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch courses
  const { data, loading, error, refetch } = useQuery(GET_ALL_COURSES);

  // Set up mutations
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
        // Update existing course
        await updateCourse({
          variables: {
            input: {
              id: editId,
              name,
              course_code: courseCode,
            },
          },
        });
      } else {
        // Create new course
        await createCourse({
          variables: {
            input: {
              name,
              course_code: courseCode,
            },
          },
        });
      }
      resetForm();
      refetch(); // Refresh the course list
    } catch (err) {
      console.error("Error saving course:", err);
      alert("Failed to save course. Please try again.");
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
        await deleteCourse({
          variables: { id },
        });
        refetch(); // Refresh the course list
      } catch (err) {
        console.error("Error deleting course:", err);
        alert("Failed to delete course. Please try again.");
      }
    }
  };

  // Extract courses from GraphQL response
  const courses = data?.getAllCourses?.courses || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6">Course Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Course Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded p-2"
          />
          <input
            type="text"
            placeholder="Course Code"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="border rounded p-2"
          />
          <button
            onClick={handleAddOrUpdate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded px-4 py-2"
          >
            {editId ? "Update Course" : "Add Course"}
          </button>
        </div>

        {loading && <div className="text-center py-4">Loading courses...</div>}
        {error && (
          <div className="text-red-500 text-center py-4">
            Error loading courses: {error.message}
          </div>
        )}

        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Code</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course: Course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="border p-2">{course.name}</td>
                <td className="border p-2">{course.course_code}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && courses.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-gray-500 p-4">
                  No courses available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseManager;
