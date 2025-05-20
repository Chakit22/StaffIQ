import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";
import bcrypt from "bcrypt";
import { ApiError } from "../../middleware/error-handler";

export class AuthController {
  // User repository
  private userRepository = AppDataSource.getRepository(User);

  // REGISTER
  registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = this.userRepository.create(req.body as User);
      const existingUser = await this.userRepository.findOne({
        where: { email: user.email },
      });

      if (existingUser) {
        const error = new Error("User already exists") as ApiError;
        error.statusCode = 409;
        throw error;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      await this.userRepository.save({ ...user, password: hashedPassword });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        body: user,
      });
    } catch (error) {
      next(error);
    }
  };

  // LOGIN
  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    console.log("Incoming login request:", { email, password });

    try {
      const user = await this.userRepository.findOne({ where: { email } });

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

      res.status(200).json({
        success: true,
        message: "User logged In Sucessfully",
        body: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
