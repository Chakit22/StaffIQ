import { Router } from "express";
import { ApplicationController } from "./controllers/ApplicationController";
import { CreateApplicationSchema } from "./schemas/create-application.schema";
import { validateSchema } from "../../shared/middleware/validate";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { UpdateApplicationRankingSchema } from "./schemas/update-application-ranking.schema";
import { UpdateApplicationCommentSchema } from "./schemas/update-application-comment.schema";
import { GetAllApplicationsSchema } from "./schemas/get-all-applications.schema";
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
  validateSchema(CreateApplicationSchema),
  applicationController.createApplication
);

// Get all applications for the authenticated candidate
router.get(
  "/my",
  requireCandidate,
  applicationController.getMyApplications
);

// Get all applications - Both lecturers and candidates can view (filtered by controller logic)
router.get(
  "/",
  requireLecturer,
  validateSchema(GetAllApplicationsSchema, "query"),
  applicationController.getAllApplications
);

// Update the ranking of a candidate for a course - Only lecturers can do this
router.patch(
  "/rankings/batch",
  requireLecturer,
  validateSchema(UpdateApplicationRankingSchema),
  applicationController.updateApplicationStatusRanking
);

// Get all rankings for a lecturer - Only lecturers can view their rankings
router.get(
  "/rankings/lecturer/:lecturerId",
  requireLecturer,
  applicationController.getLecturerRankings
);

// Delete a ranking - Only lecturers can delete their rankings
router.delete(
  "/rankings/:lecturerId/:applicationId",
  requireLecturer,
  applicationController.deleteRanking
);

// Update the comment on an application - Only lecturers can do this
router.put(
  "/comment",
  requireLecturer,
  validateSchema(UpdateApplicationCommentSchema),
  applicationController.updateAppComment
);

export default router;
