"use client";
import { Course } from "@/types/Course";
import { courses } from "@/utils/courses";
import { create } from "zustand";

// Define state props
interface CourseStore {
  currentcourses: Course[] | null;
  loading: boolean;
  setInitialState: () => void;
}

// Create a store
export const useCourseStore = create<CourseStore>((set) => ({
  currentcourses: null,
  loading: true,
  setInitialState: () => {
    const storedCourses = localStorage.getItem("currentcourses");
    if (!storedCourses) {
      localStorage.setItem("currentcourses", JSON.stringify(courses));
      set((state) => ({ ...state, currentcourses: courses }));
    } else {
      set((state) => ({ ...state, currentcourses: JSON.parse(storedCourses) }));
    }
    set((state) => ({ ...state, loading: false }));
  },
}));
