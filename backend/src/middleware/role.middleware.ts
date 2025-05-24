// This middleware is used to check if the user has the required role to access the route

import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const checkRole =
  (req: Request, res: Response, next: NextFunction) => (role: string) => {
    try {
      const user = (req as AuthRequest).user;
      if (user.role !== role) {
        res.status(403).json({
          success: false,
          message: "Unauthorized",
          body: null,
        });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
