import ChatService from "@app/services/chat/chat.service";
import { TSendChatBody } from "@app/types/chat";
import { ErrorHandler, HttpResponse } from "@config/http";
import ChatSessionEntity from "@entities/ChatSession.entity";
import UserEntity from "@entities/User.entity";
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
      chatSession.user = req["user"] as UserEntity;

      await this.service.createChatSession(chatSession);
      chatSession.user.password = undefined;

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

  getChatSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req["user"] as UserEntity;
      const sessions = await this.service.getChatSessions(user.id);

      return HttpResponse.success(
        res,
        "Chat sessions fetched successfully",
        sessions
      );
    } catch (err) {
      console.error("Error in getChatSessions:", err);
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

  getSessionMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const messages = await this.service.getSessionMessages(Number(id));

      return HttpResponse.success(
        res,
        "Session messages fetched successfully",
        messages
      );
    } catch (err) {
      console.error("Error in getSessionMessages:", err);
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
