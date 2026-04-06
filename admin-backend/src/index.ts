import "reflect-metadata";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { AppDataSource } from "./data-source";
import { createSchema } from "./graphql/schema";
import dotenv from "dotenv";
// import { createContext } from "./graphql/context";

dotenv.config();

async function startServer() {
  const app = express();

  const allowedOrigins = [
    "http://localhost:3002",
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Allow all for now, tighten later
        }
      },
      credentials: true,
    })
  );
  app.use(express.json());

  // Initialize database connection
  try {
    await AppDataSource.initialize();
    console.log("Connected to MySQL");
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }

  // Create GraphQL schema
  const schema = await createSchema();

  // Initialize Apollo Server
  const server = new ApolloServer({
    schema,
    introspection: true,
    plugins: [],
  });

  await server.start();

  // Apply GraphQL middleware
  app.use("/graphql", expressMiddleware(server));

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "Admin Backend API is running" });
  });

  const PORT = process.env.PORT || 8001; // Using 8001 for admin backend

  app.listen(PORT, () => {
    console.log(`🚀 Admin Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
