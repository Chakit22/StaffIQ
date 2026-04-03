import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCoverLetterToApplication1749800000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`application\` ADD \`cover_letter\` text NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`application\` DROP COLUMN \`cover_letter\``
    );
  }
}
