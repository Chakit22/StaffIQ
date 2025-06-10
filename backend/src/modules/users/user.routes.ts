import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import {
  requireLecturer,
  requireLecturerOrCandidate,
} from "../../shared/middleware/role.middleware";

const router = Router();
const userController = new UserController();

// All the routes are protected by the authenticateToken middleware
router.use(authenticateToken);

// Get details of a particular user - Both lecturers and candidates can view user details
router.get(
  "/:userId",
  requireLecturerOrCandidate,
  userController.getUserDetails
);

// Get all experiences of a candidate - Both lecturers and candidates can view experiences
router.get(
  "/:userId/experiences",
  requireLecturerOrCandidate,
  userController.getAllExperiences
);

// Get all assigned courses assigned to a lecturer - Only lecturers need this, but candidates might view it too
router.get(
  "/lecturer/:lecturerId/assigned-courses",
  requireLecturer,
  userController.getAllAssignedCourses
);

// Get all applications of a candidate - Both lecturers and candidates can view applications
router.get(
  "/:userId/applications",
  requireLecturerOrCandidate,
  userController.getAllApplicationsOfCandidate
);

export default router;
