import AppDataSource from "../../config/datasource";
import CategoryEntity from "../entities/Category.entity";

export default class CategorySeeder {
  async run(): Promise<void> {
    const repository = AppDataSource.getRepository(CategoryEntity);

    // Check if data already exists
    const existingCategories = await repository.count();
    if (existingCategories > 0) {
      console.log("Categories already exist, skipping seeding...");
      return;
    }

    const categories = [
      "Productivity",
      "Creative Writing",
      "Code Assistant",
      "Customer Support",
      "Education",
      "Marketing",
      "Analysis",
      "Translation",
      "Research",
      "Entertainment",
      "Business",
      "Health & Fitness",
      "Travel",
      "Finance",
      "Legal",
      "HR",
      "Sales",
      "Data Science",
      "Design",
      "General"
    ];

    const entities = categories.map(categoryName => {
      const entity = new CategoryEntity();
      entity.name = categoryName;
      return entity;
    });

    await repository.save(entities);
    console.log(`✅ Seeded ${entities.length} categories`);
  }
}
