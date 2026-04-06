import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdminTable1750000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`admin\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`username\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        UNIQUE INDEX \`IDX_admin_username\` (\`username\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Seed default admin user (password: StaffIQ@Admin2026)
    await queryRunner.query(`
      INSERT INTO \`admin\` (\`username\`, \`password\`) VALUES ('admin', 'StaffIQ@Admin2026')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`admin\``);
  }
}
