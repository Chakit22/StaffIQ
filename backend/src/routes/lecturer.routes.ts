import { Router } from "express";
import { CourseController } from "../controllers/lecturer/CourseController";
import { validateDTO } from "../middleware/validate";
import { UpdateRankingDto } from "../dtos/update-ranking.dto";
import { UpdateAppStatusDto } from "../dtos/update-application-status";

const router = Router();

const courseController = new CourseController();

// Course routes

// Get all applications for a course
router.get("/applications/:courseId", courseController.getAllApplications);

// Get all assigned courses assigned to a lecturer
router.get("/courses/:userId", courseController.getAllAssignedCourses);

// Choose a candidate for a course
router.patch(
  "/applications",
  validateDTO(UpdateAppStatusDto),
  courseController.updateApplicationStatus
);

// Update the ranking of a candidate for a course
router.put(
  "/ranking",
  validateDTO(UpdateRankingDto),
  courseController.updateRanking
);

// Get all rankings for a course set by a lecturer
router.get("/rankings/:userId/:courseId", courseController.getPreferences);

// Get the statistics of a course
router.get("/stats/:courseId", courseController.getStats);

// Update the comment on an application
router.patch("/comments/:applicationId", courseController.updateAppComment);

export default router;
