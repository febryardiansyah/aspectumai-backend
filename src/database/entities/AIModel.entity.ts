import { Column, Entity, OneToMany } from "typeorm";
import AgentEntity from "./Agent.entity";
import BaseEntity from "./Base.entity";

@Entity("ai_models")
export default class AIModelEntity extends BaseEntity {
  @Column({ type: "varchar", length: 64 })
  name: string;

  @Column({ type: "varchar", length: 64 })
  apiUrl: string;

  @OneToMany(() => AgentEntity, agent => agent.aiModel)
  agents: AgentEntity[];
}
