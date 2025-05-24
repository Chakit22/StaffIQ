/*
    Controller for candidate profile 
    1. Getting user profile information
    2. Updating user profile information
    3. Getting all previous roles/experiences of a user
*/

import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { User } from "../../../entity/User";
import { ApiError } from "../../../shared/middleware/error-handler";

export class UserController {
  // Repository for user
  private userRepository = AppDataSource.getRepository(User);

  // Get details of a user
  /**
   *
   * @param req express request object
   * @param res express response object
   * @returns details of a user
   */
  getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        const error = new Error("User does not exist!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        success: true,
        body: user,
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  // Get all experiences/previous roles of a candidate
  /**
   *
   * @param req express request object
   * @param res express response object
   * @returns all experiences/previous roles of a candidate
   */
  getAllExperiences = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.userId;
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ["experiences"],
      });

      // The above condition returns null if the user does not exist
      if (!user) {
        const error = new Error("User does not exist!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        success: true,
        body: user.experiences,
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
      const lecturerId = req.params.lecturerId;
      const lecturer = await this.userRepository.findOne({
        where: { id: lecturerId },
        relations: ["courses"],
      });

      if (!lecturer) {
        const error = new Error("Lecturer does not exist!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        success: true,
        body: lecturer.courses,
        message: "Assigned courses fetched succesfully!",
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  // Get all applications of a candidate
  /**
   *
   * @param req express request object
   * @param res express response object
   * @returns all applications of a candidate
   */
  getAllApplicationsOfCandidate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.userId;
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ["applications"],
      });

      if (!user) {
        const error = new Error("User does not exist!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        success: true,
        body: user.applications,
      });
    } catch (error) {
      next(error);
      return;
    }
  };
}
