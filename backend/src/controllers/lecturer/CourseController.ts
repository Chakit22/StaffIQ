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

  // Get the most, least and unchosen candidates for a course
  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;

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
      // JOIN the table Ranking with Application to get the preferences.
    } catch (error) {
      next(error);
      return;
    }
  };

  // Update the comment on an application
  updateAppComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const applicationId = req.params.applicationId;
      const body: { comments: string } = req.body;
      const application = await this.applicationRepository.findOne({
        where: { id: applicationId },
      });

      if (!application) {
        const error = new Error("Invalid Application!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Choose the application
      await AppDataSource.createQueryBuilder()
        .update(Application)
        .set(body)
        .where("id = :id", { id: applicationId })
        .execute();

      const updatedApplication = await this.applicationRepository.findOne({
        where: { id: applicationId },
      });

      res.status(200).json({
        success: true,
        body: updatedApplication,
        message: "Successfully added the comment on the application",
      });
    } catch (error) {
      next(error);
      return;
    }
  };
}
