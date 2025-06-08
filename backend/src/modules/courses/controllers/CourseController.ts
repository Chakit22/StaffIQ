import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../../data-source";
import { Application } from "../../../entity/Application";
import { Course } from "../../../entity/Course";
import Ranking from "../../../entity/Ranking";
import { User } from "../../../entity/User";
import { ApiError } from "../../../shared/middleware/error-handler";

export class CourseController {
  // repository for course
  private courseRepository = AppDataSource.getRepository(Course);

  // repository for application
  private applicationRepository = AppDataSource.getRepository(Application);

  // repository for ranking
  private rankingRepository = AppDataSource.getRepository(Ranking);

  // repository for user
  private userRepository = AppDataSource.getRepository(User);

  // Get all courses
  getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await this.courseRepository.find();

      res.status(200).json({
        success: true,
        message: "Courses fetched succesfully!",
        body: courses,
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  // Get all applications by a particular course
  getAllApplicationsByCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const courseId = req.params.courseId;
      const course = await this.courseRepository.findOne({
        where: { id: courseId },
        relations: ["applications"],
      });

      if (!course) {
        const error = new Error("Invalid course!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        success: true,
        body: course.applications,
        message: "Applications fetched succesfully!",
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  // Get the most, least and unchosen candidates for a course
  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;

      const course = await this.courseRepository.findOne({
        where: { id: courseId },
      });

      if (!course) {
        const error = new Error("Course does not exist!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Get the number of times each candidate has been chosen
      /** 
       * Real SQL Query
       * SELECT applicationId, courseId, COUNT(*) AS timesChosen
        FROM Ranking
        INNER JOIN Application ON Ranking.applicationId = Application.id
        GROUP BY applicationId, courseId
        ORDER BY timesChosen DESC;
       */
      const counts = await this.rankingRepository
        .createQueryBuilder("ranking")
        .select("applicationId")
        .addSelect("COUNT(*)", "timesChosen")
        .innerJoin("ranking.application", "RankingApplication")
        .where("courseId = :courseId", { courseId })
        .groupBy("applicationId")
        .addGroupBy("courseId")
        .orderBy("timesChosen", "DESC")
        .getRawMany();

      console.log("counts", counts);

      // Get the maximum value of timesChosen
      const maxTimesChosen = counts.reduce((max, count) => {
        return Math.max(max, count.timesChosen);
      }, 0);

      // Get the minimum value of timesChosen
      const minTimesChosen = counts.reduce((min, count) => {
        return Math.min(min, count.timesChosen);
      }, Infinity);

      console.log("maxTimesChosen", maxTimesChosen);
      console.log("minTimesChosen", minTimesChosen);

      let mostChosenCandidates: any[] = [];
      let leastChosenCandidates: any[] = [];
      let unchosenCandidates: any[] = [];

      // If both max and min are the same then all are most chosen candidates
      if (maxTimesChosen === minTimesChosen) {
        mostChosenCandidates = counts;
        res.status(200).json({
          success: true,
          body: {
            mostChosenCandidates,
            leastChosenCandidates,
            unchosenCandidates,
          },
        });
        return;
      }

      // Get the most chosen candidates. Get the highest value of timesChosen and get all the applications with that value.
      mostChosenCandidates = counts.filter(
        (count) => count.timesChosen == maxTimesChosen
      );

      // Get the least chosen candidates
      leastChosenCandidates = counts.filter(
        (count) => count.timesChosen == minTimesChosen
      );

      // Get the unchosen candidates. These are the ones which are not ranked by the lecturer.
      // Left join from application table onto Ranking table and filter out where applicationId is NULL
      unchosenCandidates = await this.applicationRepository
        .createQueryBuilder("application")
        .select("id AS applicationId")
        .leftJoin(Ranking, "ranking", "id = applicationId")
        .where("applicationId IS NULL")
        .andWhere("courseId = :courseId", { courseId })
        .getRawMany();

      res.status(200).json({
        success: true,
        body: {
          mostChosenCandidates,
          leastChosenCandidates,
          unchosenCandidates,
        },
        message: "Stats fetched succesfully!",
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  // Get the preferences/ ranking set by a lecturer for a particular course
  getPreferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lecturerId, courseId } = req.params;

      const lecturer = await this.userRepository.findOne({
        where: { id: lecturerId },
      });

      if (!lecturer) {
        const error = new Error("Lecturer does not exist!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      const course = await this.courseRepository.findOne({
        where: { id: courseId },
      });

      if (!course) {
        const error = new Error("Course does not exist!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Here we have two tables: Ranking and Application with a common column being: applicationId.
      // To get all the preferences for a particular course set by a lecturer, we need to join these two tables on the applicationId column.
      const preferences = await this.rankingRepository
        .createQueryBuilder("ranking")
        .innerJoinAndSelect("ranking.application", "RankingApplication") // This joins on applicationId column and sets the table name as RankingApplication
        .where("ranking.lecturerId = :lecturerId", { lecturerId })
        .andWhere("RankingApplication.courseId = :courseId", { courseId })
        .orderBy("ranking.rank", "ASC")
        .getMany();

      res.status(200).json({
        success: true,
        body: preferences,
        message: "Preferences fetched succesfully!",
      });
    } catch (error) {
      next(error);
      return;
    }
  };
}
