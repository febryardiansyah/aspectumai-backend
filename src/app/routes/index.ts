import { Request, Response, Router } from "express";

import AuthRouter from "./auth";
import AgentRouter from "./agent";

export default class AppRouter {
  public router: Router;

  public authRouter: AuthRouter;
  public agentRouter: AgentRouter;

  constructor() {
    this.router = Router();

    this.authRouter = new AuthRouter();
    this.agentRouter = new AgentRouter();

    this.initialize();
  }

  private initialize(): void {
    this.router.get("/health", (_req: Request, res: Response) =>
      res.send("Service OK!")
    );

    this.router.use("/v1/auth", this.authRouter.router);
    this.router.use("/v1/agent", this.agentRouter.router);
  }
}
