import AuthService from "@app/services/authentication/auth.service";
import { ErrorHandler, HttpResponse } from "@config/http";
import { NextFunction, Request, Response } from "express";

export default class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
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
      const { name, username, email, password } = req.body;

      await this.service.signup(
        name,
        
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

  signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await this.service.signin(email, password);

      const token = await this.service.generateToken(email);

      user.password = undefined;

      return HttpResponse.success(res, "Sign In Successfully!", {
        token,
        ...user,
      });
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
}
