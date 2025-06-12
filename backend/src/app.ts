import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes";
import courseRoutes from "./modules/courses/course.routes";
import applicationRoutes from "./modules/applications/application.routes";
import userRoutes from "./modules/users/user.routes"; 

import { authenticateToken } from "./shared/middleware/auth.middleware";
import errorHandler from "./shared/middleware/error-handler"; 


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/courses", authenticateToken, courseRoutes);
app.use("/api/applications", authenticateToken, applicationRoutes);
app.use("/api/users", authenticateToken, userRoutes); 

// Error handler
app.use(errorHandler);

export { app };
