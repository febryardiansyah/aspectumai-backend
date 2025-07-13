import { Column, Entity, OneToMany } from "typeorm";
import ChatMessageEntity from "./ChatMessage.entity";
import BaseEntity from "./Base.entity";

@Entity("chat_sessions")
export default class ChatSessionEntity extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  name: string;

  @OneToMany(() => ChatMessageEntity, message => message.chatSession)
  messages: ChatMessageEntity[];
}
