import { Request, Response, Router } from "express";

import AuthRouter from "./auth";
import AgentRouter from "./agent";
import ChatRouter from "./chat";
import TestRouter from "./test";

export default class AppRouter {
  public router: Router;

  public authRouter: AuthRouter;
  public agentRouter: AgentRouter;
  public chatRouter: ChatRouter;
  public testRouter: TestRouter;

  constructor() {
    this.router = Router();

    this.authRouter = new AuthRouter();
    this.agentRouter = new AgentRouter();
    this.chatRouter = new ChatRouter();
    this.testRouter = new TestRouter();

    this.initialize();
  }

  private initialize(): void {
    this.router.get("/health", (_req: Request, res: Response) =>
      res.send("Service OK!")
    );

    this.router.use("/v1/auth", this.authRouter.router);
    this.router.use("/v1/agent", this.agentRouter.router);
    this.router.use("/v1/chat", this.chatRouter.router);
    this.router.use("/v1/test", this.testRouter.router);
  }
}
