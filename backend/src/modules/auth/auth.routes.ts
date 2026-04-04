import { Router } from "express";
import { AuthController } from "./controllers/authController";
import { validateSchema } from "../../shared/middleware/validate";
import { RegisterUserSchema } from "./schemas/register.schema";
import { LoginUserSchema } from "./schemas/login.schema";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { verifyCaptcha } from "../../shared/middleware/captcha.middleware";

const router = Router();
const authController = new AuthController();

// Register route
router.post(
  "/register",
  verifyCaptcha,
  validateSchema(RegisterUserSchema),
  authController.registerUser,
);

// Login route
router.post(
  "/login",
  verifyCaptcha,
  validateSchema(LoginUserSchema),
  authController.loginUser,
);

// Get current user route
router.get("/me", authenticateToken, authController.getCurrentUser);

// Refresh token route (This is used to generate a new access token if it is expired)
router.post("/refresh-token", authController.refreshToken);

// Logout route
router.post("/logout", authenticateToken, authController.logout);

// SheerID student verification
router.post("/verify-student", authController.verifyStudent);
router.get("/verification-status/:id", authController.getVerificationStatus);

export default router;
