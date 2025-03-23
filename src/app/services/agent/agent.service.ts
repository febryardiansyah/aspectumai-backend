import AgentRepo from "@app/repositories/agent.repo";
import AppDataSource from "@config/datasource";
import AgentEntity from "@entities/Agent.entity";
import CategoryEntity from "@entities/Category.entity";
import { DataSource } from "typeorm";

export default class AgentService {
  constructor(
    private readonly dataSource: DataSource = AppDataSource,
    private readonly agentRepository: AgentRepo = new AgentRepo()
  ) {}

  async getAgents(): Promise<AgentEntity[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const agents = await this.dataSource.manager.transaction(
        async manager => {
          return manager.find(AgentEntity);
        }
      );

      await queryRunner.commitTransaction();
      return agents;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createCategory(category: string): Promise<CategoryEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newCategory = await this.dataSource.manager.transaction(
        async manager => {
          let categoryEntity = new CategoryEntity();
          categoryEntity.name = category;

          return this.agentRepository.createCategory(manager, categoryEntity);
        }
      );

      await queryRunner.commitTransaction();
      return newCategory;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getCategories(): Promise<CategoryEntity[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log('getCategories getting called?');
    
    try {
      const categories = await this.dataSource.manager.transaction(
        async manager => {
          return this.agentRepository.getCategories(manager);
        }
      );

      await queryRunner.commitTransaction();
      return categories;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
