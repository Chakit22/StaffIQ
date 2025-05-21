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

  // Choose / Unchoose a application (POST Request)
  updateApplicationStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { applicationId, lecturerId } = req.body;

      const application = await this.applicationRepository.findOne({
        where: { id: applicationId },
      });

      if (!application) {
        const error = new Error("Invalid Application!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      const lecturer = await this.userRepository.findOne({
        where: { id: lecturerId },
        relations: ["applications_chosen"],
      });

      if (!lecturer) {
        const error = new Error("Invalid User!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Check if the application has already been choosen by the lecturer
      const index = lecturer.applications_chosen.findIndex(
        (application) => application.id == applicationId
      );

      if (index == -1) {
        // Choose the applicant
        lecturer.applications_chosen.push(application);
      } else {
        // If it is already chosen, then remove that element
        lecturer.applications_chosen.splice(index, 1);
      }

      // Saves the entity, if it exists then it updates it
      // This adds/deletes a row into the LecturerApplication Table
      await this.userRepository.save(lecturer);

      res.status(200).json({
        success: true,
        body: lecturer.applications_chosen,
        message: "Successfully updated the application status",
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  // Update the ranking of a candidate
  updateRanking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, userId, applicationId, rank } =
        this.rankingRepository.create(req.body as Ranking);

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        const error = new Error("Invalid user!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // CourseId must be valid
      const course = await this.courseRepository.findOne({
        where: { id: courseId },
      });

      if (!course) {
        const error = new Error("Invalid course!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // RoleId must be valid
      const application = await this.applicationRepository.findOne({
        where: { id: applicationId },
      });

      if (!application) {
        const error = new Error("Invalid Application!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      const rankingRecord = await this.rankingRepository.findOne({
        where: {
          courseId,
          userId,
          applicationId,
        },
      });

      if (!rankingRecord) {
        // Add a new record and return
        // Create a application
        const newRankingRecord = this.rankingRepository.create(
          req.body as Ranking
        );

        // Save the application
        await this.rankingRepository.save(newRankingRecord);

        res.status(200).json({
          success: true,
          body: newRankingRecord,
          message: "Successfully updated the ranking",
        });
        return;
      }

      // Update the ranking
      await AppDataSource.createQueryBuilder()
        .update(Ranking)
        .set({ rank: rank })
        .where("courseId = :courseId", { courseId })
        .andWhere("userId = :userId", { userId })
        .andWhere("applicationId = :applicationId", { applicationId })
        .execute();

      const updatedRecord = await this.rankingRepository.findOne({
        where: {
          courseId,
          userId,
          applicationId,
        },
      });

      res.status(200).json({
        success: true,
        body: updatedRecord,
        message: "Successfully updated the ranking",
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  // Get the preferences/ ranking set by a lecturer for a particular course
  getPreferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, userId } = req.params;

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        const error = new Error("Invalid user!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // CourseId must be valid
      const course = await this.courseRepository.findOne({
        where: { id: courseId },
      });

      if (!course) {
        const error = new Error("Invalid course!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      const rankings = await this.rankingRepository.find({
        where: { courseId, userId },
      });

      if (!rankings) {
        const error = new Error("Invalid course or user!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        success: true,
        body: rankings,
        message: "Preferences fetched successfully",
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
