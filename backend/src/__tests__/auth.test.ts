/**
 * Authentication Tests
 *
 * This file contains tests for the authentication functionality including:
 * - User registration
 * - User login
 * - Authentication token validation
 */

import request from "supertest";
import { AppDataSource } from "../data-source";
import app from "../index";

// Connect to the database before any tests run
beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

// Close the database connection once all tests are done
afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Authentication Tests", () => {
  it("should register and then login a user successfully", async () => {
    const email = `test+${Date.now()}@example.com`; // We use a unique email to avoid conflicts across runs
    const password = "StrongPass123!";

    // First, try to register a new user
    const registerRes = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email,
      password,
      phone: "0400000000",
      role: "candidate",
    });

    // The registration should succeed and return HTTP 201
    expect(registerRes.statusCode).toBe(201);

    // Next, attempt to log in with the same credentials
    const loginRes = await request(app).post("/api/auth/login").send({
      email,
      password,
    });

    // A successful login should return HTTP 200
    expect(loginRes.statusCode).toBe(200);

    // We expect the login response to include an access token
    const token = loginRes.body.body?.accessToken;

    // If the token is defined, the login was successful and the system is working as expected
    expect(token).toBeDefined();
  });
});
