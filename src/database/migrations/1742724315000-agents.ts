import { DEFAULT_TABLE_COLUMNS } from "@global/constant/database.constant";
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class Agents1742724315000 implements MigrationInterface {
  private agentTable = new Table({
    name: "agents",
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
      },
      {
        name: "description",
        type: "text",
      },
      {
        name: "instructions",
        type: "text",
      },
      {
        name: "avatar",
        type: "varchar",
        isNullable: true,
      },
      {
        name: "banner",
        type: "varchar",
        isNullable: true,
      },
      {
        name: "inputTypes",
        type: "text",
      },
      {
        name: "outputTypes",
        type: "text",
      },
      {
        name: "greetings",
        type: "text",
      },
      {
        name: "conversationStarters",
        type: "text",
      },
      {
        name: "tokenPrice",
        type: "int",
        default: 1,
      },
      {
        name: "aiModelId",
        type: "bigint",
        isNullable: false,
      },
      ...DEFAULT_TABLE_COLUMNS,
    ],
  });

  private aiModelTable = new Table({
    name: "ai_models",
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
        length: "64",
      },
      {
        name: "api_url",
        type: "varchar",
        length: "64",
      },
      ...DEFAULT_TABLE_COLUMNS,
    ],
  });

  private categoryTable = new Table({
    name: "categories",
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
        length: "64",
      },
      ...DEFAULT_TABLE_COLUMNS,
    ],
  });

  private junkCategoryWithAgentTable = new Table({
    name: "agent_categories",
    columns: [
      {
        name: "categoryId",
        type: "bigint",
        isPrimary: true,
      },
      {
        name: "agentId",
        type: "bigint",
        isPrimary: true,
      },
      ...DEFAULT_TABLE_COLUMNS,
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.aiModelTable, true);
    await queryRunner.createTable(this.categoryTable, true);
    await queryRunner.createTable(this.junkCategoryWithAgentTable, true);
    await queryRunner.createTable(this.agentTable, true);

    await queryRunner.createForeignKey(
      "agents",
      new TableForeignKey({
        columnNames: ["aiModelId"],
        referencedColumnNames: ["id"],
        referencedTableName: "ai_models",
      })
    );

    await queryRunner.createForeignKey(
      "agent_categories",
      new TableForeignKey({
        columnNames: ["categoryId"],
        referencedColumnNames: ["id"],
        referencedTableName: "categories",
      })
    );

    await queryRunner.createForeignKey(
      "agent_categories",
      new TableForeignKey({
        columnNames: ["agentId"],
        referencedColumnNames: ["id"],
        referencedTableName: "agents",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.junkCategoryWithAgentTable, true);
    await queryRunner.dropTable(this.categoryTable, true);
    await queryRunner.dropTable(this.aiModelTable, true);
    await queryRunner.dropTable(this.agentTable, true);
  }
}
