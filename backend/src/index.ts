import "reflect-metadata";
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import candidateRoutes from "./routes/candidate.routes";
import errorHandler from "./middleware/error-handler";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Temporary route for testing
app.get("/", (req: Request, res: Response) => {
  console.log("Backend is running at http://localhost:3000");
  res
    .status(200)
    .json({ message: "Backend is running at http://localhost:3000" });
  return;
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Candidate routes
app.use("/api/candidate", candidateRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MySQL and start server
AppDataSource.initialize()
  .then(() => {
    console.log(" Connected to MySQL");
    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  })
  .catch((error: unknown) => {
    console.error("DB connection failed. Server not started.", error);
  });
