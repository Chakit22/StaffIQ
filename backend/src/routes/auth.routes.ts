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

// Refresh token route
router.post("/refresh-token", authController.refreshToken);

// Protected route example
router.get("/protected", authenticateToken, authController.getProtectedRoute);

// Logout route
router.post("/logout", authenticateToken, authController.logout);

export default router;
