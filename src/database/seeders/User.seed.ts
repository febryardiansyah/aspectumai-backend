import AppDataSource from "../../config/datasource";
import UserEntity from "../entities/User.entity";
import bcrypt from "bcryptjs";

export default class UserSeeder {
  async run(): Promise<void> {
    const repository = AppDataSource.getRepository(UserEntity);

    // Check if data already exists
    const existingUsers = await repository.count();
    if (existingUsers > 0) {
      console.log("Users already exist, skipping seeding...");
      return;
    }

    const users = [
      {
        name: "Admin User",
        username: "admin",
        email: "admin@aspectumai.com",
        password: "admin123",
        isEmailVerified: true
      },
      {
        name: "John Doe",
        username: "johndoe",
        email: "john.doe@example.com",
        password: "password123",
        isEmailVerified: true
      },
      {
        name: "Jane Smith",
        username: "janesmith",
        email: "jane.smith@example.com",
        password: "password123",
        isEmailVerified: false
      },
      {
        name: "Demo User",
        username: "demo",
        email: "demo@aspectumai.com",
        password: "demo123",
        isEmailVerified: true
      }
    ];

    const entities = await Promise.all(
      users.map(async userData => {
        const entity = new UserEntity();
        entity.name = userData.name;
        entity.username = userData.username;
        entity.email = userData.email;
        entity.password = await bcrypt.hash(userData.password, 10);
        entity.isEmailVerified = userData.isEmailVerified;
        return entity;
      })
    );

    await repository.save(entities);
    console.log(`✅ Seeded ${entities.length} users`);
  }
}
