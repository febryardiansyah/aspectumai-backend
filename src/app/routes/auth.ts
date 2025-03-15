import { Router } from "express";

import AuthController from "@app/controllers/authentication/auth.controller";
import { ValidationMiddleware } from "@global/middleware/validation.middleware";
import {
  AuthSignupEmailVerification,
  AuthSignupVerification,
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

    // this.router.post("/sign-up/confirm-otp", this.signupController.signup);
    this.router.post(
      "/sign-up",
      ValidationMiddleware.validateBody(AuthSignupVerification),
      this.authController.signup
    );

    this.router.post("/sign-in", this.authController.signin);

    // this.router.post(
    //   "/reset-password/email-verification",
    //   this.signupController.signup
    // );
    // this.router.post(
    //   "/reset-password/confirm-otp",
    //   this.signupController.signup
    // );
    // this.router.post("/reset-password", this.signupController.signup);
  }
}
