/**
 * Controller for candidate application
 * 1. Creating a application
 * 2. Getting all applications of a candidate
 */

import { NextFunction } from "express";
import { AppDataSource } from "../../../data-source";
import { Application } from "../../../entity/Application";
import { Request, Response } from "express";
import { Course } from "../../../entity/Course";
import { User } from "../../../entity/User";
import { Role } from "../../../entity/Role";
import { ApiError } from "../../../shared/middleware/error-handler";
import Ranking from "../../../entity/Ranking";
import { Comment } from "../../../entity/Comment";
import { In } from "typeorm";

export class ApplicationController {
  // Repository for application
  private applicationRepository = AppDataSource.getRepository(Application);

  // Repository for User
  private userRepository = AppDataSource.getRepository(User);

  // Repsotifoyr for course
  private courseRepository = AppDataSource.getRepository(Course);

  // Repsotuodyf for role
  private roleRepository = AppDataSource.getRepository(Role);

  // Repository for ranking
  private rankingRepository = AppDataSource.getRepository(Ranking);

  // Repository for comment
  private commentRepository = AppDataSource.getRepository(Comment);

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

  // Get all applications
  /**
   * query params in this are comma separated string of UUIds
   */
  getAllApplications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { courses, roles, availabilities, skills, search, sortBy } =
        req.query;

      const applications = await this.applicationRepository.find({
        where: {
          courseId: In(courses?.toString().split(",") || []),
          roleId: In(roles?.toString().split(",") || []),
          availabilityId: In(availabilities?.toString().split(",") || []),
          skills: In(skills?.toString().split(",") || []),
          sortBy: sortBy?.toString(),
        },
      });

      res.status(200).json({
        success: true,
        body: applications,
        message: "Applications fetched successfully",
      });
    } catch (error) {
      next(error);
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

  // // Update the comment on an application
  updateAppComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body = req.body;

      const application = await this.applicationRepository.findOne({
        where: { id: body.applicationId },
      });

      if (!application) {
        const error = new Error("Invalid Application!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      const lecturer = await this.userRepository.findOne({
        where: { id: body.lecturerId },
      });

      if (!lecturer) {
        const error = new Error("Lecturer does not exist!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // if comment already exists, update it else create a new one
      await this.commentRepository.save(body);

      res.status(200).json({
        success: true,
        body: body,
        message: "Successfully added the comment on the application",
      });
    } catch (error) {
      next(error);
      return;
    }
  };
}
