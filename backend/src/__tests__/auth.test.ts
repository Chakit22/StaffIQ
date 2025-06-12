
import request from "supertest";               
import { app } from "../app";                  
import { AppDataSource } from "../data-source"; 
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
  /**
   * This test checks the full flow of registering and logging in a user.
   * It makes sure that:
   * - A user can sign up with valid information
   * - The same user can immediately log in using their credentials
   * - A valid access token is returned in the login response
   */
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

