import { Column, Entity } from "typeorm";
import BaseEntity from "./Base.entity";

@Entity("users")
export default class UserEntity extends BaseEntity {
  @Column({
    type: "varchar",
    length: 64,
  })
  first_name: string;

  @Column({
    type: "varchar",
    length: 64,
  })
  last_name: string;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
  })
  username: string;

  @Column({
    type: "varchar",
    length: 64,
    unique: true,
  })
  email: string;

  @Column({
    type: "text",
  })
  password: string;
}
