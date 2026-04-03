import { Router } from "express";
import { AIController } from "./controllers/aiController";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { requireLecturer } from "../../shared/middleware/role.middleware";

const router = Router();
const aiController = new AIController();

// All AI routes require authentication and lecturer role
router.post(
  "/candidate-summary",
  authenticateToken,
  requireLecturer,
  aiController.getCandidateSummary,
);

router.post(
  "/ranking-suggestion",
  authenticateToken,
  requireLecturer,
  aiController.getRankingSuggestion,
);

export default router;
