import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication token is required",
      body: null,
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Invalid or expired token",
      body: null,
    });
    return;
  }
};
