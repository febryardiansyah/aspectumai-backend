#!/usr/bin/env node
/* eslint-disable */

// Simple validation script to check if all seeders can be imported
async function validateSeeders() {
  console.log("🔍 Validating seeder imports...");
  
  try {
    // Test imports
    const AIModelSeeder = require("./seeders/AIModel.seed.ts").default;
    const CategorySeeder = require("./seeders/Category.seed.ts").default;  
    const UserSeeder = require("./seeders/User.seed.ts").default;
    const AgentSeeder = require("./seeders/Agent.seed.ts").default;
    const AllSeeder = require("./seeders/All.seed.ts").default;
    const DevelopmentSeeder = require("./seeders/Development.seed.ts").default;
    
    console.log("✅ All seeder imports successful!");
    
    // Test instantiation
    new AIModelSeeder();
    new CategorySeeder();
    new UserSeeder();
    new AgentSeeder();
    new AllSeeder();
    new DevelopmentSeeder();
    
    console.log("✅ All seeders can be instantiated!");
    console.log("✅ Seeders validation completed successfully!");
    
  } catch (error) {
    console.error("❌ Validation failed:", error);
    process.exit(1);
  }
}

validateSeeders();
