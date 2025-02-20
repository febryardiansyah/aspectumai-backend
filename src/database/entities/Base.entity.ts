import DatetimeUtil from "@utilities/datetime";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export default abstract class BaseEntity {
  @Column({
    primary: true,
    generated: true,
    unsigned: true,
    type: "bigint",
  })
  id: number;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updated_at: Date;

  @BeforeInsert()
  insertCreated() {
    this.created_at = new Date(DatetimeUtil.withFormat("YYYY-MM-DD HH:mm:ss"));
    this.updated_at = new Date(DatetimeUtil.withFormat("YYYY-MM-DD HH:mm:ss"));
  }

  @BeforeUpdate()
  updateDates() {
    this.updated_at = new Date(DatetimeUtil.withFormat("YYYY-MM-DD HH:mm:ss"));
  }
}
