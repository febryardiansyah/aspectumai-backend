import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import AgentEntity from "./Agent.entity";
import BaseEntity from "./Base.entity";

@Entity("categories")
export default class CategoryEntity extends BaseEntity {
  @Column({ type: "varchar", length: 64 })
  name: string;

  @ManyToMany(() => AgentEntity)
  @JoinTable()
  agents: AgentEntity[];
}
