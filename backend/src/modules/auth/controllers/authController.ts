import { NextFunction, Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../../../data-source";
import { User } from "../../../entity/User";
import { Avatar } from "../../../entity/Avatar";
import bcrypt from "bcrypt";
import { ApiError } from "../../../shared/middleware/error-handler";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../../../shared/middleware/auth.middleware";
import { SheerIdService } from "../../../shared/services/sheerid.service";
import * as cookie from "cookie";

export class AuthController {
  // User repository
  private userRepository = AppDataSource.getRepository(User);
  private avatarRepository = AppDataSource.getRepository(Avatar);
  private authService = new AuthService();
  private sheerIdService = new SheerIdService();

  // REGISTER
  registerUser: RequestHandler = async (req, res, next) => {
    try {
      const user = this.userRepository.create(req.body as User);
      console.log("user", user);
      const existingUser = await this.userRepository.findOne({
        where: { email: user.email },
        relations: ["experiences"],
      });

      if (existingUser) {
        const error = new Error("User already exists") as ApiError;
        error.statusCode = 409;
        throw error;
      }

      // Get all available avatars from the database
      const avatars = await this.avatarRepository.find();

      // If there are avatars available, assign a random one to the user
      if (avatars.length > 0) {
        // Select a random avatar from the available ones
        const randomIndex = Math.floor(Math.random() * avatars.length);
        user.avatar = avatars[randomIndex];
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Auto-verify candidates when SKIP_VERIFICATION is enabled (dev mode)
      const isVerified =
        user.role === "candidate" && this.sheerIdService.shouldSkipVerification()
          ? true
          : user.role === "lecturer"
            ? true
            : false;

      const savedUser = await this.userRepository.save({
        ...user,
        password: hashedPassword,
        is_verified: isVerified,
      });

      // Generate tokens
      const accessToken = this.authService.generateAccessToken(
        savedUser.id,
        savedUser.email,
        savedUser.role
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

    console.log("Incoming login request:", { email });

    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ["experiences", "avatar"],
      });

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

      // Check if candidate has completed student verification
      if (user.role === "candidate" && !user.is_verified) {
        const error = new Error(
          "Please complete student verification.",
        ) as ApiError;
        error.statusCode = 403;
        throw error;
      }

      // Generate tokens
      const accessToken = this.authService.generateAccessToken(
        user.id,
        user.email,
        user.role
      );

      const refreshToken = this.authService.generateRefreshToken(user.id);

      // Set the cookies
      res.setHeader("Set-Cookie", [
        cookie.serialize("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 15, // 15 minutes
          path: "/",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        }),
        cookie.serialize("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        }),
        cookie.serialize("user", JSON.stringify(user), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        }),
      ]);

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

  // GET CURRENT USER
  getCurrentUser: RequestHandler = async (req, res, next) => {
    try {
      const user = (req as AuthRequest).user;
      console.log("user", user);
      res.json({
        success: true,
        message: "User fetched successfully",
        body: user,
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
      res.json({
        success: true,
        message: "Access token refreshed successfully",
        body: {
          accessToken,
        },
      });
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

  // VERIFY STUDENT — start SheerID verification
  verifyStudent: RequestHandler = async (req, res, next) => {
    try {
      const { userId, firstName, lastName, email, birthDate, university, graduationYear } = req.body;

      if (!userId) {
        const error = new Error("userId is required") as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        const error = new Error("User not found") as ApiError;
        error.statusCode = 404;
        throw error;
      }

      if (user.role !== "candidate") {
        const error = new Error("Only candidates require student verification") as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Dev bypass: skip SheerID and mark as verified
      if (this.sheerIdService.shouldSkipVerification()) {
        user.is_verified = true;
        await this.userRepository.save(user);
        res.json({
          success: true,
          message: "Student verified (dev bypass)",
          body: { verificationId: "dev-bypass", status: "success" },
        });
        return;
      }

      const result = await this.sheerIdService.startVerification({
        firstName,
        lastName,
        email,
        birthDate,
        university,
        graduationYear,
      });

      res.json({
        success: true,
        message: "Verification started",
        body: {
          verificationId: result.verificationId,
          status: result.currentStep,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // GET VERIFICATION STATUS — poll SheerID for result
  getVerificationStatus: RequestHandler = async (req, res, next) => {
    try {
      const id = req.params.id as string;

      // Dev bypass
      if (id === "dev-bypass") {
        res.json({
          success: true,
          message: "Verification complete (dev bypass)",
          body: { status: "success", currentStep: "success" },
        });
        return;
      }

      const result = await this.sheerIdService.getVerificationStatus(id);

      // If verification succeeded, update the user
      if (result.currentStep === "success") {
        const { userId } = req.query;
        if (userId && typeof userId === "string") {
          const user = await this.userRepository.findOneBy({ id: userId });
          if (user) {
            user.is_verified = true;
            await this.userRepository.save(user);
          }
        }
      }

      res.json({
        success: true,
        message: "Verification status retrieved",
        body: {
          status: result.currentStep,
          verificationId: result.verificationId,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // LOGOUT
  logout: RequestHandler = (req, res, next) => {
    try {
      // Clear the cookies properly with all attributes
      res.setHeader("Set-Cookie", [
        cookie.serialize("accessToken", "", {
          maxAge: 0,
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        }),
        cookie.serialize("refreshToken", "", {
          maxAge: 0,
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        }),
        cookie.serialize("user", "", {
          maxAge: 0,
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        }),
      ]);

      res.status(200).json({
        success: true,
        message: "Successfully logged out",
        body: null,
      });
    } catch (error) {
      next(error);
    }
  };
}
