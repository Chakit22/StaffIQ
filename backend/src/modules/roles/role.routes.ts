import { Router } from "express";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { RoleController } from "./controllers/RoleController";
import { requireLecturerOrCandidate } from "../../shared/middleware/role.middleware";

const router = Router();
const roleController = new RoleController();

// All the routes are protected by the authenticateToken middleware
router.use(authenticateToken);

// Get all roles - Both lecturers and candidates can view available roles
router.get("/", requireLecturerOrCandidate, roleController.getAllRoles);

export default router;
