import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPositionAndStatus1749960000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Position table
    await queryRunner.query(`
      CREATE TABLE \`position\` (
        \`id\` varchar(36) NOT NULL,
        \`title\` varchar(255) NOT NULL,
        \`description\` text NOT NULL,
        \`courseId\` varchar(36) NOT NULL,
        \`roleId\` varchar(36) NOT NULL,
        \`requirements\` text NULL,
        \`positions_available\` int NOT NULL,
        \`deadline\` date NOT NULL,
        \`status\` enum('open', 'closed', 'filled') NOT NULL DEFAULT 'open',
        \`created_by\` varchar(36) NOT NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_position_course\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_position_role\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`),
        CONSTRAINT \`FK_position_creator\` FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Add status column to Application
    await queryRunner.query(`
      ALTER TABLE \`application\`
      ADD \`status\` enum('applied', 'under_review', 'shortlisted', 'interview', 'offered', 'accepted', 'rejected')
      NOT NULL DEFAULT 'applied'
    `);

    // Add positionId column to Application (nullable for backward compat)
    await queryRunner.query(`
      ALTER TABLE \`application\`
      ADD \`positionId\` varchar(36) NULL
    `);

    // Add foreign key for positionId
    await queryRunner.query(`
      ALTER TABLE \`application\`
      ADD CONSTRAINT \`FK_application_position\` FOREIGN KEY (\`positionId\`) REFERENCES \`position\`(\`id\`) ON DELETE SET NULL
    `);

    // Add applied_at column to Application
    await queryRunner.query(`
      ALTER TABLE \`application\`
      ADD \`applied_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`application\` DROP FOREIGN KEY \`FK_application_position\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`application\` DROP COLUMN \`applied_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`application\` DROP COLUMN \`positionId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`application\` DROP COLUMN \`status\``,
    );
    await queryRunner.query(`DROP TABLE \`position\``);
  }
}
