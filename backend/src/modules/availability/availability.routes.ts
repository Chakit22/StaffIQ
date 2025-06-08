import { Router } from "express";
import { AvailabilityController } from "./controllers/AvailabilityController";
import { authenticateToken } from "../../shared/middleware/auth.middleware";

const router = Router();
const availabilityController = new AvailabilityController();

router.use(authenticateToken);

// Get all availabilities
router.get("/", availabilityController.getAllAvailabilities);

export default router;
