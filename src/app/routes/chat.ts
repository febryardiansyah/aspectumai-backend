import ChatController from "@app/controllers/chat/chat.controller";
import { SendChatValidation } from "@app/validators/chat.validator";
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
    // Define your chat-related routes here
    // Example:
    this.router.post("/session/new", this.chatController.createChatSession);
    this.router.post(
      "/send",
      ValidationMiddleware.validateBody(SendChatValidation),
      this.chatController.sendMessage
    );
  }
}
