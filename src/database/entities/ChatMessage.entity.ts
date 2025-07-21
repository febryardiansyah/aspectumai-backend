import { Column, Entity, ManyToOne } from "typeorm";
import ChatSessionEntity from "./ChatSession.entity";
import BaseEntity from "./Base.entity";

@Entity("chat_messages")
export default class ChatMessageEntity extends BaseEntity {
  @Column({ type: "text" })
  content: string;

  @ManyToOne(() => ChatSessionEntity, session => session.messages, {
    nullable: false,
    onDelete: "CASCADE",
  })
  chatSession: ChatSessionEntity;

  @Column({ type: "boolean", default: false })
  isUserMessage: boolean;
}
