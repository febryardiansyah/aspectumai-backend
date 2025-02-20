import express, { Application } from "express";
import { Logger } from "winston";
import helmet from "helmet";
import cors from "cors";

import LoggerManager from "@utilities/logger";
import AppRouter from "@app/routes";

import "reflect-metadata";
import Database from "@config/database";
import { HTTPMiddleware } from "@global/middleware/http.middleware";
import rateLimiterMiddleware from "@global/middleware/ratelimiter.middleware";
import env from "@config/env";
import { RateLimitRequestHandler } from "express-rate-limit";
import momentTz from "moment-timezone";

class Server {
  private app: Application;
  private port: number;
  private appLogger: Logger = LoggerManager.getInstance().get("app");
  private appRouter: AppRouter;
  private httpMiddleware: HTTPMiddleware;
  private limiterMiddleware: RateLimitRequestHandler;

  constructor() {
    this.app = express();
    this.port = env.SERVER_PORT || 5050;
    this.appRouter = new AppRouter();
    this.httpMiddleware = new HTTPMiddleware();
    this.limiterMiddleware = rateLimiterMiddleware;

    try {
      this.initMiddleware();
      this.initRoutes();
      this.initDatabase();
    } catch (error) {
      process.exit(1);
    }
  }

  public start(): void {
    momentTz.tz.setDefault("Asia/Jakarta");

    this.app.listen(this.port, () => {
      console.clear();
      this.appLogger.info(
        `Server Running at http://localhost:${this.port}/ or http://127.0.0.1:${this.port}/`
      );
    });
  }

  private initMiddleware() {
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: "*",
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(this.limiterMiddleware);
  }

  private initRoutes(): void {
    this.app.use(this.httpMiddleware.requestHandler);
    this.app.use("/api", this.appRouter.router);
    this.app.use(this.httpMiddleware.errorHandler);
  }

  private async initDatabase(): Promise<void> {
    const db = Database.getInstance();

    try {
      await db.connect();
      this.appLogger.info("Database initialization successfully");
    } catch (error) {
      this.appLogger.error("Database initialization failed:", error);
    }
  }
}

const server = new Server();
server.start();
