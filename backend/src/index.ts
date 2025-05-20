import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import candidateRoutes from "./routes/candidate.routes";
import errorHandler from "./middleware/error-handler";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Temporary route for testing
app.get("/", (req, res) => {
  res.send("Backend is running at http://localhost:5000");
});

// Candidate routes
app.use("/api/candidate", candidateRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MySQL and start server
AppDataSource.initialize()
  .then(() => {
    console.log(" Connected to MySQL");
    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch((error: unknown) => {
    console.error("DB connection failed. Server not started.", error);
  });
