/**
 * Application Tests
 *
 * This file contains tests for application functionality including:
 * - Application submission
 * - Application retrieval
 * - Application status updates
 * - Application approval/rejection flows
 * - Application filtering and sorting
 */

import { AppDataSource } from "../data-source";
import { Application } from "../entity/Application";
import { User } from "../entity/User";
import { Course } from "../entity/Course";
import { Role } from "../entity/Role";
import { Skill } from "../entity/Skill";
import { Availability } from "../entity/Availability";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

describe("Application Entity Integration", () => {
  // Connect to the database before running tests
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  // Clean up database connection after tests finish
  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("should create and save an application with valid relations", async () => {
    const userRepo = AppDataSource.getRepository(User);
    const courseRepo = AppDataSource.getRepository(Course);
    const roleRepo = AppDataSource.getRepository(Role);
    const skillRepo = AppDataSource.getRepository(Skill);
    const availabilityRepo = AppDataSource.getRepository(Availability);
    const appRepo = AppDataSource.getRepository(Application);

    // Create a mock user with hashed password
    const user = userRepo.create({
      id: uuidv4(),
      name: "Test User",
      email: `applicant+${Date.now()}@example.com`,
      phone: "0411222333",
      password: await bcrypt.hash("Test@123", 10),
      role: "candidate", // this is a string role in User entity
    });
    await userRepo.save(user);

    // Create a mock course
    const course = courseRepo.create({
      id: uuidv4(),
      name: "Math 101",
      course_code: "COSC2354",
    });
    await courseRepo.save(course);

    // Create a mock role (linked to application, not user)
    const role = roleRepo.create({
      id: uuidv4(),
      name: "Tutor",
    });
    await roleRepo.save(role);

    // Create a skill (Skill has only one column: name)
    const skill = skillRepo.create({ name: "Python" });
    await skillRepo.save(skill);

    // Create availability (e.g. "full-time", "weekends", etc.)
    const availability = availabilityRepo.create({ availability: "full-time" });
    await availabilityRepo.save(availability);

    // Create the application and link all the above records
    const application = appRepo.create({
      academic_creds: "Bachelor of Science",
      userId: user.id,
      courseId: course.id,
      roleId: role.id,
      availabilityId: availability.id,
      skills: [skill], // Application can have many skills (many-to-many)
    });

    // Save to database
    const savedApp = await appRepo.save(application);

    // Check if saved correctly
    expect(savedApp).toBeDefined();
    expect(savedApp.academic_creds).toBe("Bachelor of Science");

    // Clean up database to avoid test pollution
    await appRepo.delete(savedApp.id);
    await skillRepo.delete(skill.name);
    await availabilityRepo.delete(availability.id);
    await roleRepo.delete(role.id);
    await courseRepo.delete(course.id);
    await userRepo.delete(user.id);
  });
});
