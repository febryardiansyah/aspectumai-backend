import AppDataSource from "../config/datasource";
import AIModelSeeder from "./seeders/AIModel.seed";

async function testSeeder() {
  try {
    console.log("Initializing database connection...");
    await AppDataSource.initialize();
    console.log("Database connection initialized.");

    const seeder = new AIModelSeeder();
    await seeder.run();

    console.log("Closing database connection...");
    await AppDataSource.destroy();
    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Error during test:", error);
    process.exit(1);
  }
}

testSeeder();
