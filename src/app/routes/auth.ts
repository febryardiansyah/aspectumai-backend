import { Router } from "express";

import AuthController from "@app/controllers/authentication/auth.controller";
import { ValidationMiddleware } from "@global/middleware/validation.middleware";
import {
  AuthResetPasswordVerification,
  AuthSigninVerification,
  AuthSignupEmailVerification,
  AuthSignupVerification,
  AuthVerifyOTPVerification,
} from "@app/validators/authentication.validator";

export default class AuthRouter {
  public router: Router;

  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();

    this.initialize();
  }

  private initialize(): void {
    this.router.post(
      "/sign-up/email-verification",
      ValidationMiddleware.validateBody(AuthSignupEmailVerification),
      this.authController.emailVerification
    );

    this.router.post(
      "/sign-up",
      ValidationMiddleware.validateBody(AuthSignupVerification),
      this.authController.signup
    );

    this.router.post(
      "/sign-in",
      ValidationMiddleware.validateBody(AuthSigninVerification),
      this.authController.signin
    );

    this.router.post(
      "/verify-otp",
      ValidationMiddleware.validateBody(AuthVerifyOTPVerification),
      this.authController.verifyOTP
    );

    this.router.post(
      "/reset-password",
      ValidationMiddleware.validateBody(AuthResetPasswordVerification),
      this.authController.resetPassword
    );
  }
}
