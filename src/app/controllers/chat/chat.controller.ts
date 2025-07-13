import ChatService from "@app/services/chat/chat.service";
import { TSendChatBody } from "@app/types/chat";
import { ErrorHandler, HttpResponse } from "@config/http";
import ChatSessionEntity from "@entities/ChatSession.entity";
import { NextFunction, Request, Response } from "express";

export default class ChatController {
  private service: ChatService;

  constructor() {
    this.service = new ChatService();
  }

  createChatSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const chatSession = new ChatSessionEntity();
      chatSession.name = req.body.name || Date.now().toString();
      chatSession.messages = [];

      await this.service.createChatSession(chatSession);

      return HttpResponse.success(
        res,
        "Chat session created successfully",
        chatSession
      );
    } catch (err) {
      console.error("Error in createChatSession:", err);
      next(
        new ErrorHandler(
          typeof err === "object" ? err.message : err,
          err.data,
          err.status
        )
      );
    }
  };

  sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId, messages, model } = req.body;
      const body: TSendChatBody = {
        sessionId,
        messages,
        model: model,
      };
      const response = await this.service.sendMessage(req, res, body);

      return HttpResponse.success(res, "Message sent successfully", response);
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
