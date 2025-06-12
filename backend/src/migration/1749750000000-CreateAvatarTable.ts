import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateAvatarTable1749750000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the avatar table
    await queryRunner.createTable(
      new Table({
        name: "avatar",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "url",
            type: "varchar",
            isUnique: true,
            default: "'defaultUrl'",
          },
        ],
      }),
      true
    );

    // Add avatar relationship to user table if not exists
    const hasAvatarColumn = await queryRunner.hasColumn("user", "avatarId");

    if (!hasAvatarColumn) {
      await queryRunner.query(
        `ALTER TABLE user ADD COLUMN avatarId varchar(36) NULL`
      );

      // Add foreign key
      await queryRunner.createForeignKey(
        "user",
        new TableForeignKey({
          columnNames: ["avatarId"],
          referencedColumnNames: ["id"],
          referencedTableName: "avatar",
          onDelete: "SET NULL",
        })
      );
    }

    // Insert sample avatars
    const avatarUrls = [
      "https://mighty.tools/mockmind-api/content/human/65.jpg",
      "https://mighty.tools/mockmind-api/content/human/115.jpg",
      "https://mighty.tools/mockmind-api/content/human/120.jpg",
      "https://mighty.tools/mockmind-api/content/human/127.jpg",
      "https://mighty.tools/mockmind-api/content/human/123.jpg",
      "https://mighty.tools/mockmind-api/content/cartoon/27.jpg",
      "https://mighty.tools/mockmind-api/content/cartoon/26.jpg",
      "https://mighty.tools/mockmind-api/content/cartoon/31.jpg",
      "https://mighty.tools/mockmind-api/content/cartoon/7.jpg",
      "https://mighty.tools/mockmind-api/content/abstract/51.jpg",
      "https://mighty.tools/mockmind-api/content/abstract/38.jpg",
      "https://mighty.tools/mockmind-api/content/abstract/35.jpg",
      "https://mighty.tools/mockmind-api/content/abstract/32.jpg",
    ];

    // Insert each avatar URL into the Avatar table
    for (const url of avatarUrls) {
      await queryRunner.query(
        `INSERT INTO avatar (id, url) VALUES (UUID(), ?)`,
        [url]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key first
    const userTable = await queryRunner.getTable("user");
    const foreignKey = userTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("avatarId") !== -1
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey("user", foreignKey);
    }

    // Drop the avatarId column
    await queryRunner.dropColumn("user", "avatarId");

    // Drop the avatar table
    await queryRunner.dropTable("avatar");
  }
}
