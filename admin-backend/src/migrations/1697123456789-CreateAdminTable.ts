import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAdminTable1697123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "admin",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "username",
            type: "varchar",
            length: "255",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
            length: "255",
          },
        ],
      }),
      true
    );

    // Insert default admin user
    await queryRunner.query(
      `INSERT INTO admin (username, password) VALUES ('admin', 'admin')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("admin");
  }
}
