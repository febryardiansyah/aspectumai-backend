import {
  Logger,
  LoggerOptions,
  createLogger,
  format,
  transports,
} from "winston";
import Datetime from "./datetime";

interface IMeta {
  url?: string;
  from_ip?: string;
}

export default class LoggerManager {
  private static instance: LoggerManager;
  private loggers: Map<string, Logger> = new Map();

  constructor() {}

  public static getInstance(): LoggerManager {
    if (!LoggerManager.instance) LoggerManager.instance = new LoggerManager();

    return LoggerManager.instance;
  }

  private winstonFormat = format.printf(({ level, message, meta }) => {
    const timestamp = Datetime.log();
    const formattedMessage = `${timestamp} [${level}]: `;
    const metaTyped = meta as IMeta;

    if (meta) {
      if (metaTyped.url) message = `[${message}] ${metaTyped.url}`;
      if (metaTyped.from_ip) message = `${metaTyped.from_ip} | ${message}`;
    }

    return formattedMessage + message;
  });

  private winstonConfig: LoggerOptions = {
    format: format.combine(format.colorize({ all: true }), this.winstonFormat),
  };

  public create(name: string, level: string = "info"): Logger {
    if (this.loggers.has(name)) return this.loggers.get(name)!;

    const logger = createLogger({
      level,
      transports: [
        ...(1
          ? [
              new transports.File({
                dirname: "logs",
                filename: `${name}.log`,
                level,
                format: format.combine(format.uncolorize()),
              }),
            ]
          : []),
        new transports.Console(),
      ],
      format: this.winstonConfig.format,
    });

    this.loggers.set(name, logger);
    return logger;
  }

  public get(name: string): Logger {
    return this.loggers.get(name) || this.create(name);
  }
}
