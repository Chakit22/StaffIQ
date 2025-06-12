import { AppDataSource } from "./data-source";

async function runMigrations() {
  try {
    // Initialize the data source
    await AppDataSource.initialize();
    console.log("Database connection initialized");

    // Run migrations
    const migrations = await AppDataSource.runMigrations();
    console.log(`Successfully ran ${migrations.length} migrations`);

    // Close the connection
    await AppDataSource.destroy();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }
}

runMigrations();
