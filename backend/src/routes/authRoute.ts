import { Router } from "express";
import { loginUser, registerUser, updateUserProfile } from "../controllers/authController";

const router = Router();

//Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update-profile", updateUserProfile); 

export default router;
