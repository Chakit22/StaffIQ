import { Router } from "express";
import { SkillController } from "./controllers/SkillController";
import { authenticateToken } from "../../shared/middleware/auth.middleware";

const router = Router();
const skillController = new SkillController();

// All the routes are protected by the authenticateToken middleware
router.use(authenticateToken);

// Get all skills
router.get("/", skillController.getAllSkills);

export default router;
