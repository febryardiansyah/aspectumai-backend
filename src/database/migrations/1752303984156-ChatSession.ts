import { DEFAULT_TABLE_COLUMNS } from "@global/constant/database.constant";
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class ChatSession1752303984156 implements MigrationInterface {
  private chatSessionTable = new Table({
    name: "chat_sessions",
    columns: [
      {
        name: "id",
        type: "bigint",
        isPrimary: true,
        unsigned: true,
        isGenerated: true,
        isUnique: true,
        generationStrategy: "increment",
      },
      {
        name: "name",
        type: "varchar",
        length: "255",
        isNullable: false,
      },
      ...DEFAULT_TABLE_COLUMNS,
    ],
  });

  private chatMessageTable = new Table({
    name: "chat_messages",
    columns: [
      {
        name: "id",
        type: "bigint",
        isPrimary: true,
        unsigned: true,
        isGenerated: true,
        isUnique: true,
        generationStrategy: "increment",
      },
      {
        name: "content",
        type: "text",
        isNullable: false,
      },
      {
        name: "isUserMessage",
        type: "boolean",
        default: false,
      },
      {
        name: "chatSessionId",
        type: "bigint",
        isNullable: false,
      },
      ...DEFAULT_TABLE_COLUMNS,
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.chatSessionTable, true);
    await queryRunner.createTable(this.chatMessageTable, true);
    await queryRunner.createForeignKey(
      "chat_messages",
      new TableForeignKey({
        columnNames: ["chatSessionId"],
        referencedColumnNames: ["id"],
        referencedTableName: "chat_sessions",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.chatSessionTable);
  }
}
