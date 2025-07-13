import ChatController from "@app/controllers/chat/chat.controller";
import {
  ChatValidationParamsId,
  SendChatValidation,
} from "@app/validators/chat.validator";
import { AuthMiddleware } from "@global/middleware/auth.middleware";
import { ValidationMiddleware } from "@global/middleware/validation.middleware";
import { Router } from "express";

export default class ChatRouter {
  public router: Router;
  public chatController: ChatController;

  constructor() {
    this.router = Router();
    this.chatController = new ChatController();
    this.initialize();
  }

  private initialize(): void {
    /// sessions
    this.router.post(
      "/session/new",
      AuthMiddleware.tokenRequired,
      this.chatController.createChatSession
    );
    this.router.get(
      "/session/all",
      AuthMiddleware.tokenRequired,
      this.chatController.getChatSessions
    );
    this.router.get(
      "/session/:id/messages",
      AuthMiddleware.tokenRequired,
      ValidationMiddleware.validateParamsId(ChatValidationParamsId),
      this.chatController.getSessionMessages
    );

    /// chat
    this.router.post(
      "/message/send",
      ValidationMiddleware.validateBody(SendChatValidation),
      this.chatController.sendMessage
    );
  }
}
