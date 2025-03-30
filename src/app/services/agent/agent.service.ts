import AgentRepo from "@app/repositories/agent.repo";
import AppDataSource from "@config/datasource";
import AgentEntity from "@entities/Agent.entity";
import AIModelEntity from "@entities/AIModel.entity";
import CategoryEntity from "@entities/Category.entity";
import { PaginationData, PaginationResult } from "@utilities/pagination";
import { DataSource } from "typeorm";

export default class AgentService {
  constructor(
    private readonly dataSource: DataSource = AppDataSource,
    private readonly agentRepository: AgentRepo = new AgentRepo()
  ) {}

  async createAgent(agent: AgentEntity): Promise<AgentEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newAgent = await this.dataSource.manager.transaction(
        async manager => {
          /// assign the agent to the correct AI model
          const selectedAIModel = await this.agentRepository.findAIModelById(
            manager,
            agent.aiModel.id
          );
          agent.aiModel = selectedAIModel;

          /// assign the agent to the correct categories
          /// this is a many to many relationship, so we need to find the categories by their ids
          /// and assign them to the agent
          const categories =
            await this.agentRepository.findCategoriesByMultipleId(
              manager,
              agent.categories.map(e => e.id)
            );
          agent.categories = categories;

          return this.agentRepository.createAgent(manager, agent);
        }
      );

      await queryRunner.commitTransaction();
      return newAgent;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAgents(
    keywords: string,
    limit: number,
    page: number
  ): Promise<PaginationResult<AgentEntity>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const agents = await this.dataSource.manager.transaction(
        async manager => {
          const agents = await this.agentRepository.getAgents(
            manager,
            keywords,
            limit,
            page
          );
          
          return {
            total_records: agents[1],
            records: agents[0],
          };
        }
      );

      await queryRunner.commitTransaction();
      return {
        current_page: page,
        total_page: Math.ceil(agents.total_records / limit),
        total_records: agents.total_records,
        records: agents.records,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAgentById(id: number): Promise<AgentEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const agent = await this.dataSource.manager.transaction(async manager => {
        return this.agentRepository.getAgentById(manager, id);
      });

      await queryRunner.commitTransaction();
      return agent;
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
    console.log("getCategories getting called?");

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

  async createAIModel(name: string, apiUrl: string): Promise<AIModelEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newAIModel = await this.dataSource.manager.transaction(
        async manager => {
          const newAIModel = new AIModelEntity();
          newAIModel.name = name;
          newAIModel.apiUrl = apiUrl;

          return this.agentRepository.createAIModel(manager, newAIModel);
        }
      );

      await queryRunner.commitTransaction();
      return newAIModel;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
