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
import { GetAllApplicationsSchema } from "../schemas/get-all-applications.schema";
import { Skill } from "../../../entity/Skill";
import { AuthRequest } from "../../../shared/middleware/auth.middleware";

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

  // Repository for skill
  private skillRepository = AppDataSource.getRepository(Skill);

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
      console.log("body", body);
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

      // Check if skills exist, create them if they don't
      const skillPromises = body.skills.map(async (skill: { name: string }) => {
        const existingSkill = await this.skillRepository.findOne({
          where: { name: skill.name },
        });

        if (!existingSkill) {
          // Create the skill if it doesn't exist
          const newSkill = this.skillRepository.create({
            name: skill.name,
          });
          return await this.skillRepository.save(newSkill);
        }

        return existingSkill;
      });

      // Wait for all skills to be created/fetched
      const savedSkills = await Promise.all(skillPromises);
      body.skills = savedSkills;

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
      // Get the current user (lecturer) from the authenticated request
      const currentUser = (req as AuthRequest).user;

      // Get the lecturer with their assigned courses
      const lecturer = await this.userRepository.findOne({
        where: { id: currentUser.id },
        relations: ["courses"],
      });

      if (!lecturer) {
        const error = new Error("Lecturer not found!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Extract course IDs that are assigned to this lecturer
      const assignedCourseIds = lecturer.courses.map((course) => course.id);

      // Use validated query data if available, fallback to req.query
      const queryData = (req as any).validatedQuery || req.query;
      const { courses, roles, availabilities, skills, search, sortBy } =
        queryData;

      // Start building the query with joins for related entities
      let query = this.applicationRepository
        .createQueryBuilder("application")
        .leftJoinAndSelect("application.user", "user")
        .leftJoinAndSelect("application.course", "course")
        .leftJoinAndSelect("application.role", "role")
        .leftJoinAndSelect("application.availability", "availability")
        .leftJoinAndSelect("application.skills", "skills")
        // Filter applications to only show those for courses assigned to the lecturer
        .where("application.courseId IN (:...assignedCourseIds)", {
          assignedCourseIds,
        });

      // Apply filters - these work as OR conditions within each filter type
      if (courses) {
        query = query.andWhere("application.courseId IN (:...courseIds)", {
          courseIds: courses,
        });
      }

      if (roles) {
        query = query.andWhere("application.roleId IN (:...roleIds)", {
          roleIds: roles,
        });
      }

      if (availabilities) {
        query = query.andWhere(
          "application.availabilityId IN (:...availabilityIds)",
          { availabilityIds: availabilities }
        );
      }

      if (skills) {
        const skillNames = skills.map((skill: any) => skill.name);
        query = query.andWhere("skills.name IN (:...skillNames)", {
          skillNames,
        });
      }

      // Apply search - searches across course name, candidate name, availability, and skill names
      if (search && search.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query = query.andWhere(
          "(LOWER(course.name) LIKE LOWER(:searchTerm) OR LOWER(user.name) LIKE LOWER(:searchTerm) OR LOWER(availability.availability) LIKE LOWER(:searchTerm) OR LOWER(skills.name) LIKE LOWER(:searchTerm))",
          { searchTerm }
        );
      }

      // Apply sorting
      if (sortBy) {
        switch (sortBy) {
          case "course_name_asc":
            query = query.orderBy("course.name", "ASC");
            break;
          case "course_name_desc":
            query = query.orderBy("course.name", "DESC");
            break;
          case "availability_asc":
            query = query.orderBy("availability.availability", "ASC");
            break;
          case "availability_desc":
            query = query.orderBy("availability.availability", "DESC");
            break;
        }
      }

      // Execute the query
      const applications = await query.getMany();

      res.status(200).json({
        success: true,
        body: applications,
        message: "Applications fetched successfully",
      });
    } catch (error) {
      console.log("error ", error);
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

  // Get all rankings for a lecturer
  /**
   * Returns all the rankings done by a lecturer
   */
  getLecturerRankings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lecturerId = (req as any).params.lecturerId;

      // Get all rankings for the lecturer
      const rankings = await this.rankingRepository.find({
        where: { lecturerId },
        relations: [
          "application",
          "application.user",
          "application.course",
          "application.role",
          "application.availability",
          "application.skills",
        ],
        order: { rank: "ASC" },
      });

      res.status(200).json({
        success: true,
        body: rankings,
        message: "Rankings fetched successfully",
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  // Delete a ranking
  /**
   * Deletes a ranking for a lecturer and application
   */
  deleteRanking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lecturerId, applicationId } = req.params;

      // Delete the ranking
      await this.rankingRepository.delete({
        lecturerId,
        applicationId,
      });

      res.status(200).json({
        success: true,
        message: "Ranking deleted successfully",
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
