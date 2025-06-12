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

    // Query candidates left joining to applications and rankings
    const candidates = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.applications", "application")
      .leftJoin("application.ranking", "ranking")
      .where("user.role = :role", { role: "candidate" })
      .andWhere("ranking.id IS NULL") // No ranking means candidate NOT chosen
      .getMany();

    // Now calculate applicationCount per candidate (applications.length)
    const result: UnselectedCandidate[] = candidates.map((candidate) => ({
      candidate,
    }));

    return result;
  }
}
