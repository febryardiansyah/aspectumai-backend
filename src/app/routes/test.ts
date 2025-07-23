import { Router } from 'express';
import EmailTestController from '@app/controllers/test/email-test.controller';

export default class TestRouter {
  public router: Router;
  private emailTestController: EmailTestController;

  constructor() {
    this.router = Router();
    this.emailTestController = new EmailTestController();
    this.initialize();
  }

  private initialize(): void {
    // Email service test routes
    this.router.get('/email/connection', this.emailTestController.testConnection);
    this.router.post('/email/send-test', this.emailTestController.sendTestEmail);
  }
}