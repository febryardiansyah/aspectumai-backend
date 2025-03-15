import { Router } from "express";

import AuthSignupController from "@app/controllers/authentication/signup.controller";
import { ValidationMiddleware } from "@global/middleware/validation.middleware";
import {
  AuthSignupEmailVerification,
  AuthSignupVerification,
} from "@app/validators/authentication.validator";

export default class AuthRouter {
  public router: Router;

  private signupController: AuthSignupController;

  constructor() {
    this.router = Router();
    this.signupController = new AuthSignupController();

    this.initialize();
  }

  private initialize(): void {
    this.router.post(
      "/sign-up/email-verification",
      ValidationMiddleware.validateBody(AuthSignupEmailVerification),
      this.signupController.emailVerification
    );

    // this.router.post("/sign-up/confirm-otp", this.signupController.signup);
    this.router.post(
      "/sign-up",
      ValidationMiddleware.validateBody(AuthSignupVerification),
      this.signupController.signup
    );

    // this.router.post("/sign-in", this.signupController.signin);

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
