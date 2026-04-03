import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1775226214072 implements MigrationInterface {
    name = 'Init1775226214072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`course_code\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`skill\` (\`name\` varchar(255) NOT NULL, PRIMARY KEY (\`name\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`availability\` (\`id\` varchar(36) NOT NULL, \`availability\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`application\` (\`id\` varchar(36) NOT NULL, \`academic_creds\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`courseId\` varchar(255) NOT NULL, \`roleId\` varchar(255) NOT NULL, \`availabilityId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`experience\` (\`id\` varchar(36) NOT NULL, \`role\` varchar(255) NOT NULL, \`company_name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`start_date\` datetime NOT NULL, \`end_date\` datetime NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`avatar\` (\`id\` varchar(36) NOT NULL, \`url\` varchar(255) NOT NULL DEFAULT 'defaultUrl', UNIQUE INDEX \`IDX_f803269c3ddaf5d07c0c52d7a9\` (\`url\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL, \`dateOfJoining\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`access\` tinyint NOT NULL DEFAULT 1, \`avatarId\` varchar(36) NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment\` (\`lecturerId\` varchar(255) NOT NULL, \`applicationId\` varchar(255) NOT NULL, \`comment\` text NOT NULL, PRIMARY KEY (\`lecturerId\`, \`applicationId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ranking\` (\`lecturerId\` varchar(255) NOT NULL, \`applicationId\` varchar(255) NOT NULL, \`rank\` int NOT NULL, PRIMARY KEY (\`lecturerId\`, \`applicationId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ApplicationSkill\` (\`applicationId\` varchar(36) NOT NULL, \`skillName\` varchar(255) NOT NULL, INDEX \`IDX_0461a3b17e9659a79c3a90b49b\` (\`applicationId\`), INDEX \`IDX_cfa049d76e74a78e9f8cf9a39d\` (\`skillName\`), PRIMARY KEY (\`applicationId\`, \`skillName\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`LecturerCourse\` (\`userId\` varchar(36) NOT NULL, \`courseId\` varchar(36) NOT NULL, INDEX \`IDX_aa894664c10afacce025e88f97\` (\`userId\`), INDEX \`IDX_0e0b96a59ff5c0f8d447769398\` (\`courseId\`), PRIMARY KEY (\`userId\`, \`courseId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`application\` ADD CONSTRAINT \`FK_b4ae3fea4a24b4be1a86dacf8a2\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`application\` ADD CONSTRAINT \`FK_c7fd474d2a734f4b50f8793c361\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`application\` ADD CONSTRAINT \`FK_c4ddcacd3e8304114ad84abe8bd\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`application\` ADD CONSTRAINT \`FK_0e6e9c6340a07d57a5dc0fb0124\` FOREIGN KEY (\`availabilityId\`) REFERENCES \`availability\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`experience\` ADD CONSTRAINT \`FK_cbfb1d1219454c9b45f1b3c4274\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_58f5c71eaab331645112cf8cfa5\` FOREIGN KEY (\`avatarId\`) REFERENCES \`avatar\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_79d2ecfc7be4e4a89e4a3b950a3\` FOREIGN KEY (\`lecturerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_6f1649c8d094a3a7d90a1dbad49\` FOREIGN KEY (\`applicationId\`) REFERENCES \`application\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ranking\` ADD CONSTRAINT \`FK_6d850060d4a32b34fa03a40935d\` FOREIGN KEY (\`lecturerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ranking\` ADD CONSTRAINT \`FK_59cc6db96b9fef11412eee6d882\` FOREIGN KEY (\`applicationId\`) REFERENCES \`application\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` ADD CONSTRAINT \`FK_0461a3b17e9659a79c3a90b49bf\` FOREIGN KEY (\`applicationId\`) REFERENCES \`application\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` ADD CONSTRAINT \`FK_cfa049d76e74a78e9f8cf9a39dd\` FOREIGN KEY (\`skillName\`) REFERENCES \`skill\`(\`name\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`LecturerCourse\` ADD CONSTRAINT \`FK_aa894664c10afacce025e88f97b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`LecturerCourse\` ADD CONSTRAINT \`FK_0e0b96a59ff5c0f8d4477693986\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`LecturerCourse\` DROP FOREIGN KEY \`FK_0e0b96a59ff5c0f8d4477693986\``);
        await queryRunner.query(`ALTER TABLE \`LecturerCourse\` DROP FOREIGN KEY \`FK_aa894664c10afacce025e88f97b\``);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` DROP FOREIGN KEY \`FK_cfa049d76e74a78e9f8cf9a39dd\``);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` DROP FOREIGN KEY \`FK_0461a3b17e9659a79c3a90b49bf\``);
        await queryRunner.query(`ALTER TABLE \`ranking\` DROP FOREIGN KEY \`FK_59cc6db96b9fef11412eee6d882\``);
        await queryRunner.query(`ALTER TABLE \`ranking\` DROP FOREIGN KEY \`FK_6d850060d4a32b34fa03a40935d\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_6f1649c8d094a3a7d90a1dbad49\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_79d2ecfc7be4e4a89e4a3b950a3\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_58f5c71eaab331645112cf8cfa5\``);
        await queryRunner.query(`ALTER TABLE \`experience\` DROP FOREIGN KEY \`FK_cbfb1d1219454c9b45f1b3c4274\``);
        await queryRunner.query(`ALTER TABLE \`application\` DROP FOREIGN KEY \`FK_0e6e9c6340a07d57a5dc0fb0124\``);
        await queryRunner.query(`ALTER TABLE \`application\` DROP FOREIGN KEY \`FK_c4ddcacd3e8304114ad84abe8bd\``);
        await queryRunner.query(`ALTER TABLE \`application\` DROP FOREIGN KEY \`FK_c7fd474d2a734f4b50f8793c361\``);
        await queryRunner.query(`ALTER TABLE \`application\` DROP FOREIGN KEY \`FK_b4ae3fea4a24b4be1a86dacf8a2\``);
        await queryRunner.query(`DROP INDEX \`IDX_0e0b96a59ff5c0f8d447769398\` ON \`LecturerCourse\``);
        await queryRunner.query(`DROP INDEX \`IDX_aa894664c10afacce025e88f97\` ON \`LecturerCourse\``);
        await queryRunner.query(`DROP TABLE \`LecturerCourse\``);
        await queryRunner.query(`DROP INDEX \`IDX_cfa049d76e74a78e9f8cf9a39d\` ON \`ApplicationSkill\``);
        await queryRunner.query(`DROP INDEX \`IDX_0461a3b17e9659a79c3a90b49b\` ON \`ApplicationSkill\``);
        await queryRunner.query(`DROP TABLE \`ApplicationSkill\``);
        await queryRunner.query(`DROP TABLE \`ranking\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_f803269c3ddaf5d07c0c52d7a9\` ON \`avatar\``);
        await queryRunner.query(`DROP TABLE \`avatar\``);
        await queryRunner.query(`DROP TABLE \`experience\``);
        await queryRunner.query(`DROP TABLE \`application\``);
        await queryRunner.query(`DROP TABLE \`availability\``);
        await queryRunner.query(`DROP TABLE \`skill\``);
        await queryRunner.query(`DROP TABLE \`course\``);
        await queryRunner.query(`DROP TABLE \`role\``);
    }

}
