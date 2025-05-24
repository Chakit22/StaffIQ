import { Router } from "express";
import { AuthController } from "../controllers/auth/authController";
import { validateDTO } from "../middleware/validate";
import { CreateUserDto } from "../dtos/auth/create-user-dto";
import { LoginUserDto } from "../dtos/auth/login-user-dto";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();
const authController = new AuthController();

// Register route
router.post(
  "/register",
  validateDTO(CreateUserDto),
  authController.registerUser
);

// Login route
router.post("/login", validateDTO(LoginUserDto), authController.loginUser);

// Refresh token route (This is used to generate a new access token if it is expired)
router.post("/refresh-token", authController.refreshToken);

// Logout route
router.post("/logout", authenticateToken, authController.logout);

export default router;
