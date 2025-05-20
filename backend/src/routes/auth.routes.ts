import { Router } from "express";
import { AuthController } from "../controllers/auth/authController";
import { validateDTO } from "../middleware/validate";
import { CreateUserDto } from "../dtos/auth/create-user-dto";
import { LoginUserDto } from "../dtos/auth/login-user-dto";

const router = Router();
const authController = new AuthController();

// register and Login routes
router.post(
  "/register",
  validateDTO(CreateUserDto),
  authController.registerUser
);

router.post("/login", validateDTO(LoginUserDto), authController.loginUser);

export default router;
