# TypeORM Migration Guide

## Overview

Your TypeORM migration system is now set up! This guide will help you use migrations effectively to manage your database schema changes.

## Available Commands

### 1. Generate Migration

```bash
npm run migration:generate src/migration/MigrationName
```

This command compares your current entities with the database schema and generates a migration file with the necessary changes.

### 2. Run Migrations

```bash
npm run migration:run
```

Executes all pending migrations that haven't been run yet.

### 3. Revert Migration

```bash
npm run migration:revert
```

Reverts the last executed migration.

### 4. Show Migration Status

```bash
npm run migration:show
```

Shows which migrations have been run and which are pending.

## How to Use Migrations

### When to Generate Migrations

Generate a migration whenever you:

- Add new entities
- Modify existing entities (add/remove columns, change types, etc.)
- Add or remove indexes
- Change relationships between entities

### Example Workflow

1. **Make changes to your entities** (e.g., add a new column to User entity)

2. **Generate migration**:

   ```bash
   npm run migration:generate src/migration/AddUserLastLogin
   ```

3. **Review the generated migration** in `src/migration/` directory

4. **Run the migration**:
   ```bash
   npm run migration:run
   ```

### Example Entity Change

If you want to add a `lastLoginAt` field to your User entity:

```typescript
// In src/entity/User.ts
@Column({ type: 'datetime', nullable: true })
lastLoginAt: Date;
```

Then run:

```bash
npm run migration:generate src/migration/AddUserLastLogin
```

## Important Notes

1. **Always review generated migrations** before running them
2. **Test migrations in development** before applying to production
3. **Backup your database** before running migrations in production
4. **Never edit migration files** after they've been run
5. **Synchronize is disabled** - always use migrations for schema changes

## Migration File Structure

```typescript
import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1234567890 implements MigrationInterface {
  name = "MigrationName1234567890";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Forward migration - what changes to apply
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`lastLoginAt\` datetime NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse migration - how to undo the changes
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`lastLoginAt\``);
  }
}
```

## Configuration

Your migration configuration is in `src/data-source.ts`:

- Migration files are stored in `src/migration/`
- Migration table name: `typeorm_migrations`
- Synchronize is disabled for safety

## Troubleshooting

### "No changes found"

This means your entities match your database schema. Either:

- Your database is already up to date, or
- You need to make changes to your entities first

### Migration fails

- Check the SQL syntax in the migration file
- Ensure the database user has necessary permissions
- Check for data conflicts (e.g., adding NOT NULL column to table with existing data)

## Best Practices

1. **Descriptive names**: Use clear migration names like `AddUserEmail` or `CreateOrderTable`
2. **Small migrations**: Keep migrations focused on single changes
3. **Data migrations**: For complex data transformations, create separate data migration scripts
4. **Version control**: Always commit migration files to version control
5. **Team coordination**: Ensure team members run migrations after pulling changes
