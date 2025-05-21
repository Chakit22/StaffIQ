import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import authRoute from "./routes/authRoute"; //Import auth route

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

//Mount the route
app.use("/api", authRoute);

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
