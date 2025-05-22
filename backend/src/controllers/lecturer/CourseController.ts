import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../data-source";
import { Application } from "../../entity/Application";
import { Course } from "../../entity/Course";
import Ranking from "../../entity/Ranking";
import { User } from "../../entity/User";
import { ApiError } from "../../middleware/error-handler";

export class CourseController {
  // repository for course
  private courseRepository = AppDataSource.getRepository(Course);

  // repository for application
  private applicationRepository = AppDataSource.getRepository(Application);

  // repository for ranking
  private rankingRepository = AppDataSource.getRepository(Ranking);

  // repository for user
  private userRepository = AppDataSource.getRepository(User);

  // Get all applications by a particular course
  getAllApplications = async (
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

  // Get all assigned courses of a lecturer
  getAllAssignedCourses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.userId;
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ["courses"],
      });

      if (!user) {
        const error = new Error("User does not exist!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        success: true,
        body: user.courses,
        message: "Assigned courses fetched succesfully!",
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  // Update the application status / ranking. if a lecturer ranks an applicant then he has chosen the applicant.
  /**
   * This accepts an array of updated rankings so that it can be used to update multiple rankings at once.
   */
  updateApplicationStatusRanking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { rankings } = req.body;

      // Create a new ranking record for each ranking
      const newRankings = this.rankingRepository.create(rankings);

      // Save the new rankings
      /**
       * This creates a new ranking record for each ranking in the array.
       * If a ranking already exists, it will be updated.
       */
      await this.rankingRepository.save(newRankings);

      res.status(200).json({
        success: true,
        body: newRankings,
        message: "Rankings updated successfully",
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

  // Get the most, least and unchosen candidates for a course
  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;

      // Get the number of times each candidate has been chosen
      const counts = await this.rankingRepository
        .createQueryBuilder("ranking")
        .select("ranking.applicationId", "applicationId")
        .addSelect("ranking.application.courseId", "courseId")
        .addSelect("COUNT(*)", "timesChosen")
        .innerJoin("ranking.application", "RankingApplication")
        .where("RankingApplication.courseId = :courseId", { courseId })
        .groupBy("RankingApplication.applicationId")
        .addGroupBy("RankingApplication.courseId")
        .orderBy("timesChosen", "DESC")
        .getRawMany();

      // Get the most chosen candidates. Get the highest value of timesChosen and get all the applications with that value.
      let mostChosenCandidates = [];
      if (counts.length > 0) {
        mostChosenCandidates = counts.filter(
          (count) => count.timesChosen === counts[0].timesChosen
        );
      } else {
        mostChosenCandidates = [];
      }

      // Get the least chosen candidates
      let leastChosenCandidates = [];
      if (counts.length > 0) {
        leastChosenCandidates = counts.filter(
          (count) => count.timesChosen === counts[counts.length - 1].timesChosen
        );
      } else {
        leastChosenCandidates = [];
      }

      // Get the unchosen candidates
      let unchosenCandidates = [];
      if (counts.length > 0) {
        unchosenCandidates = counts.filter((count) => count.timesChosen === 0);
      } else {
        unchosenCandidates = [];
      }

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

  // // Update the comment on an application
  // updateAppComment = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const applicationId = req.params.applicationId;
  //     const body: { comments: string } = req.body;
  //     const application = await this.applicationRepository.findOne({
  //       where: { id: applicationId },
  //     });

  //     if (!application) {
  //       const error = new Error("Invalid Application!") as ApiError;
  //       error.statusCode = 404;
  //       throw error;
  //     }

  //     // Choose the application
  //     await AppDataSource.createQueryBuilder()
  //       .update(Application)
  //       .set(body)
  //       .where("id = :id", { id: applicationId })
  //       .execute();

  //     const updatedApplication = await this.applicationRepository.findOne({
  //       where: { id: applicationId },
  //     });

  //     res.status(200).json({
  //       success: true,
  //       body: updatedApplication,
  //       message: "Successfully added the comment on the application",
  //     });
  //   } catch (error) {
  //     next(error);
  //     return;
  //   }
  // };
}
