import { Router } from "express";
import { ApplicationController } from "../controllers/candidate/ApplicationController";
import { CreateApplicationDto } from "../dtos/create-application.dto";
import { UpdateUserAvatarDto } from "../dtos/update-user-avatar.dto";
import { validateDTO } from "../middleware/validate";
import { UserController } from "../controllers/candidate/UserController";
import { ExperienceController } from "../controllers/candidate/ExperienceController";
const router = Router();

// DTO Validation is of the payload which is passed in the request body

const applicationController = new ApplicationController();
const userController = new UserController();
const experienceController = new ExperienceController();

// All the routes for candidate

// Creating a application
router.post(
  "/apply",
  validateDTO(CreateApplicationDto),
  applicationController.createApplication
);

// Getting all applications of a candidate
router.get("/applications/:userId", applicationController.getAllApplications);

// Getting all experiences of a candidate
router.get("/experiences/:userId", experienceController.getAllExperiences);

// Get details of a particular user
router.get("/:userId", userController.getUserDetails);

// // Update details (avatar) of a user
// router.patch(
//   "/:userId",
//   validateDTO(UpdateUserAvatarDto),
//   userController.updateUserAvatar
// );

export default router;
