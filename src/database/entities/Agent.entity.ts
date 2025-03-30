import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import AIModelEntity from "./AIModel.entity";
import CategoryEntity from "./Category.entity";
import BaseEntity from "./Base.entity";

@Entity("agents")
export default class AgentEntity extends BaseEntity {
  @Column({ type: "varchar", length: 255})
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text" })
  instructions: string;

  @Column({ type: "varchar", nullable: true })
  avatar: string;

  @Column({ type: "varchar", nullable: true })
  banner: string;

  @Column("simple-array")
  inputTypes: string[]; // ["text", "image"]

  @Column("simple-array")
  outputTypes: string[]; // ["text", "image"]

  @ManyToOne(() => AIModelEntity, model => model.agents, { nullable: false })
  aiModel: AIModelEntity;

  @ManyToMany(() => CategoryEntity)
  @JoinTable({
    name: "agent_categories",
    joinColumn: {
      name: "agentId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "categoryId",
      referencedColumnName: "id",
    },
  })
  categories: CategoryEntity[];

  @Column({ type: "text" })
  greetings: string;

  @Column("simple-array")
  conversationStarters: string[]; // Maksimal 2

  @Column({ type: "int", default: 1 })
  tokenPrice: number;
}
