import React, { useEffect, useState } from "react";

interface Course {
  id: string;
  name: string;
  code: string;
}

const CourseManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  // Replace this with useQuery(GET_COURSES) later
  useEffect(() => {
    setCourses([
      { id: "1", name: "Web Development", code: "COSC2758" },
      { id: "2", name: "Database Systems", code: "COSC2472" },
    ]);
  }, []);

  const resetForm = () => {
    setName("");
    setCode("");
    setEditId(null);
  };

  const handleAddOrUpdate = () => {
    if (!name.trim() || !code.trim()) {
      alert("Please fill out both fields.");
      return;
    }

    if (editId) {
      // Later: call updateCourse mutation
      setCourses((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, name, code } : c))
      );
    } else {
      // Later: call addCourse mutation
      const newCourse: Course = {
        id: Date.now().toString(),
        name,
        code,
      };
      setCourses((prev) => [...prev, newCourse]);
    }
    resetForm();
  };

  const handleEdit = (course: Course) => {
    setName(course.name);
    setCode(course.code);
    setEditId(course.id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      // Later: call deleteCourse mutation
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

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
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border rounded p-2"
          />
          <button
            onClick={handleAddOrUpdate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded px-4 py-2"
          >
            {editId ? "Update Course" : "Add Course"}
          </button>
        </div>

        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Code</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="border p-2">{course.name}</td>
                <td className="border p-2">{course.code}</td>
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
            {courses.length === 0 && (
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
