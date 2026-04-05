import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1000000000000 implements MigrationInterface {
    name = 'Init1000000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Lookup tables
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
        await queryRunner.query(`CREATE TABLE \`course\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`course_code\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
        await queryRunner.query(`CREATE TABLE \`skill\` (\`name\` varchar(255) NOT NULL, PRIMARY KEY (\`name\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
        await queryRunner.query(`CREATE TABLE \`availability\` (\`id\` varchar(36) NOT NULL, \`availability\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
        await queryRunner.query(`CREATE TABLE \`avatar\` (\`id\` varchar(36) NOT NULL, \`url\` varchar(255) NOT NULL DEFAULT 'defaultUrl', UNIQUE INDEX \`IDX_avatar_url\` (\`url\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

        // User
        await queryRunner.query(`CREATE TABLE \`user\` (
            \`id\` varchar(36) NOT NULL,
            \`name\` varchar(255) NOT NULL,
            \`email\` varchar(255) NOT NULL,
            \`phone\` varchar(255) NOT NULL,
            \`password\` varchar(255) NOT NULL,
            \`role\` varchar(255) NOT NULL,
            \`dateOfJoining\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            \`access\` tinyint NOT NULL DEFAULT 1,
            \`is_verified\` tinyint NOT NULL DEFAULT 0,
            \`avatarId\` varchar(36) NULL,
            UNIQUE INDEX \`IDX_user_email\` (\`email\`),
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

        // Position
        await queryRunner.query(`CREATE TABLE \`position\` (
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
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

        // Application
        await queryRunner.query(`CREATE TABLE \`application\` (
            \`id\` varchar(36) NOT NULL,
            \`academic_creds\` varchar(255) NOT NULL,
            \`cover_letter\` text NULL,
            \`resume_path\` varchar(500) NULL,
            \`status\` enum('applied', 'under_review', 'shortlisted', 'interview', 'offered', 'accepted', 'rejected') NOT NULL DEFAULT 'applied',
            \`positionId\` varchar(36) NULL,
            \`applied_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            \`userId\` varchar(255) NOT NULL,
            \`courseId\` varchar(255) NOT NULL,
            \`roleId\` varchar(255) NOT NULL,
            \`availabilityId\` varchar(255) NOT NULL,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

        // Experience
        await queryRunner.query(`CREATE TABLE \`experience\` (\`id\` varchar(36) NOT NULL, \`role\` varchar(255) NOT NULL, \`company_name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`start_date\` datetime NOT NULL, \`end_date\` datetime NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

        // Comment
        await queryRunner.query(`CREATE TABLE \`comment\` (\`lecturerId\` varchar(255) NOT NULL, \`applicationId\` varchar(255) NOT NULL, \`comment\` text NOT NULL, PRIMARY KEY (\`lecturerId\`, \`applicationId\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

        // Ranking
        await queryRunner.query(`CREATE TABLE \`ranking\` (\`lecturerId\` varchar(255) NOT NULL, \`applicationId\` varchar(255) NOT NULL, \`rank\` int NOT NULL, PRIMARY KEY (\`lecturerId\`, \`applicationId\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

        // Join tables
        await queryRunner.query(`CREATE TABLE \`ApplicationSkill\` (\`applicationId\` varchar(36) NOT NULL, \`skillName\` varchar(255) NOT NULL, INDEX \`IDX_appskill_app\` (\`applicationId\`), INDEX \`IDX_appskill_skill\` (\`skillName\`), PRIMARY KEY (\`applicationId\`, \`skillName\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
        await queryRunner.query(`CREATE TABLE \`LecturerCourse\` (\`userId\` varchar(36) NOT NULL, \`courseId\` varchar(36) NOT NULL, INDEX \`IDX_leccourse_user\` (\`userId\`), INDEX \`IDX_leccourse_course\` (\`courseId\`), PRIMARY KEY (\`userId\`, \`courseId\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

        // Foreign keys — User
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_user_avatar\` FOREIGN KEY (\`avatarId\`) REFERENCES \`avatar\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // Foreign keys — Position
        await queryRunner.query(`ALTER TABLE \`position\` ADD CONSTRAINT \`FK_position_course\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`position\` ADD CONSTRAINT \`FK_position_role\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`position\` ADD CONSTRAINT \`FK_position_creator\` FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // Foreign keys — Application
        await queryRunner.query(`ALTER TABLE \`application\` ADD CONSTRAINT \`FK_app_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`application\` ADD CONSTRAINT \`FK_app_course\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`application\` ADD CONSTRAINT \`FK_app_role\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`application\` ADD CONSTRAINT \`FK_app_availability\` FOREIGN KEY (\`availabilityId\`) REFERENCES \`availability\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`application\` ADD CONSTRAINT \`FK_app_position\` FOREIGN KEY (\`positionId\`) REFERENCES \`position\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);

        // Foreign keys — Experience
        await queryRunner.query(`ALTER TABLE \`experience\` ADD CONSTRAINT \`FK_exp_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // Foreign keys — Comment
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_comment_lecturer\` FOREIGN KEY (\`lecturerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_comment_app\` FOREIGN KEY (\`applicationId\`) REFERENCES \`application\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);

        // Foreign keys — Ranking
        await queryRunner.query(`ALTER TABLE \`ranking\` ADD CONSTRAINT \`FK_ranking_lecturer\` FOREIGN KEY (\`lecturerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ranking\` ADD CONSTRAINT \`FK_ranking_app\` FOREIGN KEY (\`applicationId\`) REFERENCES \`application\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);

        // Foreign keys — Join tables
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` ADD CONSTRAINT \`FK_appskill_app\` FOREIGN KEY (\`applicationId\`) REFERENCES \`application\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` ADD CONSTRAINT \`FK_appskill_skill\` FOREIGN KEY (\`skillName\`) REFERENCES \`skill\`(\`name\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`LecturerCourse\` ADD CONSTRAINT \`FK_leccourse_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`LecturerCourse\` ADD CONSTRAINT \`FK_leccourse_course\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`LecturerCourse\` DROP FOREIGN KEY \`FK_leccourse_course\``);
        await queryRunner.query(`ALTER TABLE \`LecturerCourse\` DROP FOREIGN KEY \`FK_leccourse_user\``);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` DROP FOREIGN KEY \`FK_appskill_skill\``);
        await queryRunner.query(`ALTER TABLE \`ApplicationSkill\` DROP FOREIGN KEY \`FK_appskill_app\``);
        await queryRunner.query(`ALTER TABLE \`ranking\` DROP FOREIGN KEY \`FK_ranking_app\``);
        await queryRunner.query(`ALTER TABLE \`ranking\` DROP FOREIGN KEY \`FK_ranking_lecturer\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_comment_app\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_comment_lecturer\``);
        await queryRunner.query(`ALTER TABLE \`experience\` DROP FOREIGN KEY \`FK_exp_user\``);
        await queryRunner.query(`ALTER TABLE \`application\` DROP FOREIGN KEY \`FK_app_position\``);
        await queryRunner.query(`ALTER TABLE \`application\` DROP FOREIGN KEY \`FK_app_availability\``);
        await queryRunner.query(`ALTER TABLE \`application\` DROP FOREIGN KEY \`FK_app_role\``);
        await queryRunner.query(`ALTER TABLE \`application\` DROP FOREIGN KEY \`FK_app_course\``);
        await queryRunner.query(`ALTER TABLE \`application\` DROP FOREIGN KEY \`FK_app_user\``);
        await queryRunner.query(`ALTER TABLE \`position\` DROP FOREIGN KEY \`FK_position_creator\``);
        await queryRunner.query(`ALTER TABLE \`position\` DROP FOREIGN KEY \`FK_position_role\``);
        await queryRunner.query(`ALTER TABLE \`position\` DROP FOREIGN KEY \`FK_position_course\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_user_avatar\``);
        await queryRunner.query(`DROP TABLE \`LecturerCourse\``);
        await queryRunner.query(`DROP TABLE \`ApplicationSkill\``);
        await queryRunner.query(`DROP TABLE \`ranking\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP TABLE \`experience\``);
        await queryRunner.query(`DROP TABLE \`application\``);
        await queryRunner.query(`DROP TABLE \`position\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`avatar\``);
        await queryRunner.query(`DROP TABLE \`availability\``);
        await queryRunner.query(`DROP TABLE \`skill\``);
        await queryRunner.query(`DROP TABLE \`course\``);
        await queryRunner.query(`DROP TABLE \`role\``);
    }
}
