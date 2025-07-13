import AppDataSource from "@config/datasource";
import { HttpResponse } from "@config/http";
import UserEntity from "@entities/User.entity";
import TokenUtils from "@utilities/token";
import { Request, Response, NextFunction } from "express";

export class AuthMiddleware {
  static async tokenRequired(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.error(res, "Login Required", {
        message: "You must login to access this feature",
      });
    }

    const token = authHeader.split(" ")[1];
    const verifyToken = TokenUtils.verifyToken(token);

    if (!token || !verifyToken) {
      return HttpResponse.error(res, "Invalid token", {
        message: "You must login to access this feature",
      });
    }

    try {
      const userRepo = AppDataSource.getRepository(UserEntity);
      const user = await userRepo.findOne({
        where: { email: verifyToken["email"] },
      });

      if (!user) {
        return HttpResponse.error(res, "User not found", {
          message: "You must login to access this feature",
        });
      }

      req["user"] = user;
      next();
    } catch (error) {
      console.error("Error in auth middleware:", error);
      return HttpResponse.error(res, "Unauthorized", {
        message: "You must login to access this feature",
      });
    }
  }
}
