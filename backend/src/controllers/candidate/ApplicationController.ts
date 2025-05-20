/**
 * Controller for candidate application
 * 1. Creating a application
 * 2. Getting all applications of a candidate
 */

import { application, NextFunction } from "express";
import { AppDataSource } from "../../data-source";
import { Application } from "../../entity/Application";
import { Request, Response } from "express";
import { Course } from "../../entity/Course";
import { User } from "../../entity/User";
import { Role } from "../../entity/Role";
import { ApiError } from "../../middleware/error-handler";

export class ApplicationController {
  // Repository for application
  private applicationRepository = AppDataSource.getRepository(Application);

  // Repository for User
  private userRepository = AppDataSource.getRepository(User);

  // Repsotifoyr for course
  private courseRepository = AppDataSource.getRepository(Course);

  // Repsotuodyf for role
  private roleRepository = AppDataSource.getRepository(Role);

  // Create a application
  /**
   *
   * @param req express request object
   * @param res express response object
   * @returns the created application
   */
  createApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body = req.body;
      // UserId must be valid
      const user = await this.userRepository.findOne({
        where: { id: body.userId },
      });

      if (!user) {
        const error = new Error("Invalid user!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // CourseId must be valid
      const course = await this.courseRepository.findOne({
        where: { id: body.courseId },
      });

      if (!course) {
        const error = new Error("Invalid course!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // RoleId must be valid
      const role = await this.roleRepository.findOne({
        where: { id: body.roleId },
      });

      if (!role) {
        const error = new Error("Invalid role!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Create a application
      const application = this.applicationRepository.create(body);

      // Save the application
      await this.applicationRepository.save(application);

      res.status(201).json({
        success: true,
        message: "Application created successfully",
        body: application,
      });
    } catch (error) {
      next(error);
      return;
    }
  };
}
