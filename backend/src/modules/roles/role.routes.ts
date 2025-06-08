import { Router } from "express";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { RoleController } from "./controllers/RoleController";

const router = Router();
const roleController = new RoleController();

// All the routes are protected by the authenticateToken middleware
router.use(authenticateToken);

// Get all roles
router.get("/", roleController.getAllRoles);

export default router;
