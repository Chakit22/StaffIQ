import { Router } from "express";
import { ApplicationController } from "./controllers/ApplicationController";
import { CreateApplicationDto } from "./dtos/create-application.dto";
import { validateDTO } from "../../shared/middleware/validate";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { UpdateApplicationRankingDto } from "./dtos/update-application-ranking";
import { UpdateAppCommentDto } from "./dtos/update-application-comment.dto";
const router = Router();

// All the routes are protected by the authenticateToken middleware
router.use(authenticateToken);

const applicationController = new ApplicationController();

// Creating a application
router.post(
  "/",
  validateDTO(CreateApplicationDto),
  applicationController.createApplication
);

// Update the ranking of a candidate for a course
router.patch(
  "/rankings/batch",
  validateDTO(UpdateApplicationRankingDto),
  applicationController.updateApplicationStatusRanking
);

// Update the comment on an application
router.put(
  "/comment",
  validateDTO(UpdateAppCommentDto),
  applicationController.updateAppComment
);

export default router;
