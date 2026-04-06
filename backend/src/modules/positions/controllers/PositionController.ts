import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { Position } from "../../../entity/Position";
import { Application } from "../../../entity/Application";
import { Course } from "../../../entity/Course";
import { Role } from "../../../entity/Role";
import { ApiError } from "../../../shared/middleware/error-handler";
import { AuthRequest } from "../../../shared/middleware/auth.middleware";

export class PositionController {
  private positionRepository = AppDataSource.getRepository(Position);
  private applicationRepository = AppDataSource.getRepository(Application);
  private courseRepository = AppDataSource.getRepository(Course);
  private roleRepository = AppDataSource.getRepository(Role);

  // Get all open positions (public for candidates)
  getAllPositions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const positions = await this.positionRepository.find({
        where: { status: "open" },
        relations: ["course", "role", "creator"],
        order: { created_at: "DESC" },
      });

      res.status(200).json({
        success: true,
        body: positions,
        message: "Positions fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  // Get a single position by id
  getPositionById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id as string;

      const position = await this.positionRepository.findOne({
        where: { id },
        relations: ["course", "role", "creator"],
      });

      if (!position) {
        const error = new Error("Position not found") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        success: true,
        body: position,
        message: "Position fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  // Create a position (lecturer only)
  createPosition = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const body = req.body;
      const currentUser = (req as AuthRequest).user;

      // Validate course exists
      const course = await this.courseRepository.findOne({
        where: { id: body.courseId },
      });
      if (!course) {
        const error = new Error("Invalid course!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Validate role exists
      const role = await this.roleRepository.findOne({
        where: { id: body.roleId },
      });
      if (!role) {
        const error = new Error("Invalid role!") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      const position = this.positionRepository.create({
        ...body,
        created_by: currentUser.id,
      });

      await this.positionRepository.save(position);

      res.status(201).json({
        success: true,
        body: position,
        message: "Position created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  // Update a position (lecturer only)
  updatePosition = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id as string;
      const body = req.body;

      const position = await this.positionRepository.findOne({
        where: { id },
      });

      if (!position) {
        const error = new Error("Position not found") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      await this.positionRepository.update(id, body);

      const updated = await this.positionRepository.findOne({
        where: { id },
        relations: ["course", "role", "creator"],
      });

      res.status(200).json({
        success: true,
        body: updated,
        message: "Position updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  // Close a position (lecturer only)
  closePosition = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id as string;

      const position = await this.positionRepository.findOne({
        where: { id },
      });

      if (!position) {
        const error = new Error("Position not found") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      position.status = "closed";
      await this.positionRepository.save(position);

      res.status(200).json({
        success: true,
        body: position,
        message: "Position closed successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  // Update application status (lecturer only)
  updateApplicationStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      const application = await this.applicationRepository.findOne({
        where: { id },
      });

      if (!application) {
        const error = new Error("Application not found") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      application.status = status;
      await this.applicationRepository.save(application);

      res.status(200).json({
        success: true,
        body: application,
        message: "Application status updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
