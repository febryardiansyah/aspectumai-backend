import { ErrorHandler } from "@config/http";
import rateLimit from "express-rate-limit";

const rateLimiterMiddleware = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: () => {
    throw new ErrorHandler(
      "Too many request, please try again after 10 minutes",
      null,
      429
    );
  },
});

export default rateLimiterMiddleware;
