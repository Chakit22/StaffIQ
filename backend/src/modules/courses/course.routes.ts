import { Router } from "express";
import { CourseController } from "./controllers/CourseController";
import { authenticateToken } from "../../shared/middleware/auth.middleware";

const router = Router();
const courseController = new CourseController();

// All the routes are protected by the authenticateToken middleware
router.use(authenticateToken);

// Get all courses
router.get("/", courseController.getAllCourses);

// Get all applications for a course
router.get(
  "/:courseId/applications",
  courseController.getAllApplicationsByCourse
);

// Get the statistics of a course
router.get("/:courseId/statistics", courseController.getStats);

// Get all preferences for a course set by a lecturer
router.get(
  "/:courseId/lecturer/:lecturerId/preferences",
  courseController.getPreferences
);

export default router;
