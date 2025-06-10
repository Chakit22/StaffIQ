import { Router } from "express";
import { ApplicationController } from "./controllers/ApplicationController";
import { CreateApplicationDto } from "./dtos/create-application.dto";
import { validateDTO } from "../../shared/middleware/validate";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { UpdateApplicationRankingDto } from "./dtos/update-application-ranking";
import { UpdateAppCommentDto } from "./dtos/update-application-comment.dto";
import { GetAllApplicationsDto } from "./dtos/get-all-applications.dto";
import {
  requireLecturer,
  requireCandidate,
} from "../../shared/middleware/role.middleware";

const router = Router();

// All the routes are protected by the authenticateToken middleware
router.use(authenticateToken);

const applicationController = new ApplicationController();

// Creating a application - Only candidates can create applications
router.post(
  "/",
  requireCandidate,
  validateDTO(CreateApplicationDto),
  applicationController.createApplication
);

// Get all applications - Both lecturers and candidates can view (filtered by controller logic)
router.get(
  "/",
  requireLecturer,
  // validateDTO(GetAllApplicationsDto, "query"),
  applicationController.getAllApplications
);

// Update the ranking of a candidate for a course - Only lecturers can do this
router.patch(
  "/rankings/batch",
  requireLecturer,
  validateDTO(UpdateApplicationRankingDto),
  applicationController.updateApplicationStatusRanking
);

// Update the comment on an application - Only lecturers can do this
router.put(
  "/comment",
  requireLecturer,
  validateDTO(UpdateAppCommentDto),
  applicationController.updateAppComment
);

export default router;
