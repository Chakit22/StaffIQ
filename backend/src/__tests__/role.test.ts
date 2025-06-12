/**
 * Role Tests
 *
 * This file contains tests for the role management functionality including:
 * - Creating roles
 * - Retrieving roles
 * - Updating roles
 * - Role permissions and access control
 */

import { AppDataSource } from "../data-source";
import { Role } from "../entity/Role";
import { v4 as uuidv4 } from "uuid";

describe("Role Entity", () => {
  // Before running any test, we initialize the database connection
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  // After all tests are done, we close the database connection
  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("should create and fetch a role", async () => {
    const roleRepo = AppDataSource.getRepository(Role); // Get access to the Role repository

    // Create a new Role instance with a unique name (to avoid duplication during repeated test runs)
    const newRole = roleRepo.create({
      id: uuidv4(), // Generate a unique ID
      name: "testrole_" + Math.floor(Math.random() * 1000), // Unique name for the test
    });

    // Save the new role to the database
    const saved = await roleRepo.save(newRole);

    // Expect the saved role's name to include the test prefix, confirming it was saved correctly
    expect(saved.name).toContain("testrole_");

    // Retrieve the role back from the database by its ID
    const found = await roleRepo.findOneBy({ id: saved.id });

    // Expect the found role's ID to match the one we saved
    expect(found?.id).toBe(saved.id);

    // Clean up: delete the test role from the database to avoid clutter
    await roleRepo.delete(saved.id);
  });
});
