import OpenRouterClient from "@app/http_clients/openRouter.client";
import ChatRepo from "@app/repositories/chat.repo";
import { TChatMessage, TSendChatBody } from "@app/types/chat";
import AppDataSource from "@config/datasource";
import ChatMessageEntity from "@entities/ChatMessage.entity";
import ChatSessionEntity from "@entities/ChatSession.entity";
import { PaginationResult } from "@utilities/pagination";
import { Request, Response } from "express";
import { DataSource } from "typeorm";

export default class ChatService {
  constructor(
    private readonly dataSource: DataSource = AppDataSource,
    private readonly chatRepo: ChatRepo = new ChatRepo(),
    private readonly openRouterClient = new OpenRouterClient()
  ) {}

  async createChatSession(chatSession: ChatSessionEntity): Promise<void> {
    await this.chatRepo.createSession(chatSession);
  }

  async getChatSessions(
    userId: number,
    limit: number,
    page: number
  ): Promise<PaginationResult<ChatSessionEntity>> {
    const sessions = await this.chatRepo.getAllSessions(userId, limit, page);
    return {
      current_page: page,
      total_page: Math.ceil(sessions[1] / limit),
      total_records: sessions[1],
      records: sessions[0]
    };
  }

  async sendMessage(
    req: Request,
    res: Response,
    body: TSendChatBody,
    userId: number
  ): Promise<TChatMessage> {
    return await this.dataSource.manager.transaction(async manager => {
      // Find session
      const session = await this.chatRepo.findSessionById(
        manager,
        Number(body.sessionId)
      );

      if (!session) {
        throw new Error("Chat session not found");
      }

      if (session.user.id !== userId) {
        throw new Error("Unauthorized access to chat session");
      }

      // Update session title if it's the first message
      if (body.messages.length === 1) {
        const sessionName = await this.createSessionTitle(
          body.messages[0].content
        );
        session.name = sessionName;
        await this.chatRepo.updateSession(manager, session);
      }

      // Save user message
      const userMessage = new ChatMessageEntity();
      const lastMessage = body.messages[body.messages.length - 1];
      userMessage.content = lastMessage.content;
      userMessage.isUserMessage = lastMessage.role === "user";
      userMessage.chatSession = session;
      await this.chatRepo.saveChat(manager, userMessage);

      // Send message to AI (outside transaction since it's external call)
      const response = await this.openRouterClient.post(body);
      const responseMessage: TChatMessage = response.data.choices[0].message;

      // Save AI response
      const aiMessage = new ChatMessageEntity();
      aiMessage.content = responseMessage.content;
      aiMessage.isUserMessage = false;
      aiMessage.chatSession = session;
      await this.chatRepo.saveChat(manager, aiMessage);

      return responseMessage;
    });
  }

  async getSessionMessages(
    sessionId: number,
    limit: number,
    page: number
  ): Promise<PaginationResult<ChatMessageEntity>> {
    try {
      const chatMessages = await this.dataSource.manager.transaction(
        async manager => {
          const session = await this.chatRepo.findSessionById(
            manager,
            sessionId
          );
          if (!session) {
            throw new Error("Chat session not found");
          }
          const chatMessages = await this.chatRepo.getSessionMessagesById(
            manager,
            sessionId,
            limit,
            page
          );
          
          return {
            total_records: chatMessages[1],
            records: chatMessages[0],
          };
        }
      );
      return {
        current_page: page,
        total_page: Math.ceil(chatMessages.total_records / limit),
        total_records: chatMessages.total_records,
        records: chatMessages.records,
      };
    } catch (error) {
      throw error;
    }
  }

  async removeSessionById(id: number): Promise<void> {
    await this.dataSource.manager.transaction(async manager => {
      await this.chatRepo.removeSessionById(manager, id);
    });
  }

  private async createSessionTitle(message: string): Promise<string> {
    try {
      const prompt = `Create a title for a chat session based on the following message: "${message}". Return only the title text without quotation marks or additional formatting.`;
      const response = await this.openRouterClient.post({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const data = response.data;
      return data.choices[0].message.content.trim();
    } catch (error) {
      return "Default Session";
    }
  }
}
