import { Router } from "express";
import { AuthController } from "./controllers/authController";
import { validateSchema } from "../../shared/middleware/validate";
import { RegisterUserSchema } from "./schemas/register.schema";
import { LoginUserSchema } from "./schemas/login.schema";
import { authenticateToken } from "../../shared/middleware/auth.middleware";

const router = Router();
const authController = new AuthController();

// Register route
router.post(
  "/register",
  validateSchema(RegisterUserSchema),
  authController.registerUser
);

// Login route
router.post(
  "/login",
  validateSchema(LoginUserSchema),
  authController.loginUser
);

// Refresh token route (This is used to generate a new access token if it is expired)
router.post("/refresh-token", authController.refreshToken);

// Logout route
router.post("/logout", authenticateToken, authController.logout);

export default router;
