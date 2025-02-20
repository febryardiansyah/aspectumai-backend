import { EntityManager, Repository } from "typeorm";

import { TUserEmailVerificationType } from "@app/types/user-email-verification";
import Database from "@config/database";
import UserEmailVerificationEntity from "@entities/UserEmailVerification.entity";

export default class UserEmailVerificationRepository extends Repository<UserEmailVerificationEntity> {
  constructor(manager?: EntityManager) {
    super(
      UserEmailVerificationEntity,
      manager || Database.getInstance().getDataSource().manager
    );
  }

  async findByEmailAndType(
    manager: EntityManager,
    email: string,
    type: TUserEmailVerificationType
  ): Promise<UserEmailVerificationEntity | null> {
    return manager.findOne(UserEmailVerificationEntity, {
      where: { email, type },
    });
  }

  async createOtp(
    manager: EntityManager,
    email: string,
    type: TUserEmailVerificationType,
    otp: string
  ): Promise<void> {
    const entity = manager.create(UserEmailVerificationEntity, {
      email,
      type,
      otp,
      count: 1,
    });

    await manager.save(entity);
  }

  async updateOtp(
    manager: EntityManager,
    email: string,
    type: TUserEmailVerificationType,
    otp: string
  ): Promise<void> {
    await manager.increment(
      UserEmailVerificationEntity,
      { email, type },
      "count",
      1
    );

    await manager.update(UserEmailVerificationEntity, { email, type }, { otp });
  }
}
