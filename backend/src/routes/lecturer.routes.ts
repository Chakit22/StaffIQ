import { Router } from "express";
import { CourseController } from "../controllers/lecturer/CourseController";

const router = Router();

const courseController = new CourseController();

// Course routes

// Get all applications for a course
router.get("/applications/:courseId", courseController.getAllApplications);

// Get all assigned courses assigned to a lecturer
router.get("/courses/:userId", courseController.getAllCourses);

// Choose a candidate for a course
router.post("/applications", courseController.chooseCandidate);

// Update the ranking of a candidate for a course
router.patch("/ranking", courseController.updateRanking);

// Get all rankings for a course set by a lecturer
router.get("/rankings/:userId/:courseId", courseController.getAllRankings);

// Get the statistics of a course
router.get("/statistics/:courseId", courseController.getCourseStatistics);

export default router;
