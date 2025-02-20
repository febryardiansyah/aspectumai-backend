import { readdirSync } from "fs";
import { join } from "path";
import AppDataSource from "./datasource";

const dir = join(__dirname, "../", "database", "seeders");

async function run() {
  console.log("Initializing database connection...");
  await AppDataSource.initialize();
  console.log("Database connection initialized.");

  const files = readdirSync(dir).filter(file => file.endsWith(".seed.ts"));

  // Retrieve command-line arguments
  const args = process.argv.slice(2);
  const fileNameArg = args.find(arg => arg.startsWith("--file="));

  if (fileNameArg) {
    const fileNames = parseFileNames(fileNameArg);

    if (fileNames.length > 0) {
      console.log(`Running seeders for files: ${fileNames.join(", ")}`);

      for (const fileName of fileNames) {
        const file = files.find(file => file === `${fileName}.seed.ts`);
        if (file) {
          await runSeeder(file);
        } else {
          console.error(`Seeder file "${fileName}.seed.ts" not found.`);
        }
      }
    } else {
      console.error("No valid seeder files specified.");
    }
  } else {
    // No --file argument provided, run all seeders
    console.log("No specific seeder file specified, running all seeders...");
    for (const file of files) {
      await runSeeder(file);
    }
  }

  console.log("Closing database connection...");
  await AppDataSource.destroy();
  console.log("Database connection closed.");
}

function parseFileNames(fileNameArg: string): string[] {
  const argValue = fileNameArg.split("=")[1];
  const fileNames = argValue.split(",").map(fileName => fileName.trim());
  return fileNames;
}

async function runSeeder(file: string) {
  try {
    console.log(`Running seeder: ${file}`);
    const module = await import(join(dir, file));
    const seeder = new module.default();

    if (seeder.run && typeof seeder.run === "function") {
      await seeder.run();
      console.log(`Successfully ran seeder: ${file}`);
    } else {
      console.log(`Seeder ${file} does not have a run function.`);
    }
  } catch (err) {
    console.error(`Error running seeder ${file}:`, err);
  }
}

run().catch(err => {
  console.error("Error during seeding process:", err);
});
