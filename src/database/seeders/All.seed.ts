import AppDataSource from "../../config/datasource";
import AIModelSeeder from "./AIModel.seed";
import CategorySeeder from "./Category.seed";
import UserSeeder from "./User.seed";
import AgentSeeder from "./Agent.seed";

export default class AllSeeder {
  async run(): Promise<void> {
    console.log("🌱 Starting comprehensive seeding process...");
    
    try {
      // Run seeders in dependency order
      const aiModelSeeder = new AIModelSeeder();
      await aiModelSeeder.run();

      const categorySeeder = new CategorySeeder();
      await categorySeeder.run();

      const userSeeder = new UserSeeder();
      await userSeeder.run();

      const agentSeeder = new AgentSeeder();
      await agentSeeder.run();

      console.log("✅ All seeders completed successfully!");
    } catch (error) {
      console.error("❌ Error during seeding process:", error);
      throw error;
    }
  }
}
