import { Router } from "express";
import { AvailabilityController } from "./controllers/AvailabilityController";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { requireLecturer } from "../../shared/middleware/role.middleware";

const router = Router();
const availabilityController = new AvailabilityController();

router.use(authenticateToken);

// Get all availabilities - Both lecturers and candidates can view availability options
router.get("/", requireLecturer, availabilityController.getAllAvailabilities);

export default router;
