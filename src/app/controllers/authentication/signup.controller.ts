import AuthSignupService from "@app/services/authentication/signup.service";
import { ErrorHandler, HttpResponse } from "@config/http";
import { NextFunction, Request, Response } from "express";

export default class AuthSignupController {
  private service: AuthSignupService;

  constructor() {
    this.service = new AuthSignupService();
  }

  emailVerification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;

      await this.service.verifyEmail(email);

      return HttpResponse.success(res, "OTP Sent Successfully!", null);
    } catch (err) {
      next(new ErrorHandler(err.message, err.data, err.status));
    }
  };

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { first_name, last_name, username, email, password } = req.body;

      await this.service.signup(
        first_name,
        last_name,
        username,
        email,
        password
      );

      return HttpResponse.success(res, "Sign Up Successfully!", null);
    } catch (err) {
      next(
        new ErrorHandler(
          typeof err === "object" ? err.message : err,
          err.data,
          err.status
        )
      );
    }
  };

  signin = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      return HttpResponse.success(res, "Sign In Successfully!", null);
    } catch (err) {
      next(new ErrorHandler(err.message, err.data, err.status));
    }
  };
}
