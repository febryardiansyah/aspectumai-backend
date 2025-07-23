import * as nodemailer from 'nodemailer';
import { ErrorHandler } from '@config/http';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export default class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new ErrorHandler('Failed to send email', null, 500);
    }
  }

  async sendOTPEmail(email: string, otp: string, type: 'SIGNUP' | 'RESET_PASSWORD' | 'CHANGE_EMAIL'): Promise<void> {
    const subject = type === 'SIGNUP' 
      ? 'Email Verification - OTP Code' 
      : type === 'RESET_PASSWORD' 
        ? 'Password Reset - OTP Code'
        : 'Email Change Verification - OTP Code';
    
    const message = type === 'SIGNUP' 
      ? 'Please use the following OTP code to verify your email address:'
      : type === 'RESET_PASSWORD'
        ? 'Please use the following OTP code to reset your password:'
        : 'Please use the following OTP code to verify your new email address:';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            padding: 30px;
            border-radius: 10px;
            border: 1px solid #ddd;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .otp-code {
            background-color: #007bff;
            color: white;
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            padding: 20px;
            border-radius: 8px;
            letter-spacing: 5px;
            margin: 20px 0;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>AspectumAI</h1>
            <h2>${subject}</h2>
          </div>
          
          <p>Hello,</p>
          <p>${message}</p>
          
          <div class="otp-code">
            ${otp}
          </div>
          
          <div class="warning">
            <strong>Important:</strong>
            <ul>
              <li>This OTP code will expire in 10 minutes</li>
              <li>Do not share this code with anyone</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; 2024 AspectumAI. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      ${subject}
      
      Hello,
      
      ${message}
      
      Your OTP Code: ${otp}
      
      Important:
      - This OTP code will expire in 10 minutes
      - Do not share this code with anyone
      - If you didn't request this, please ignore this email
      
      This is an automated message, please do not reply to this email.
      
      © 2024 AspectumAI. All rights reserved.
    `;

    await this.sendEmail({
      to: email,
      subject,
      text,
      html,
    });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}