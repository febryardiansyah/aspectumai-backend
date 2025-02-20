import { DEFAULT_TABLE_COLUMNS } from "@global/constant/database.constant";
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UserEmailVerifications1739469908541 implements MigrationInterface {
  private table = new Table({
    name: "user_email_verifications",
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
        name: "type",
        type: "text",
      },
      {
        name: "email",
        type: "varchar",
        length: "64",
      },
      {
        name: "otp",
        type: "varchar",
        length: "10",
      },
      {
        name: "count",
        type: "int2",
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
