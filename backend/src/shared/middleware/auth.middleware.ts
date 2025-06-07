import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config";
import cookie from "cookie";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Get the data from the cookies
  const cookies = cookie.parse(req.headers.cookie || "");

  // Get the access token from the cookies
  const token = cookies.accessToken;

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
