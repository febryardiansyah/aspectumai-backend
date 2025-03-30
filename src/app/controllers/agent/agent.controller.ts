import AgentService from "@app/services/agent/agent.service";
import { ErrorHandler, HttpResponse } from "@config/http";
import AgentEntity from "@entities/Agent.entity";
import AIModelEntity from "@entities/AIModel.entity";
import CategoryEntity from "@entities/Category.entity";
import PaginationUtils from "@utilities/pagination";
import { NextFunction, Request, Response } from "express";

export default class AgentController {
  private service: AgentService;

  constructor() {
    this.service = new AgentService();
  }

  createAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        description,
        instructions,
        avatar,
        banner,
        inputTypes,
        outputTypes,
        aiModelId,
        categoryIds,
        greetings,
        conversationStarters,
        tokenPrice,
      } = req.body;

      const agent = new AgentEntity();
      agent.name = name;
      agent.description = description;
      agent.instructions = instructions;
      agent.avatar = avatar;
      agent.banner = banner;
      agent.inputTypes = inputTypes;
      agent.outputTypes = outputTypes;
      agent.aiModel = new AIModelEntity();
      agent.aiModel.id = aiModelId;
      agent.greetings = greetings;
      agent.conversationStarters = conversationStarters;
      agent.tokenPrice = tokenPrice;
      const categories: CategoryEntity[] = categoryIds.map((id: number) => {
        const category = new CategoryEntity();
        category.id = id;
        return category;
      });

      agent.categories = categories;

      const newAgent = await this.service.createAgent(agent);

      return HttpResponse.success(res, "Agent created successfully", newAgent);
    } catch (err) {
      console.log("err", err);

      next(
        new ErrorHandler(
          typeof err === "object" ? err.message : err,
          err.data,
          err.status
        )
      );
    }
  };

  getAgents = async (req: Request, res: Response, next: NextFunction) => {
    const { keywords, limit, page } = req.query;
    const _page = Number(page) || 1;
    const _limit = Number(limit) || 10;
    // const offset = (_page - 1) * _limit;
    const _keywords = (keywords as string)?.trim();

    try {
      const agents = await this.service.getAgents(_keywords, _limit, _page);
      // const data = PaginationUtils.pagination(
      //   agents,
      //   _page,
      //   _limit
      // );

      return HttpResponse.success(res, "Agents fetched successfully", agents);
    } catch (err) {
      next(
        new ErrorHandler(
          typeof err === "object" ? err.message : err,
          err.data,
          err.status
        )
      );
    }
  };

  getAgentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const agent = await this.service.getAgentById(Number(id));

      if (!agent) {
        return HttpResponse.error(res, "Agent not found", {}, 404);
      }

      return HttpResponse.success(res, "Agent fetched successfully", agent);
    } catch (err) {
      next(
        new ErrorHandler(
          typeof err === "object" ? err.message : err,
          err.data,
          err.status
        )
      );
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category } = req.body;

      const newCategory = await this.service.createCategory(category);

      return HttpResponse.success(
        res,
        "Category created successfully",
        newCategory
      );
    } catch (err) {
      next(
        new ErrorHandler(
          typeof err === "object" ? err.message : err,
          err.data,
          err.status
        )
      );
    }
  };

  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.service.getCategories();

      return HttpResponse.success(
        res,
        "Categories fetched successfully",
        categories
      );
    } catch (err) {
      next(
        new ErrorHandler(
          typeof err === "object" ? err.message : err,
          err.data,
          err.status
        )
      );
    }
  };

  createAIModel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, apiUrl } = req.body;

      const newAIModel = await this.service.createAIModel(name, apiUrl);

      return HttpResponse.success(
        res,
        "AI Model created successfully",
        newAIModel
      );
    } catch (err) {
      next(
        new ErrorHandler(
          typeof err === "object" ? err.message : err,
          err.data,
          err.status
        )
      );
    }
  };
}
