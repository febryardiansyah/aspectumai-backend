import { Request, Response, Router } from "express";

import AuthRouter from "./auth";
import AgentRouter from "./agent";
import ChatRouter from "./chat";

export default class AppRouter {
  public router: Router;

  public authRouter: AuthRouter;
  public agentRouter: AgentRouter;
  public chatRouter: ChatRouter;

  constructor() {
    this.router = Router();

    this.authRouter = new AuthRouter();
    this.agentRouter = new AgentRouter();
    this.chatRouter = new ChatRouter();

    this.initialize();
  }

  private initialize(): void {
    this.router.get("/health", (_req: Request, res: Response) =>
      res.send("Service OK!")
    );

    this.router.use("/v1/auth", this.authRouter.router);
    this.router.use("/v1/agent", this.agentRouter.router);
    this.router.use("/v1/chat", this.chatRouter.router);
  }
}
