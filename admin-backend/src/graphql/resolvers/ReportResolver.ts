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
import { Ranking } from "../../entities/Ranking";

@Resolver()
export class ReportResolver {
  // Candidates chosen for each course
  @Query(() => [CourseWithCandidates])
  async getCandidatesChosenForEachCourse(): Promise<CourseWithCandidates[]> {
    try {
      const courseRepository = AppDataSource.getRepository(Course);
      const rankingRepository = AppDataSource.getRepository(Ranking);

      const courses = await courseRepository.find();

      const result: CourseWithCandidates[] = [];

      for (const course of courses) {
        // Join Ranking ➝ Application ➝ User
        const rankedApplications = await rankingRepository
          .createQueryBuilder("ranking")
          .innerJoinAndSelect("ranking.application", "application")
          .innerJoinAndSelect("application.user", "user")
          .where("application.courseId = :courseId", { courseId: course.id })
          .getMany();

        // Extract users from ranked applications
        const candidates = rankedApplications.map((r) => r.application.user);

        // Remove duplicate users (in case multiple ranked applications by same user)
        const uniqueCandidates = Array.from(
          new Map(candidates.map((u) => [u.id, u])).values()
        );

        result.push({
          course,
          candidates: uniqueCandidates,
          candidateCount: uniqueCandidates.length,
        });
      }

      return result;
    } catch (error) {
      console.error("Error in getCandidatesChosenForEachCourse:", error);
      return [];
    }
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
