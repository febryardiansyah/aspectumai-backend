import { Database } from "@config/database";
import ChatMessageEntity from "@entities/ChatMessage.entity";
import ChatSessionEntity from "@entities/ChatSession.entity";
import { EntityManager, Repository } from "typeorm";

export default class ChatRepo extends Repository<ChatSessionEntity> {
  constructor(manager?: EntityManager) {
    super(
      ChatSessionEntity,
      manager || Database.getInstance().getDataSource().manager
    );
  }

  async findSessionById(
    manager: EntityManager,
    id: number
  ): Promise<ChatSessionEntity | null> {
    return manager.findOne(ChatSessionEntity, {
      where: { id },
      relations: {
        messages: true,
      },
    });
  }

  async createSession(
    manager: EntityManager,
    session: ChatSessionEntity
  ): Promise<ChatSessionEntity> {
    return manager.save<ChatSessionEntity>(session);
  }

  async updateSession(
    manager: EntityManager,
    session: ChatSessionEntity
  ): Promise<void> {
    await manager.update(
      ChatSessionEntity,
      { id: session.id },
      {
        name: session.name,
      }
    );
  }

  async getAllSessions(
    manager: EntityManager,
    userId: number
  ): Promise<ChatSessionEntity[]> {
    return manager.find(ChatSessionEntity, {
      where: { user: { id: userId } },
      // relations: { messages: true, user: true },
      order: {
        created_at: "DESC",
      },
    });
  }

  async saveChat(
    manager: EntityManager,
    message: ChatMessageEntity
  ): Promise<void> {
    manager.save<ChatMessageEntity>(message);
  }

  async getSessionMessagesById(
    manager: EntityManager,
    sessionId: number
  ): Promise<ChatMessageEntity[]> {
    return manager.find(ChatMessageEntity, {
      where: { chatSession: { id: sessionId } },
      order: {
        created_at: "ASC",
      },
    });
  }
}
