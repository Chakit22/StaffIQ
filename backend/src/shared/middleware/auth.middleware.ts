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
    // Get the data from the cookies
    const cookies = cookie.parse(req.headers.cookie || "");
    console.log("cookies ", cookies);

    // Get the access token from the cookies
    const token = cookies.accessToken;

    console.log("token ", token);

    // Check if token exists and is not empty
    if (!token || token.trim() === "") {
      res.status(401).json({
        success: false,
        message: "Authentication token is required",
        body: null,
      });
      return;
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, jwtConfig.secret);
    (req as AuthRequest).user = decoded;
    console.log("decoded", decoded);
    next();
  } catch (error) {
    // Handle any other unexpected errors
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication error",
      body: null,
    });
    return;
  }
};
