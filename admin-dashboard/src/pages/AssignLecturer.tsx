// src/pages/AssignLecturer.tsx
import React, { useEffect, useState } from "react";

interface Lecturer {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
}

const AssignLecturer = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // TODO: Replace with GraphQL query
    setLecturers([
      { id: "l1", name: "Dr. Smith" },
      { id: "l2", name: "Prof. Johnson" },
    ]);
    setCourses([
      { id: "c1", name: "Intro to Web Dev" },
      { id: "c2", name: "Database Systems" },
    ]);
  }, []);

  const handleAssign = async () => {
    setMessage("");

    if (!selectedLecturer || !selectedCourse) {
      setMessage("Please select both a lecturer and a course.");
      return;
    }

    // TODO: Replace with actual GraphQL mutation
    console.log("Assigning:", selectedLecturer, selectedCourse);
    setMessage("Lecturer assigned successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          Assign Lecturer to Course
        </h2>

        {message && (
          <p className="text-center text-sm mb-4 text-blue-600 bg-blue-50 border border-blue-200 rounded p-2">
            {message}
          </p>
        )}

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Lecturer
          </label>
          <select
            value={selectedLecturer}
            onChange={(e) => setSelectedLecturer(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Choose a Lecturer --</option>
            {lecturers.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Choose a Course --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssign}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Assign
        </button>
      </div>
    </div>
  );
};

export default AssignLecturer;
