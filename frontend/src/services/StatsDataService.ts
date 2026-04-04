/**
 * ARCHITECTURAL APPROACH - Data Service Layer
 *
 * This StatsDataService implements a Service Layer architectural pattern to achieve clear
 * separation between data fetching/business logic and visual presentation components.
 *
 * REASONING FOR THIS APPROACH:
 *
 * 1. SEPARATION OF CONCERNS: Business logic (API calls, data transformation) is isolated
 *    from React components, which only handle rendering and user interactions.
 *
 * 2. SINGLE RESPONSIBILITY: Each service method has one clear purpose - fetching specific
 *    types of data from backend APIs without mixing in presentation logic.
 *
 * 3. DEPENDENCY INVERSION: Components depend on this service interface, not concrete
 *    implementation details, making testing and future changes easier.
 *
 * 4. BACKEND-FIRST APPROACH: All data processing and filtering is delegated to backend
 *    APIs, keeping frontend lightweight and ensuring consistent business rules.
 *
 * 5. FUTURE EXTENSIBILITY: New visualization components can reuse these services without
 *    duplicating data fetching logic. New data sources can be added by extending this
 *    service without changing existing visualization components.
 *
 * 6. TESTABILITY: Business logic can be unit tested independently of React components,
 *    and components can be tested with mocked services.
 */

import apiClient from "@/api/client";
import { ApiResponse } from "@/types/Api";
import { Application } from "@/types/Application";
import { Course } from "@/types/Course";
import { User } from "@/types/User";

export interface StatsData {
  mostChosenCandidates: Application[];
  leastChosenCandidates: Application[];
  unchosenCandidates: Application[];
}

export interface LecturerRanking {
  rank: number;
  lecturerId: string;
  applicationId: string;
  application: Application;
}

export interface LecturerPreferences {
  rankings: LecturerRanking[];
}

export interface AllLecturerPreferences {
  lecturerId: string;
  lecturerName: string;
  rankings: LecturerRanking[];
}

export class StatsDataService {
  /**
   * Fetches course statistics from backend API
   * Backend handles all the complex logic for determining most/least/unchosen candidates
   */
  async getCourseStats(courseId: string): Promise<ApiResponse<StatsData>> {
    try {
      const response = await apiClient.get(
        `/api/courses/${courseId}/statistics`
      );
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body as StatsData,
      };
    } catch (error: unknown) {
      console.error("Error fetching course stats", error);
      return {
        success: false,
        message: "Failed to fetch course stats",
        body: {
          mostChosenCandidates: [],
          leastChosenCandidates: [],
          unchosenCandidates: [],
        },
      };
    }
  }

  /**
   * Fetches lecturer preferences for a specific course
   * Backend returns rankings with complete application data
   */
  async getLecturerPreferences(
    courseId: string,
    lecturerId: string
  ): Promise<ApiResponse<LecturerPreferences>> {
    try {
      const response = await apiClient.get(
        `/api/courses/${courseId}/lecturer/${lecturerId}/preferences`
      );
      return {
        success: response.data.success,
        message: response.data.message,
        body: { rankings: response.data.body },
      };
    } catch (error: unknown) {
      console.error("Error fetching lecturer preferences", error);
      return {
        success: false,
        message: "Failed to fetch lecturer preferences",
        body: { rankings: [] },
      };
    }
  }

  /**
   * Fetches all courses assigned to a lecturer
   * Uses the same endpoint as the lecturer dashboard for consistency
   */
  async getLecturerCourses(lecturerId: string): Promise<ApiResponse<Course[]>> {
    try {
      const response = await apiClient.get(
        `/api/users/lecturer/${lecturerId}/assigned-courses`
      );
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body as Course[],
      };
    } catch (error: unknown) {
      console.error("Error fetching lecturer courses", error);
      return {
        success: false,
        message: "Failed to fetch lecturer courses",
        body: [],
      };
    }
  }

  /**
   * Fetches lecturers assigned to a specific course
   */
  async getCourseLecturers(courseId: string): Promise<ApiResponse<User[]>> {
    try {
      const response = await apiClient.get(
        `/api/courses/${courseId}/lecturers`
      );
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body as User[],
      };
    } catch {
      // Fallback: try fetching course details which may include users
      try {
        const response = await apiClient.get(`/api/courses/${courseId}`);
        const course = response.data.body as Course;
        return {
          success: true,
          message: "Lecturers fetched from course details",
          body: (course.users || []).filter((u) => u.role === "lecturer"),
        };
      } catch {
        console.error("Error fetching course lecturers");
        return {
          success: false,
          message: "Failed to fetch course lecturers",
          body: [],
        };
      }
    }
  }

  /**
   * Fetches preferences for ALL lecturers on a course
   * Loops getLecturerPreferences for each lecturer assigned to the course
   */
  async getAllLecturerPreferences(
    courseId: string,
    lecturerIds: string[],
    lecturerNameMap: Map<string, string>,
  ): Promise<ApiResponse<AllLecturerPreferences[]>> {
    try {
      const results: AllLecturerPreferences[] = [];

      const promises = lecturerIds.map(async (lecturerId) => {
        const response = await this.getLecturerPreferences(courseId, lecturerId);
        return {
          lecturerId,
          lecturerName: lecturerNameMap.get(lecturerId) || "Unknown",
          rankings: response.success
            ? (response.body as LecturerPreferences).rankings
            : [],
        };
      });

      const settled = await Promise.all(promises);
      results.push(...settled);

      return {
        success: true,
        message: "All lecturer preferences fetched",
        body: results,
      };
    } catch (error: unknown) {
      console.error("Error fetching all lecturer preferences", error);
      return {
        success: false,
        message: "Failed to fetch all lecturer preferences",
        body: [],
      };
    }
  }

  /**
   * Aggregates stats data for all courses assigned to a lecturer
   * Returns combined statistics across all courses
   */
  async getAllCoursesStats(lecturerId: string): Promise<
    ApiResponse<{
      allCourses: Course[];
      aggregatedStats: {
        totalMostChosen: number;
        totalLeastChosen: number;
        totalUnchosen: number;
      };
    }>
  > {
    try {
      // First get all courses for the lecturer
      const coursesResponse = await this.getLecturerCourses(lecturerId);

      if (!coursesResponse.success) {
        return {
          success: false,
          message: coursesResponse.message,
          body: {
            allCourses: [],
            aggregatedStats: {
              totalMostChosen: 0,
              totalLeastChosen: 0,
              totalUnchosen: 0,
            },
          },
        };
      }

      const courses = coursesResponse.body as Course[];
      let totalMostChosen = 0;
      let totalLeastChosen = 0;
      let totalUnchosen = 0;

      // Fetch stats for each course and aggregate
      for (const course of courses) {
        const statsResponse = await this.getCourseStats(course.id);
        if (statsResponse.success) {
          const stats = statsResponse.body as StatsData;
          totalMostChosen += stats.mostChosenCandidates?.length || 0;
          totalLeastChosen += stats.leastChosenCandidates?.length || 0;
          totalUnchosen += stats.unchosenCandidates?.length || 0;
        }
      }

      return {
        success: true,
        message: "Aggregated stats fetched successfully",
        body: {
          allCourses: courses,
          aggregatedStats: {
            totalMostChosen,
            totalLeastChosen,
            totalUnchosen,
          },
        },
      };
    } catch (error: unknown) {
      console.error("Error fetching aggregated stats", error);
      return {
        success: false,
        message: "Failed to fetch aggregated stats",
        body: {
          allCourses: [],
          aggregatedStats: {
            totalMostChosen: 0,
            totalLeastChosen: 0,
            totalUnchosen: 0,
          },
        },
      };
    }
  }
}

// Export singleton instance
export const statsDataService = new StatsDataService();
