import AgentService from "@app/services/agent/agent.service";
import { ErrorHandler, HttpResponse } from "@config/http";
import { NextFunction, Request, Response } from "express";

export default class AgentController {
  private service: AgentService;

  constructor() {
    this.service = new AgentService();
  }

  getAgents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const agents = await this.service.getAgents();

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
}
