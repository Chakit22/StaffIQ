import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Course } from "../entity/Course";
import { Role } from "../entity/Role";
import { Skill } from "../entity/Skill";
import { Availability } from "../entity/Availability";
import { Application } from "../entity/Application";
import { Comment } from "../entity/Comment";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

describe("Comment Entity Integration", () => {
  // Initialize the database connection before running tests
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  // Close the database connection after all tests complete
  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("should create and retrieve a comment linked to an application", async () => {
    // Get repositories for each entity involved in the test
    const userRepo = AppDataSource.getRepository(User);
    const courseRepo = AppDataSource.getRepository(Course);
    const roleRepo = AppDataSource.getRepository(Role);
    const skillRepo = AppDataSource.getRepository(Skill);
    const availabilityRepo = AppDataSource.getRepository(Availability);
    const appRepo = AppDataSource.getRepository(Application);
    const commentRepo = AppDataSource.getRepository(Comment);

    // Create a lecturer user who will author the comment
    const lecturer = userRepo.create({
      id: uuidv4(),
      name: "Lecturer User",
      email: `lecturer+${Date.now()}@example.com`,
      phone: "0411111111",
      password: await bcrypt.hash("Test@123", 10),
      role: "lecturer",
    });
    await userRepo.save(lecturer);

    // Create a candidate user who owns the application
    const candidate = userRepo.create({
      id: uuidv4(),
      name: "Candidate User",
      email: `candidate+${Date.now()}@example.com`,
      phone: "0499999999",
      password: await bcrypt.hash("Test@123", 10),
      role: "candidate",
    });
    await userRepo.save(candidate);

    // Create a course entity to attach the application to
    const course = courseRepo.create({
      id: uuidv4(),
      name: "AI",
      course_code: "COSC23401",
    });
    await courseRepo.save(course);

    // Create a role entity for the application (e.g., Tutor)
    const role = roleRepo.create({
      id: uuidv4(),
      name: "candidate",
    });
    await roleRepo.save(role);

    // Ensure a Skill entity exists, or create one if it does not
    let skill = await skillRepo.findOneBy({ name: "JavaScript" });
    if (!skill) {
      skill = skillRepo.create({ name: "JavaScript" });
      await skillRepo.save(skill);
    }

    // Create an Availability entity for the application
    const availability = availabilityRepo.create({
      id: uuidv4(),
      availability: "part-time",
    });
    await availabilityRepo.save(availability);

    // Create the Application entity linking the candidate to course, role, availability, and skills
    const application = appRepo.create({
      academic_creds: "BSc in AI",
      userId: candidate.id,
      courseId: course.id,
      roleId: role.id,
      availabilityId: availability.id,
      skills: [skill],
    });
    await appRepo.save(application);

    // Create the Comment entity authored by the lecturer on this application
    const comment = commentRepo.create({
      lecturerId: lecturer.id,
      applicationId: application.id,
      comment: "Great candidate for the role!",
    });
    await commentRepo.save(comment);

    // Fetch the comment from the repository to verify it was saved correctly
    const fetched = await commentRepo.findOneBy({
      lecturerId: lecturer.id,
      applicationId: application.id,
    });

    // Assert the fetched comment exists and contains the expected text
    expect(fetched).toBeDefined();
    expect(fetched?.comment).toBe("Great candidate for the role!");

    // Cleanup: delete created entities to keep the database clean for other tests
    await commentRepo.delete({ lecturerId: lecturer.id, applicationId: application.id });
    await appRepo.delete(application.id);
    await availabilityRepo.delete(availability.id);
    await roleRepo.delete(role.id);
    await courseRepo.delete(course.id);
    await userRepo.delete(candidate.id);
    await userRepo.delete(lecturer.id);
  });
});
