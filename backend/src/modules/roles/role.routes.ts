import { Router } from "express";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { RoleController } from "./controllers/RoleController";
import { requireLecturer } from "../../shared/middleware/role.middleware";

const router = Router();
const roleController = new RoleController();

// All the routes are protected by the authenticateToken middleware
router.use(authenticateToken);

// Get all roles - Only lecturers can view available roles
router.get("/", requireLecturer, roleController.getAllRoles);

export default router;
