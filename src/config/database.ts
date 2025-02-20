import env from "@config/env";
import LoggerManager from "@utilities/logger";
import { DataSource, DataSourceOptions } from "typeorm";
import { Logger } from "winston";

export class Database {
  private static instance: Database;
  private dataSource: DataSource;
  private appLogger: Logger = LoggerManager.getInstance().get("app");

  private constructor() {
    const options = this.getConfig();
    this.dataSource = new DataSource(options);
  }

  public static getInstance(): Database {
    if (!Database.instance) Database.instance = new Database();

    return Database.instance;
  }

  private getConfig(): DataSourceOptions {
    const testMode = process.env.NODE_ENV === "test";

    const commonConfig: Partial<DataSourceOptions> = {
      type: "postgres",
      entities: ["src/database/entities/**/*.entity.{js,ts}"],
      migrations: ["src/database/migrations/**/*.{js,ts}"],
      logging: !testMode,
    };

    const configs: Record<string, Partial<DataSourceOptions>> = {
      default: {
        host: env.DB.HOST,
        port: Number(env.DB.PORT),
        username: env.DB.USER,
        password: env.DB.PASSWORD,
        database: env.DB.NAME,
      },
      test: {
        host: process.env.DB_TEST_HOST,
        port: Number(process.env.DB_TEST_PORT),
        username: process.env.DB_TEST_USER,
        password: process.env.DB_TEST_PASSWORD,
        database: process.env.DB_TEST_NAME,
        synchronize: true,
        dropSchema: true,
      },
    };

    const config = configs[testMode ? "test" : "default"];

    if (!config)
      throw new Error(`Database configuration for environment is not defined.`);

    return { ...commonConfig, ...config } as DataSourceOptions;
  }

  public async connect(): Promise<void> {
    if (!this.dataSource.isInitialized)
      try {
        await this.dataSource.initialize();
        this.appLogger.info("Database connected successfully!");
      } catch (error) {
        this.appLogger.error("Error during database connection:", error);
        throw error;
      }
  }

  public getDataSource(): DataSource {
    return this.dataSource;
  }

  public async disconnect(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      this.appLogger.info("Database disconnected.");
    }
  }
}

export default Database;
