import Database from "@config/database";
import AgentEntity from "@entities/Agent.entity";
import CategoryEntity from "@entities/Category.entity";
import { EntityManager, Repository } from "typeorm";

export default class AgentRepo extends Repository<AgentEntity> {
  constructor(manager?: EntityManager) {
    super(
      AgentEntity,
      manager || Database.getInstance().getDataSource().manager
    );
  }

  async createCategory(
    manager: EntityManager,
    category: CategoryEntity
  ): Promise<CategoryEntity> {
    return manager.save<CategoryEntity>(category);
  }

  async getCategories(manager: EntityManager): Promise<CategoryEntity[]> {
    return manager.find(CategoryEntity);
  }
}
