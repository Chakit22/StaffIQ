import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { authenticateToken } from "../../shared/middleware/auth.middleware";

const router = Router();
const userController = new UserController();

// All the routes are protected by the authenticateToken middleware
router.use(authenticateToken);

// Get details of a particular user
router.get("/:userId", userController.getUserDetails);

// Get all experiences of a candidate
router.get("/:userId/experiences", userController.getAllExperiences);

// Get all assigned courses assigned to a lecturer
router.get(
  "/lecturer/:lecturerId/assigned-courses",
  userController.getAllAssignedCourses
);

// Get all applications of a candidate
router.get(
  "/:userId/applications",
  userController.getAllApplicationsOfCandidate
);

export default router;
