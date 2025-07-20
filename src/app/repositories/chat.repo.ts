import { Database } from "@config/database";
import ChatMessageEntity from "@entities/ChatMessage.entity";
import ChatSessionEntity from "@entities/ChatSession.entity";
import PaginationUtils from "@utilities/pagination";
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
    id: number,
  ): Promise<ChatSessionEntity | null> {
    return manager.findOne(ChatSessionEntity, {
      where: { id },
      relations: {
        user: true,
      },
    });
  }

  async createSession(
    session: ChatSessionEntity,
    manager?: EntityManager
  ): Promise<ChatSessionEntity> {
    const entityManager = manager || this.manager;
    return entityManager.save<ChatSessionEntity>(session);
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
    userId: number,
    manager?: EntityManager
  ): Promise<ChatSessionEntity[]> {
    const entityManager = manager || this.manager;
    return entityManager.find(ChatSessionEntity, {
      where: { user: { id: userId } },
      order: {
        created_at: "DESC",
      },
    });
  }

  async getSessionMessagesById(
    manager: EntityManager,
    sessionId: number,
    limit: number,
    page: number
  ) : Promise<[ChatMessageEntity[], number]>{
    return manager.findAndCount(ChatMessageEntity, {
      relations: {
        chatSession: true,
      },
      skip: PaginationUtils.calculateOffset(limit, page),
      take: limit,
      where: { chatSession: { id: sessionId } },
      order: {
        created_at: "ASC",
      },
    });
  }

  async removeSessionById(manager: EntityManager, id: number): Promise<void> {
    // First delete all messages for this session
    await manager.delete(ChatMessageEntity, { chatSession: { id } });
    // Then delete the session
    await manager.delete(ChatSessionEntity, { id });
  }

  async saveChat(
    manager: EntityManager,
    message: ChatMessageEntity
  ): Promise<ChatMessageEntity> {
    return await manager.save<ChatMessageEntity>(message);
  }
}
