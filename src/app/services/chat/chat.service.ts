import OpenRouterClient from "@app/http_clients/openRouter.client";
import ChatRepo from "@app/repositories/chat.repo";
import { TChatMessage, TSendChatBody } from "@app/types/chat";
import AppDataSource from "@config/datasource";
import env from "@config/env";
import ChatMessageEntity from "@entities/ChatMessage.entity";
import ChatSessionEntity from "@entities/ChatSession.entity";
import axios from "axios";
import { Request, Response } from "express";
import { Readable } from "stream";
import { DataSource } from "typeorm";

export default class ChatService {
  constructor(
    private readonly dataSource: DataSource = AppDataSource,
    private readonly chatRepo: ChatRepo = new ChatRepo(),
    private readonly openRouterClient = new OpenRouterClient()
  ) {}

  async createChatSession(chatSession: ChatSessionEntity): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.dataSource.manager.transaction(async manager => {
        await this.chatRepo.createSession(manager, chatSession);
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getChatSessions(userId: number): Promise<ChatSessionEntity[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const sessions = await this.dataSource.manager.transaction(
        async manager => {
          const sessions = await this.chatRepo.getAllSessions(manager, userId);
          return sessions;
        }
      );

      await queryRunner.commitTransaction();
      return sessions;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async sendMessage(
    req: Request,
    res: Response,
    body: TSendChatBody
  ): Promise<TChatMessage> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const session = await this.dataSource.manager.transaction(
        async manager => {
          const session = await this.chatRepo.findSessionById(
            manager,
            Number(body.sessionId)
          );
          return session;
        }
      );

      if (!session) {
        throw new Error("Chat session not found");
      }

      // set title session based on user message
      // and save the last user message to the database
      await this.dataSource.manager.transaction(async manager => {
        if (body.messages.length === 1) {
          const sessionName = await this.createSessionTitle(
            body.messages[0].content
          );

          session.name = sessionName;
          await this.chatRepo.updateSession(manager, session);
        }

        const chatMessage = new ChatMessageEntity();
        const lastMessage = body.messages[body.messages.length - 1];
        chatMessage.content = lastMessage.content;
        chatMessage.isUserMessage = lastMessage.role === "user";
        chatMessage.chatSession = session;
        await this.chatRepo.saveChat(manager, chatMessage);
      });

      // send the message to the AI model
      const response = await this.openRouterClient.post(body, {
        // responseType: "stream",
      });
      const responseMessage: TChatMessage = response.data.choices[0].message;

      // and save the response message from AI
      await this.dataSource.manager.transaction(async manager => {
        const chatMessage = new ChatMessageEntity();
        chatMessage.content = responseMessage.content;
        chatMessage.isUserMessage = false;
        chatMessage.chatSession = session;

        await this.chatRepo.saveChat(manager, chatMessage);
      });

      await queryRunner.commitTransaction();
      return responseMessage;

      // const stream = response.data as Readable;
      // let buffer = "";

      // stream.on("data", (chunk: Buffer) => {
      //   buffer += chunk.toString();
      //   const lines = buffer.split("\n");

      //   // Keep the last incomplete line in buffer
      //   buffer = lines.pop() || "";

      //   for (const line of lines) {
      //     if (line.startsWith("data: ")) {
      //       const jsonStr = line.slice(6).trim();

      //       if (jsonStr === "[DONE]") {
      //         res.write("data: [DONE]\n\n");
      //         res.end();
      //         return;
      //       }

      //       try {
      //         const parsed = JSON.parse(jsonStr);
      //         const content = parsed.choices?.[0]?.delta?.content;

      //         if (content) {
      //           // Send the chunk to client
      //           res.write(`data: ${JSON.stringify({ content })}\n\n`);
      //         }
      //       } catch (parseError) {
      //         // Skip malformed JSON
      //       }
      //     }
      //   }
      // });

      // stream.on("end", () => {
      //   res.write("data: [DONE]\n\n");
      //   res.end();
      // });

      // stream.on("error", (error: Error) => {
      //   res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      //   res.end();
      // });

      // // Handle client disconnect
      // req.on("close", () => {
      //   stream.destroy();
      // });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getSessionMessages(
    sessionId: number
  ): Promise<ChatMessageEntity[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const messages = await this.dataSource.manager.transaction(
        async manager => {
          return this.chatRepo.getSessionMessagesById(manager, sessionId);
        }
      );

      await queryRunner.commitTransaction();
      return messages;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
