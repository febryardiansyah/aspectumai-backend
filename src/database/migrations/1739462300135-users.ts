import { DEFAULT_TABLE_COLUMNS } from "@global/constant/database.constant";
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Users1739462300135 implements MigrationInterface {
  private table = new Table({
    name: "users",
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
        name: "first_name",
        type: "varchar",
        length: "64",
      },
      {
        name: "last_name",
        type: "varchar",
        length: "64",
      },
      {
        name: "username",
        type: "varchar",
        length: "255",
        isUnique: true,
      },
      {
        name: "email",
        type: "varchar",
        length: "64",
        isUnique: true,
      },
      {
        name: "password",
        type: "text",
      },
      ...DEFAULT_TABLE_COLUMNS,
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table, true);
  }
}
