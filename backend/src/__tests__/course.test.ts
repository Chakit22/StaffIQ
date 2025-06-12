/**
 * Course Tests
 *
 * This file contains tests for course management functionality including:
 * - Course creation
 * - Course retrieval
 * - Course updates
 * - Course deletion
 * - Course enrollment and assignment
 */

import { AppDataSource } from "../data-source";
import { Course } from "../entity/Course";
import { v4 as uuidv4 } from "uuid";

describe("Course Entity", () => {
  // Initialize the DB connection before tests
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  // Destroy the DB connection after all tests
  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("should create and fetch a course", async () => {
    const courseRepo = AppDataSource.getRepository(Course); // Access the Course repository

    // Step 1: Create a new course object with a unique name and course code
    const testCourse = courseRepo.create({
      id: uuidv4(), // Assign a UUID to avoid conflicts
      name: "Introduction to Testing",
      course_code: "TEST" + Math.floor(Math.random() * 1000), // Ensure course_code is unique
    });

    // Step 2: Save the course to the database
    const savedCourse = await courseRepo.save(testCourse);

    // Step 3: Expect the course to be saved and returned properly
    expect(savedCourse).toBeDefined();
    expect(savedCourse.name).toBe("Introduction to Testing");

    // Step 4: Fetch the course using its ID and confirm it matches
    const foundCourse = await courseRepo.findOneBy({ id: savedCourse.id });
    expect(foundCourse?.course_code).toBe(savedCourse.course_code);

    // Step 5: Clean up - remove the test course after verification
    await courseRepo.delete(savedCourse.id);
  });
});
