import { Router } from "express";
import { CourseController } from "../controllers/lecturer/CourseController";
import { validateDTO } from "../middleware/validate";
import { UpdateApplicationRankingDto } from "../dtos/update-application-ranking";
import { authenticateToken } from "../middleware/auth.middleware";
import { UpdateAppCommentDto } from "../dtos/update-application-comment.dto";

const router = Router();
const courseController = new CourseController();

// All the routes are protected by the authenticateToken middleware
router.use(authenticateToken);

// Course routes

// Get all applications for a course
router.get("/applications/:courseId", courseController.getAllApplications);

// Get all assigned courses assigned to a lecturer
router.get("/courses/:lecturerId", courseController.getAllAssignedCourses);

// Update the ranking of a candidate for a course
router.patch(
  "/ranking",
  validateDTO(UpdateApplicationRankingDto),
  courseController.updateApplicationStatusRanking
);

// Get all preferences for a course set by a lecturer
router.get(
  "/preferences/:lecturerId/:courseId",
  courseController.getPreferences
);

// Get the statistics of a course
router.get("/stats/:courseId", courseController.getStats);

// Update the comment on an application
router.put(
  "/comment",
  validateDTO(UpdateAppCommentDto),
  courseController.updateAppComment
);

export default router;
