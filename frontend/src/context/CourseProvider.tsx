"use client";

import { Course } from "@/types/Course";
import { createContext, useContext, useEffect, useState } from "react";
import { courses } from "@/utils/courses";
import { useLoading } from "./LoadingProvider";

interface CourseContextProps {
  currentcourses: Course[] | null;
  courseLoading: boolean;
}

const CourseContext = createContext<CourseContextProps | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [currentcourses, setCurrentCourses] = useState<Course[] | null>(null);
  const { loadingStates, setLoading } = useLoading();

  useEffect(() => {
    // console.log("Inside useEffect of CourseProvider");

    const storedCourses = localStorage.getItem("currentcourses");
    if (!storedCourses) {
      localStorage.setItem("currentcourses", JSON.stringify(courses));
      setCurrentCourses(courses);
    } else {
      setCurrentCourses(JSON.parse(storedCourses));
    }
    setLoading("courseLoading", false);
  }, []);

  // console.log("Inside Course Provider!");

  return (
    <CourseContext.Provider
      value={{ currentcourses, courseLoading: loadingStates["courseLoading"] }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);

  if (context === undefined) {
    throw new Error("useCourse must be used within CourseProvider");
  }
  return context;
}
