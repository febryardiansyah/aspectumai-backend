import ChatService from "@app/services/chat/chat.service";
import { ErrorHandler, HttpResponse } from "@config/http";
import { NextFunction, Request, Response } from "express";

export default class ChatController {
  private service: ChatService;

  constructor() {
    this.service = new ChatService();
  }

  sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message } = req.body;
      await this.service.sendMessage(message, req, res);

      //   return HttpResponse.success(res, "Message sent successfully", response);
    } catch (err) {
      console.error("Error in sendMessage:", err);
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
