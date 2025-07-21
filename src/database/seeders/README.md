# Database Seeders

This directory contains database seeders for the AspectumAI backend project. Seeders are used to populate the database with initial or test data.

## Available Seeders

### Core Seeders (Required)

1. **AIModel.seed.ts** - Seeds AI models (GPT-4, Claude, Gemini, etc.)
2. **Category.seed.ts** - Seeds agent categories (Productivity, Code Assistant, etc.)
3. **User.seed.ts** - Seeds initial users including admin and demo users
4. **Agent.seed.ts** - Seeds sample AI agents with different specializations

### Utility Seeders

5. **All.seed.ts** - Runs all core seeders in the correct dependency order
6. **Development.seed.ts** - Creates additional test data including sample chat sessions and messages

## Usage

### Run All Seeders
```bash
./forge seed
```

### Run Specific Seeder
```bash
./forge seed --file=AIModel
./forge seed --file=Category
./forge seed --file=User
./forge seed --file=Agent
./forge seed --file=All
./forge seed --file=Development
```

### Run Multiple Specific Seeders
```bash
./forge seed --file=AIModel,Category,User
```

## Seeder Dependencies

Some seeders depend on others and should be run in this order:

1. **AIModel** (no dependencies)
2. **Category** (no dependencies)  
3. **User** (no dependencies)
4. **Agent** (depends on AIModel and Category)
5. **Development** (depends on User and Agent)

The **All.seed.ts** seeder automatically handles this order for you.

## Default Data Created

### AI Models
- GPT-4 Turbo
- GPT-3.5 Turbo
- Claude 3 Opus/Sonnet/Haiku
- Gemini Pro
- Mistral Large
- Llama 3 70B

### Categories
- Productivity, Creative Writing, Code Assistant
- Customer Support, Education, Marketing
- Analysis, Translation, Research
- Entertainment, Business, Health & Fitness
- Travel, Finance, Legal, HR, Sales
- Data Science, Design, General

### Default Users
- Admin User (admin@aspectumai.com / admin123)
- John Doe (john.doe@example.com / password123)
- Jane Smith (jane.smith@example.com / password123) 
- Demo User (demo@aspectumai.com / demo123)

### Sample Agents
- **CodeMaster Pro** - Programming assistant
- **Creative Writer** - Writing and content creation
- **Data Analyst Pro** - Data analysis and statistics
- **Learning Tutor** - Educational support

## Environment Considerations

- In production, seeders will prompt for confirmation before running
- Seeders check for existing data and skip if already present
- All passwords are properly hashed using bcryptjs

## Adding New Seeders

1. Create a new `.seed.ts` file in this directory
2. Implement a class with a `run()` method
3. Export the class as default
4. Update the **All.seed.ts** if the new seeder should be included in the complete seeding process

### Example Seeder Template

```typescript
import AppDataSource from "../../config/datasource";
import YourEntity from "../entities/YourEntity.entity";

export default class YourSeeder {
  async run(): Promise<void> {
    const repository = AppDataSource.getRepository(YourEntity);

    // Check if data already exists
    const existingCount = await repository.count();
    if (existingCount > 0) {
      console.log("Your data already exists, skipping seeding...");
      return;
    }

    // Create your seed data
    const entities = [
      // ... your data
    ];

    await repository.save(entities);
    console.log(`✅ Seeded ${entities.length} records`);
  }
}
```

## Troubleshooting

- Ensure database connection is configured properly in `src/config/datasource.ts`
- Run migrations before seeding: `./forge migrate:run`
- Check that all required dependencies are installed
- Verify entity relationships are properly defined

## Security Notes

- Default passwords are for development only
- Change default credentials in production
- Sensitive seed data should use environment variables
- Review seed data before running in production environments
