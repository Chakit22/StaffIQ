"use client";

import { Course } from "@/types/Course";
import { createContext, useContext, useEffect, useState } from "react";
import { courses } from "@/utils/courses";

interface CourseContextProps {
  currentcourses: Course[] | null;
}

const CourseContext = createContext<CourseContextProps | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [currentcourses, setCurrentCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    const storedCourses = localStorage.getItem("currentcourses");
    if (!storedCourses) {
      localStorage.setItem("currentcourses", JSON.stringify(courses));
      setCurrentCourses(courses);
    } else {
      setCurrentCourses(JSON.parse(storedCourses));
    }
  }, []);

  return (
    <CourseContext.Provider value={{ currentcourses }}>
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
