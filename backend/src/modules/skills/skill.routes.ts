import { Router } from "express";
import { SkillController } from "./controllers/SkillController";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { requireLecturerOrCandidate } from "../../shared/middleware/role.middleware";

const router = Router();
const skillController = new SkillController();

// All the routes are protected by the authenticateToken middleware
router.use(authenticateToken);

// Get all skills - Both lecturers and candidates can view skills
router.get("/", requireLecturerOrCandidate, skillController.getAllSkills);

export default router;
