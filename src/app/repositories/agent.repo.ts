import Database from "@config/database";
import AgentEntity from "@entities/Agent.entity";
import AIModelEntity from "@entities/AIModel.entity";
import CategoryEntity from "@entities/Category.entity";
import { EntityManager, Repository, In, ILike, Like } from "typeorm";

export default class AgentRepo extends Repository<AgentEntity> {
  constructor(manager?: EntityManager) {
    super(
      AgentEntity,
      manager || Database.getInstance().getDataSource().manager
    );
  }
  // agent
  async createAgent(
    manager: EntityManager,
    agent: AgentEntity
  ): Promise<AgentEntity> {
    return this.save<AgentEntity>(agent);
  }

  async getAgents(
    manager: EntityManager,
    keywords: string,
    limit: number,
    page: number
  ) {
    // const agent = await manager
    //   .createQueryBuilder(AgentEntity, "agent")
    //   .leftJoinAndSelect("agent.categories", "category")
    //   .where("agent.name ILIKE :keyword", { keyword: `%${keywords}%` })
    //   .orWhere("agent.description ILIKE :keyword", { keyword: `%${keywords}%` })
    //   .orWhere("category.name ILIKE :keyword", { keyword: `%${keywords}%` })
    //   .getMany();

    return manager.findAndCount(AgentEntity, {
      relations: {
        aiModel: true,
        categories: true,
      },
      order: {
        created_at: "DESC",
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getAgentById(manager: EntityManager, id: number): Promise<AgentEntity> {
    return manager.findOne(AgentEntity, {
      where: { id },
      relations: {
        aiModel: true,
        categories: true,
      },
    });
  }

  // category
  async createCategory(
    manager: EntityManager,
    category: CategoryEntity
  ): Promise<CategoryEntity> {
    return manager.save<CategoryEntity>(category);
  }

  async getCategories(manager: EntityManager): Promise<CategoryEntity[]> {
    return manager.find(CategoryEntity);
  }

  async findCategoriesByMultipleId(
    manager: EntityManager,
    ids: number[]
  ): Promise<CategoryEntity[]> {
    return manager.findBy(CategoryEntity, { id: In(ids) });
  }

  // ai model
  async createAIModel(
    manager: EntityManager,
    aiModel: AIModelEntity
  ): Promise<AIModelEntity> {
    return manager.save<AIModelEntity>(aiModel);
  }

  async findAIModelById(
    manager: EntityManager,
    id: number
  ): Promise<AIModelEntity> {
    return manager.findOne<AIModelEntity>(AIModelEntity, {
      where: { id },
    });
  }
}
