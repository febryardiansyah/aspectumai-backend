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
      const { email, type } = req.body;
      if (type !== "SIGNUP" && type !== "RESET_PASSWORD") {
        throw new ErrorHandler("Invalid Type", null, 400);
      }

      await this.service.verifyEmail(email, type);

      return HttpResponse.success(res, "OTP Sent Successfully!", null);
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

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, username, email, password } = req.body;

      await this.service.signup(
        name,

        username,
        email,
        password
      );

      return HttpResponse.success(
        res,
        "Sign Up Successfully! Check your email",
        null
      );
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

  verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;

      await this.service.verifyOTP(email, otp);

      return HttpResponse.success(res, "OTP Verified Successfully!", null);
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

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp, password } = req.body;

      await this.service.resetPassword(email, otp, password);

      return HttpResponse.success(res, "Password Reset Successfully!", null);
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
