
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

// This test suite checks the functionality of the User entity in the database
describe("User Entity", () => {
  // Before running any tests, initialize the database connection
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  // After all tests finish, close the database connection to clean up
  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  // This test verifies that a new User can be created and saved successfully
  it("should create and save a user successfully", async () => {
    const userRepository = AppDataSource.getRepository(User);

    // Create a new user instance with mock data
    const testUser = new User();
    testUser.id = uuidv4(); // Generate a unique UUID
    testUser.name = "Test User";
    testUser.email = `testuser+${Date.now()}@example.com`; // Unique email to avoid duplicates
    testUser.phone = "0412345678";
    testUser.password = await bcrypt.hash("Test@123", 10); // Simulate secure password storage
    testUser.role = "candidate";

    // Save the user to the database
    const savedUser = await userRepository.save(testUser);

    // Assert that the saved user matches the input data
    expect(savedUser).toBeDefined();
    expect(savedUser.email).toBe(testUser.email);
    expect(savedUser.name).toBe("Test User");

    // Cleanup: remove the test user from the database
    await userRepository.delete({ id: testUser.id });
  });
});
