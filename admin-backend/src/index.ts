import "reflect-metadata";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { AppDataSource } from "./data-source";
import { createSchema } from "./graphql/schema";
import dotenv from "dotenv";
import { createContext } from "./graphql/context";
import { GraphQLContext } from "./middleware/auth.middleware";
import cookie from "cookie";

dotenv.config();

async function startServer() {
  const app = express();

  // CORS configuration (Allow all origins)
  app.use(
    cors({
      origin: "*",
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
    context: ({ req, res }): GraphQLContext => {
      const cookies = cookie.parse(req.headers.cookie || "");
      const token = cookies.token;

      return {
        req,
        res,
        token,
      };
    },
    introspection: true,
    plugins: [],
  });

  await server.start();

  // Apply GraphQL middleware
  app.use("/graphql", expressMiddleware(server, { context: createContext }));

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
