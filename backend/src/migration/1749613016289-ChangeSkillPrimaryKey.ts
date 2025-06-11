import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeSkillPrimaryKey1749613016289 implements MigrationInterface {
    name = 'ChangeSkillPrimaryKey1749613016289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` DROP FOREIGN KEY \`FK_73c2aadab8d8b3afdc203c048b9\``);
        await queryRunner.query(`DROP INDEX \`IDX_73c2aadab8d8b3afdc203c048b\` ON \`ApplicationSkill\``);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` CHANGE \`skillId\` \`skillName\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`skill\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`skill\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`skill\` ADD PRIMARY KEY (\`name\`)`);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` ADD PRIMARY KEY (\`applicationId\`)`);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` DROP COLUMN \`skillName\``);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` ADD \`skillName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` ADD PRIMARY KEY (\`applicationId\`, \`skillName\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_cfa049d76e74a78e9f8cf9a39d\` ON \`ApplicationSkill\` (\`skillName\`)`);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` ADD CONSTRAINT \`FK_cfa049d76e74a78e9f8cf9a39dd\` FOREIGN KEY (\`skillName\`) REFERENCES \`skill\`(\`name\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` DROP FOREIGN KEY \`FK_cfa049d76e74a78e9f8cf9a39dd\``);
        await queryRunner.query(`DROP INDEX \`IDX_cfa049d76e74a78e9f8cf9a39d\` ON \`ApplicationSkill\``);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` ADD PRIMARY KEY (\`applicationId\`)`);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` DROP COLUMN \`skillName\``);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` ADD \`skillName\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` ADD PRIMARY KEY (\`applicationId\`, \`skillName\`)`);
        await queryRunner.query(`ALTER TABLE \`skill\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`skill\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`skill\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` CHANGE \`skillName\` \`skillId\` varchar(36) NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_73c2aadab8d8b3afdc203c048b\` ON \`ApplicationSkill\` (\`skillId\`)`);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` ADD CONSTRAINT \`FK_73c2aadab8d8b3afdc203c048b9\` FOREIGN KEY (\`skillId\`) REFERENCES \`skill\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
