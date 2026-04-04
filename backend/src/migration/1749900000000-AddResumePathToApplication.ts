import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResumePathToApplication1749900000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`application\` ADD \`resume_path\` varchar(500) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`application\` DROP COLUMN \`resume_path\``,
    );
  }
}
