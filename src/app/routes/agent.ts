import AgentController from "@app/controllers/agent/agent.controller";
import { Router } from "express";

export default class AgentRouter {
  public router: Router;
  public agentController: AgentController;

  constructor() {
    this.router = Router();
    this.agentController = new AgentController();

    this.initialize();
  }

  private initialize(): void {
    this.router.get("/all", this.agentController.getAgents);

    this.router.post("/category/create", this.agentController.createCategory);
    this.router.get("/category/all", this.agentController.getCategories);
  }
}
