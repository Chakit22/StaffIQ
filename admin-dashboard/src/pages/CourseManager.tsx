import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_COURSES } from "../graphQL/queries";
import { CREATE_COURSE, UPDATE_COURSE, DELETE_COURSE } from "../graphQL/mutations";
import DashboardLayout from "../components/DashboardLayout";
import { BookOpen, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";

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
  const [createCourse, { loading: creating }] = useMutation(CREATE_COURSE);
  const [updateCourse, { loading: updating }] = useMutation(UPDATE_COURSE);
  const [deleteCourse] = useMutation(DELETE_COURSE);

  const resetForm = () => {
    setName("");
    setCourseCode("");
    setEditId(null);
  };

  const handleAddOrUpdate = async () => {
    if (!name.trim() || !courseCode.trim()) return;

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
  const isSaving = creating || updating;

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-primary flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Course Management
            </h2>
          </div>
          <p className="text-muted-text text-sm">
            Add, edit, or remove courses from the system.
          </p>
        </div>

        {/* Form */}
        <div className="glass-panel-elevated p-6 mb-6">
          <p className="text-[11px] text-muted-text uppercase tracking-[0.15em] font-semibold mb-4">
            {editId ? "Edit Course" : "Add New Course"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Course Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field flex-1"
            />
            <input
              type="text"
              placeholder="Course Code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="input-field sm:w-48"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddOrUpdate}
                disabled={isSaving || !name.trim() || !courseCode.trim()}
                className={`btn-primary flex items-center gap-2 whitespace-nowrap ${
                  isSaving ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : editId ? (
                  <Pencil size={14} />
                ) : (
                  <Plus size={14} />
                )}
                {editId ? "Update" : "Add"}
              </button>
              {editId && (
                <button
                  onClick={resetForm}
                  className="p-3 rounded-xl bg-surface border border-border text-muted-text hover:text-gray-300 hover:border-border transition-all"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-panel-elevated overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-text">
              <Loader2 size={18} className="animate-spin" /> Loading courses...
            </div>
          )}
          {error && (
            <div className="text-danger text-center py-8 text-sm">
              Error: {error.message}
            </div>
          )}

          {!loading && !error && (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-[11px] text-muted-text uppercase tracking-[0.15em] font-semibold">
                    Course Name
                  </th>
                  <th className="p-4 text-left text-[11px] text-muted-text uppercase tracking-[0.15em] font-semibold">
                    Code
                  </th>
                  <th className="p-4 text-right text-[11px] text-muted-text uppercase tracking-[0.15em] font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course: Course) => (
                  <tr
                    key={course.id}
                    className="table-row border-b border-border/50 last:border-0"
                  >
                    <td className="p-4 text-[13px] font-medium text-gray-300">
                      {course.name}
                    </td>
                    <td className="p-4">
                      <span className="text-[11px] font-mono bg-surface px-2.5 py-1 rounded-md text-primary border border-border">
                        {course.course_code}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-muted-text hover:text-primary transition-all"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 rounded-lg hover:bg-danger/10 text-muted-text hover:text-danger transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && courses.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center text-muted-text p-12 text-sm"
                    >
                      No courses found. Add one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseManager;
