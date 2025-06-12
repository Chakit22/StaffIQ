import { Resolver, Query } from "type-graphql";
import {
  CourseWithCandidates,
  CandidateWithCourseCount,
  UnselectedCandidate,
} from "../types/ReportTypes";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/User";
import { Course } from "../../entities/Course";
import { Application } from "../../entities/Application";
import { In } from "typeorm";

@Resolver()
export class ReportResolver {
  // Candidates chosen for each course
  @Query(() => [CourseWithCandidates])
  async getCandidatesChosenForEachCourse(): Promise<CourseWithCandidates[]> {
    const courseRepository = AppDataSource.getRepository(Course);
    const userRepository = AppDataSource.getRepository(User);

    const courses = await courseRepository.find({
      relations: ["users", "applications"],
    });

    const result: CourseWithCandidates[] = [];

    for (const course of courses) {
      // Get candidates who have applied for this course
      const candidateIds = course.applications
        .filter((app) => app.user && app.user.role === "candidate")
        .map((app) => app.userId);

      const candidates = await userRepository.find({
        where:
          candidateIds.length > 0
            ? { id: In(candidateIds) }
            : { id: "non-existent" },
        relations: ["applications"],
      });

      result.push({
        course,
        candidates,
        candidateCount: candidates.length,
      });
    }

    return result;
  }

  // Candidates chosen for more than three courses
  @Query(() => [CandidateWithCourseCount])
  async getCandidatesChosenForMoreThanThreeCourses(): Promise<
    CandidateWithCourseCount[]
  > {
    const userRepository = AppDataSource.getRepository(User);
    const applicationRepository = AppDataSource.getRepository(Application);

    // Get all candidates with their applications
    const candidates = await userRepository.find({
      where: { role: "candidate" },
      relations: ["applications", "applications.course"],
    });

    const result: CandidateWithCourseCount[] = [];

    for (const candidate of candidates) {
      const courseCount = candidate.applications.length;

      if (courseCount > 3) {
        const courses = candidate.applications.map((app) => app.course);

        result.push({
          candidate,
          courseCount,
          courses,
        });
      }
    }

    return result;
  }

  // Candidates not chosen for any course
  @Query(() => [UnselectedCandidate])
  async getCandidatesNotChosenForAnyCourse(): Promise<UnselectedCandidate[]> {
    const userRepository = AppDataSource.getRepository(User);

    // Get all candidates
    const allCandidates = await userRepository.find({
      where: { role: "candidate" },
      relations: ["applications"],
    });

    const result: UnselectedCandidate[] = [];

    for (const candidate of allCandidates) {
      // A candidate is "not chosen" if they have 0 applications
      const applicationCount = candidate.applications.length;

      if (applicationCount === 0) {
        result.push({
          candidate,
          applicationCount,
        });
      }
    }

    return result;
  }

  // Lecturers with course assignments
  @Query(() => [User])
  async getAllLecturersWithCourseAssignments(): Promise<User[]> {
    const userRepository = AppDataSource.getRepository(User);

    return await userRepository.find({
      where: { role: "lecturer" },
      relations: ["courses"],
    });
  }

  // All applications
  @Query(() => [Application])
  async getAllApplications(): Promise<Application[]> {
    const applicationRepository = AppDataSource.getRepository(Application);

    return await applicationRepository.find({
      relations: ["user", "course", "role", "availability", "skills"],
    });
  }
}
