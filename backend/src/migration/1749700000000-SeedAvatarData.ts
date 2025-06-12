import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedAvatarData1749700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Array of avatar URLs from the frontend profile page
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
    // Remove the seeded avatars
    for (const url of [
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
    ]) {
      await queryRunner.query(`DELETE FROM avatar WHERE url = ?`, [url]);
    }
  }
}
