import { Router } from "express";
import { CourseController } from "./controllers/CourseController";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import {
  requireLecturer,
  requireLecturerOrCandidate,
} from "../../shared/middleware/role.middleware";

const router = Router();
const courseController = new CourseController();

// All the routes are protected by the authenticateToken middleware
router.use(authenticateToken);

// Get all courses - Both lecturers and candidates can view courses
router.get("/", requireLecturerOrCandidate, courseController.getAllCourses);

// Get all applications for a course - Only lecturers can view course applications
router.get(
  "/:courseId/applications",
  requireLecturer,
  courseController.getAllApplicationsByCourse
);

// Get the statistics of a course - Only lecturers can view course statistics
router.get("/:courseId/statistics", requireLecturer, courseController.getStats);

// Get all preferences for a course set by a lecturer - Only lecturers can view preferences
router.get(
  "/:courseId/lecturer/:lecturerId/preferences",
  requireLecturer,
  courseController.getPreferences
);

export default router;
