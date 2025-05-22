import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import candidateRoutes from "./routes/candidate.routes";
import errorHandler from "./middleware/error-handler";
import authRoutes from "./routes/auth.routes";
import lecturerRoutes from "./routes/lecturer.routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

//Mount the route
app.use("/api", authRoutes);

// Candidate routes
app.use("/api/candidate", candidateRoutes);

// Lecturer routes
app.use("/api/lecturer", lecturerRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MySQL and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Connected to MySQL");
    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("DB connection failed. Server not started.", err);
  });
