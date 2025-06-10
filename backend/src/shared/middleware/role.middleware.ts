// This middleware is used to check if the user has the required role to access the route

import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

// Middleware to check if user has lecturer role
export const requireLecturer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = (req as AuthRequest).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
        body: null,
      });
      return;
    }

    if (user.role !== "lecturer") {
      res.status(403).json({
        success: false,
        message: "Access denied. Only lecturers can access this resource.",
        body: null,
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if user has candidate role
export const requireCandidate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = (req as AuthRequest).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
        body: null,
      });
      return;
    }

    if (user.role !== "candidate") {
      res.status(403).json({
        success: false,
        message: "Access denied. Only candidates can access this resource.",
        body: null,
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if user is either lecturer or candidate (both allowed)
export const requireLecturerOrCandidate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = (req as AuthRequest).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
        body: null,
      });
      return;
    }

    if (user.role !== "lecturer" && user.role !== "candidate") {
      res.status(403).json({
        success: false,
        message:
          "Access denied. Only lecturers and candidates can access this resource.",
        body: null,
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
