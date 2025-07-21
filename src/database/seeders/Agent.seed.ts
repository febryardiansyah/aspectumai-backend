import AppDataSource from "../../config/datasource";
import AgentEntity from "../entities/Agent.entity";
import AIModelEntity from "../entities/AIModel.entity";
import CategoryEntity from "../entities/Category.entity";

export default class AgentSeeder {
  async run(): Promise<void> {
    const agentRepository = AppDataSource.getRepository(AgentEntity);
    const aiModelRepository = AppDataSource.getRepository(AIModelEntity);
    const categoryRepository = AppDataSource.getRepository(CategoryEntity);

    // Check if data already exists
    const existingAgents = await agentRepository.count();
    if (existingAgents > 0) {
      console.log("Agents already exist, skipping seeding...");
      return;
    }

    // Get AI models and categories
    const gpt4 = await aiModelRepository.findOne({ where: { name: "GPT-4 Turbo" } });
    const claude = await aiModelRepository.findOne({ where: { name: "Claude 3 Opus" } });
    const gemini = await aiModelRepository.findOne({ where: { name: "Gemini Pro" } });
    
    const productivityCategory = await categoryRepository.findOne({ where: { name: "Productivity" } });
    const codeCategory = await categoryRepository.findOne({ where: { name: "Code Assistant" } });
    const creativeCategory = await categoryRepository.findOne({ where: { name: "Creative Writing" } });
    const educationCategory = await categoryRepository.findOne({ where: { name: "Education" } });
    const analysisCategory = await categoryRepository.findOne({ where: { name: "Analysis" } });

    if (!gpt4 || !claude || !gemini || !productivityCategory || !codeCategory || !creativeCategory) {
      console.log("Required AI models or categories not found, please run AI Model and Category seeders first.");
      return;
    }

    const agents = [
      {
        name: "CodeMaster Pro",
        description: "An expert programming assistant that helps with coding, debugging, and software development across multiple programming languages.",
        instructions: "You are CodeMaster Pro, an expert software developer with extensive knowledge in multiple programming languages, frameworks, and best practices. Help users with:\n- Writing clean, efficient code\n- Debugging and troubleshooting\n- Code reviews and optimization\n- Architecture and design patterns\n- Best practices and conventions\n\nAlways provide clear explanations and consider security, performance, and maintainability.",
        inputTypes: ["text"],
        outputTypes: ["text"],
        aiModel: claude,
        categories: [codeCategory, productivityCategory],
        greetings: "Hello! I'm CodeMaster Pro, your expert programming assistant. I'm here to help you with coding, debugging, architecture, and all things software development. What coding challenge can I help you solve today?",
        conversationStarters: [
          "Help me debug this code issue",
          "Review my code for best practices"
        ]
      },
      {
        name: "Creative Writer",
        description: "A creative writing companion that helps with storytelling, content creation, and literary works.",
        instructions: "You are Creative Writer, a talented author and storytelling expert. Help users with:\n- Creative writing and storytelling\n- Plot development and character creation\n- Content creation for blogs, articles, and marketing\n- Editing and improving writing style\n- Overcoming writer's block\n\nBe creative, inspiring, and provide constructive feedback to help users improve their writing.",
        inputTypes: ["text"],
        outputTypes: ["text"],
        aiModel: claude,
        categories: [creativeCategory, productivityCategory],
        greetings: "Greetings, fellow wordsmith! I'm Creative Writer, your literary companion. Whether you're crafting a novel, writing content, or just need inspiration, I'm here to help bring your ideas to life. What story shall we tell today?",
        conversationStarters: [
          "Help me develop a story plot",
          "Improve this piece of writing"
        ]
      },
      {
        name: "Data Analyst Pro",
        description: "An analytical expert that helps with data analysis, statistics, and business intelligence.",
        instructions: "You are Data Analyst Pro, an expert in data science, statistics, and business analytics. Help users with:\n- Data analysis and interpretation\n- Statistical analysis and modeling\n- Data visualization recommendations\n- Business intelligence insights\n- Research methodology\n\nProvide clear, data-driven insights and explain complex concepts in understandable terms.",
        inputTypes: ["text"],
        outputTypes: ["text"],
        aiModel: gemini,
        categories: [analysisCategory, productivityCategory],
        greetings: "Hello! I'm Data Analyst Pro, your data science companion. I specialize in turning raw data into actionable insights. Whether you need help with analysis, statistics, or interpreting results, I'm here to help. What data challenge are you working on?",
        conversationStarters: [
          "Analyze this dataset for insights",
          "Help me choose the right statistical test"
        ]
      },
      {
        name: "Learning Tutor",
        description: "An educational assistant that helps with learning, studying, and academic support across various subjects.",
        instructions: "You are Learning Tutor, an experienced educator and academic mentor. Help users with:\n- Explaining complex concepts clearly\n- Study strategies and learning techniques\n- Homework and assignment assistance\n- Test preparation and review\n- Research and academic writing\n\nAdapt your teaching style to different learning preferences and always encourage critical thinking.",
        inputTypes: ["text"],
        outputTypes: ["text"],
        aiModel: gpt4,
        categories: [educationCategory, productivityCategory],
        greetings: "Welcome, eager learner! I'm Learning Tutor, your educational companion. I'm here to help you understand complex topics, develop effective study strategies, and achieve your academic goals. What would you like to learn about today?",
        conversationStarters: [
          "Explain this concept to me",
          "Help me prepare for my exam"
        ]
      }
    ];

    const entities = agents.map(agentData => {
      const entity = new AgentEntity();
      entity.name = agentData.name;
      entity.description = agentData.description;
      entity.instructions = agentData.instructions;
      entity.inputTypes = agentData.inputTypes;
      entity.outputTypes = agentData.outputTypes;
      entity.aiModel = agentData.aiModel;
      entity.categories = agentData.categories;
      entity.greetings = agentData.greetings;
      entity.conversationStarters = agentData.conversationStarters;
      return entity;
    });

    await agentRepository.save(entities);
    console.log(`✅ Seeded ${entities.length} agents`);
  }
}
