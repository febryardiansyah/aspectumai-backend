import EmailService from '@app/services/email/email.service';
import { ErrorHandler, HttpResponse } from '@config/http';
import { NextFunction, Request, Response } from 'express';

export default class EmailTestController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  testConnection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const isConnected = await this.emailService.verifyConnection();
      
      return HttpResponse.success(
        res,
        isConnected ? 'Email service connected successfully' : 'Email service connection failed',
        { connected: isConnected }
      );
    } catch (err) {
      next(
        new ErrorHandler(
          typeof err === 'object' ? err.message : err,
          err.data,
          err.status
        )
      );
    }
  };

  sendTestEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        throw new ErrorHandler('Email is required', null, 400);
      }

      await this.emailService.sendOTPEmail(email, '123456', 'SIGNUP');
      
      return HttpResponse.success(
        res,
        'Test OTP email sent successfully',
        null
      );
    } catch (err) {
      next(
        new ErrorHandler(
          typeof err === 'object' ? err.message : err,
          err.data,
          err.status
        )
      );
    }
  };
}