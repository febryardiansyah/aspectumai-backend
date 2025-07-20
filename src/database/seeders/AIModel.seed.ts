import AppDataSource from "../../config/datasource";
import AIModelEntity from "../entities/AIModel.entity";

export default class AIModelSeeder {
  async run(): Promise<void> {
    const repository = AppDataSource.getRepository(AIModelEntity);

    // Check if data already exists
    const existingModels = await repository.count();
    if (existingModels > 0) {
      console.log("AI Models already exist, skipping seeding...");
      return;
    }

    const models = [
      {
        name: "GPT-4 Turbo",
        apiUrl: "openai/gpt-4-turbo-preview"
      },
      {
        name: "GPT-3.5 Turbo",
        apiUrl: "openai/gpt-3.5-turbo"
      },
      {
        name: "Claude 3 Opus",
        apiUrl: "anthropic/claude-3-opus"
      },
      {
        name: "Claude 3 Sonnet",
        apiUrl: "anthropic/claude-3-sonnet"
      },
      {
        name: "Claude 3 Haiku",
        apiUrl: "anthropic/claude-3-haiku"
      },
      {
        name: "Gemini Pro",
        apiUrl: "google/gemini-pro"
      },
      {
        name: "Mistral Large",
        apiUrl: "mistralai/mistral-large"
      },
      {
        name: "Llama 3 70B",
        apiUrl: "meta-llama/llama-3-70b-instruct"
      }
    ];

    const entities = models.map(model => {
      const entity = new AIModelEntity();
      entity.name = model.name;
      entity.apiUrl = model.apiUrl;
      return entity;
    });

    await repository.save(entities);
    console.log(`✅ Seeded ${entities.length} AI models`);
  }
}
