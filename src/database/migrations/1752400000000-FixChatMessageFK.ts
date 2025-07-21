import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class FixChatMessageFK1752400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the existing foreign key
    const table = await queryRunner.getTable("chat_messages");
    if (table) {
      const foreignKey = table.foreignKeys.find(
        fk => fk.columnNames.indexOf("chatSessionId") !== -1
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey("chat_messages", foreignKey);
      }
    }

    // Create new foreign key with CASCADE delete
    await queryRunner.createForeignKey(
      "chat_messages",
      new TableForeignKey({
        columnNames: ["chatSessionId"],
        referencedColumnNames: ["id"],
        referencedTableName: "chat_sessions",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the CASCADE foreign key
    const table = await queryRunner.getTable("chat_messages");
    if (table) {
      const foreignKey = table.foreignKeys.find(
        fk => fk.columnNames.indexOf("chatSessionId") !== -1
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey("chat_messages", foreignKey);
      }
    }

    // Recreate original foreign key without CASCADE
    await queryRunner.createForeignKey(
      "chat_messages",
      new TableForeignKey({
        columnNames: ["chatSessionId"],
        referencedColumnNames: ["id"],
        referencedTableName: "chat_sessions",
      })
    );
  }
}
