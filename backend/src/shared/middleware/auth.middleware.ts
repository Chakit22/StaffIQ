import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config";
import * as cookie from "cookie";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.accessToken;

    if (!token || token.trim() === "") {
      res.status(401).json({
        success: false,
        message: "Authentication token is required",
        body: null,
      });
      return;
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    (req as AuthRequest).user = decoded;
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
        body: null,
      });
      return;
    }

    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication error",
      body: null,
    });
  }
};
