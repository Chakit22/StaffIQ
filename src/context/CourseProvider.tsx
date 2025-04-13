"use client";

import { Course } from "@/types/Course";
import { createContext, useContext, useEffect, useState } from "react";
import { courses } from "@/utils/courses";

interface CourseContextProps {
  currentcourses: Course[] | null;
  loading: boolean;
}

const CourseContext = createContext<CourseContextProps | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [currentcourses, setCurrentCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("Inside useEffect of CourseProvider");
    setLoading(true);

    const storedCourses = localStorage.getItem("currentcourses");
    if (!storedCourses) {
      localStorage.setItem("currentcourses", JSON.stringify(courses));
      setCurrentCourses(courses);
    } else {
      setCurrentCourses(JSON.parse(storedCourses));
    }

    setLoading(false);
  }, []);

  return (
    <CourseContext.Provider value={{ currentcourses, loading }}>
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
