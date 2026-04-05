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
import aiRoutes from "./modules/ai/ai.routes";
import positionRoutes from "./modules/positions/position.routes";
dotenv.config();

const app = express();

// Allow all origins
const allowedOrigins = [
  "http://localhost:3001",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

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

// ai routes
app.use("/api/ai", aiRoutes);

// position routes
app.use("/api/positions", positionRoutes);

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
