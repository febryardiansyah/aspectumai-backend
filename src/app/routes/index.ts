import { Request, Response, Router } from "express";

import AuthController from "../controllers/authentication/signup.controller";
import AuthRouter from "./auth";

export default class AppRouter {
  public router: Router;

  public authRouter: AuthRouter;

  private authController: AuthController;

  constructor() {
    this.router = Router();

    this.authRouter = new AuthRouter();

    this.authController = new AuthController();

    this.initialize();
  }

  private initialize(): void {
    this.router.get("/health", (_req: Request, res: Response) =>
      res.send("Service OK!")
    );

    this.router.use("/v1/auth", this.authRouter.router);
  }
}
