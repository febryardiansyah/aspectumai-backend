import Database from "@config/database";
import UserEntity from "@entities/User.entity";
import { EntityManager, Repository } from "typeorm";

export default class AuthRepository extends Repository<UserEntity> {
  constructor(manager?: EntityManager) {
    super(
      UserEntity,
      manager || Database.getInstance().getDataSource().manager
    );
  }

  async createUser(
    manager: EntityManager,
    user: UserEntity
  ): Promise<UserEntity> {
    return manager.save(user);
  }

  async findByEmail(
    manager: EntityManager,
    email: string
  ): Promise<UserEntity | null> {
    return manager.findOne(UserEntity, { where: { email } });
  }

  async findByUsername(
    manager: EntityManager,
    username: string
  ): Promise<UserEntity | null> {
    return manager.findOne(UserEntity, { where: { username } });
  }

  async updateUserVerification(
    manager: EntityManager,
    email: string
  ): Promise<void> {
    await manager.update(UserEntity, { email }, { isEmailVerified: true });
  }
}
