import { Router } from "express";
import { AIController } from "./controllers/aiController";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import {
  requireLecturer,
  requireCandidate,
} from "../../shared/middleware/role.middleware";

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

// Resume insights — for candidates
router.post(
  "/resume-insights",
  authenticateToken,
  requireCandidate,
  aiController.getResumeInsights,
);

export default router;
