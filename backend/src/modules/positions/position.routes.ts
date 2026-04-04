import { Router } from "express";
import { PositionController } from "./controllers/PositionController";
import { CreatePositionSchema } from "./schemas/create-position.schema";
import { UpdatePositionSchema } from "./schemas/update-position.schema";
import { UpdateApplicationStatusSchema } from "./schemas/update-application-status.schema";
import { validateSchema } from "../../shared/middleware/validate";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { requireLecturer } from "../../shared/middleware/role.middleware";

const router = Router();

const positionController = new PositionController();

// All routes require authentication
router.use(authenticateToken);

// Get all open positions (any authenticated user)
router.get("/", positionController.getAllPositions);

// Get a single position by id
router.get("/:id", positionController.getPositionById);

// Create a position (lecturer only)
router.post(
  "/",
  requireLecturer,
  validateSchema(CreatePositionSchema),
  positionController.createPosition,
);

// Update a position (lecturer only)
router.patch(
  "/:id",
  requireLecturer,
  validateSchema(UpdatePositionSchema),
  positionController.updatePosition,
);

// Close a position (lecturer only)
router.patch(
  "/:id/close",
  requireLecturer,
  positionController.closePosition,
);

// Update application status (lecturer only)
router.patch(
  "/applications/:id/status",
  requireLecturer,
  validateSchema(UpdateApplicationStatusSchema),
  positionController.updateApplicationStatus,
);

export default router;
