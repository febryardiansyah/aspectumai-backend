import { Column, Entity } from "typeorm";
import BaseEntity from "./Base.entity";
import { TUserEmailVerificationType } from "@app/types/user-email-verification";

@Entity("user_email_verifications")
export default class UserEmailVerificationEntity extends BaseEntity {
  @Column({
    type: "text",
  })
  type: TUserEmailVerificationType;

  @Column({
    type: "varchar",
    length: 64,
  })
  email: string;

  @Column({
    type: "varchar",
    length: 10,
  })
  otp: string;

  @Column({
    type: "int2",
  })
  count: number;
}
