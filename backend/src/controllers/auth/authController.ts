import { NextFunction, Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";
import bcrypt from "bcrypt";
import { ApiError } from "../../middleware/error-handler";
import { AuthService } from "../../services/auth.service";
import { AuthRequest } from "../../middleware/auth.middleware";

export class AuthController {
  // User repository
  private userRepository = AppDataSource.getRepository(User);
  private authService = new AuthService();

  // REGISTER
  registerUser: RequestHandler = async (req, res, next) => {
    try {
      const user = this.userRepository.create(req.body as User);
      const existingUser = await this.userRepository.findOne({
        where: { email: user.email },
        relations: ["experiences"],
      });

      if (existingUser) {
        const error = new Error("User already exists") as ApiError;
        error.statusCode = 409;
        throw error;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      const savedUser = await this.userRepository.save({
        ...user,
        password: hashedPassword,
      });

      // Generate tokens
      const accessToken = this.authService.generateAccessToken(
        savedUser.id,
        savedUser.email,
        savedUser.role || "user"
      );
      const refreshToken = this.authService.generateRefreshToken(savedUser.id);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        body: {
          user: savedUser,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // LOGIN
  loginUser: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;

    console.log("Incoming login request:", { email, password });

    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ["experiences"],
      });

      console.log("User from DB:", user);

      if (!user) {
        const error = new Error("Invalid email or password") as ApiError;
        error.statusCode = 401;
        throw error;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match:", isMatch);

      if (!isMatch) {
        const error = new Error("Wrong password") as ApiError;
        error.statusCode = 401;
        throw error;
      }

      // Generate tokens
      const accessToken = this.authService.generateAccessToken(
        user.id,
        user.email,
        user.role || "user"
      );
      const refreshToken = this.authService.generateRefreshToken(user.id);

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        body: {
          user,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // REFRESH TOKEN
  refreshToken: RequestHandler = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        const error = new Error("Refresh token is required") as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const accessToken = this.authService.refreshAccessToken(refreshToken);
      res.json({ accessToken });
    } catch (error) {
      next(error);
    }
  };

  // PROTECTED ROUTE
  getProtectedRoute: RequestHandler = (req, res, next) => {
    try {
      const user = (req as AuthRequest).user;
      res.json({
        success: true,
        message: "You have access to this protected route",
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  // LOGOUT
  logout: RequestHandler = (req, res, next) => {
    try {
      const user = (req as AuthRequest).user;
      // In a real implementation, you might want to:
      // 1. Invalidate the refresh token in the database
      // 2. Add the token to a blacklist
      // 3. Clear client-side cookies if using cookie-based auth

      res.json({
        success: true,
        message: "Successfully logged out",
        user,
      });
    } catch (error) {
      next(error);
    }
  };
}
