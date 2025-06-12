import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import errorHandler from "./shared/middleware/error-handler";
import authRoutes from "./modules/auth/auth.routes";
import dotenv from "dotenv";
import applicationRoutes from "./modules/applications/application.routes";
import courseRoutes from "./modules/courses/course.routes";
import userRoutes from "./modules/users/user.routes";
import roleRoutes from "./modules/roles/role.routes";
import skillRoutes from "./modules/skills/skill.routes";
import availabilityRoutes from "./modules/availability/availability.routes";
dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(express.json());

// Dummy test route
app.get("/test/ping", (_req, res) => {
  res.status(200).json({ message: "pong" });
});


//Mount the route

// application routes
app.use("/api/applications", applicationRoutes);

// auth routes
app.use("/api/auth", authRoutes);

// course routes
app.use("/api/courses", courseRoutes);

// user routes
app.use("/api/users", userRoutes);

// role routes
app.use("/api/roles", roleRoutes);

// skill routes
app.use("/api/skills", skillRoutes);

// availability routes
app.use("/api/availabilities", availabilityRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MySQL and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Connected to MySQL");
    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("DB connection failed. Server not started.", err);
  });
export default app;

