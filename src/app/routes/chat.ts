import ChatController from "@app/controllers/chat/chat.controller";
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
    // this.router.get("/messages", this.getMessages);
    this.router.post("/send", this.chatController.sendMessage);
  }
}
