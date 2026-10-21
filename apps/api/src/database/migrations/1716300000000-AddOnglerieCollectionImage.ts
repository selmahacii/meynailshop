import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOnglerieCollectionImage1716300000000 implements MigrationInterface {
    name = 'AddOnglerieCollectionImage1716300000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "onglerieCollectionImage" text`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "onglerieCollectionImage"`
        );
    }
}
