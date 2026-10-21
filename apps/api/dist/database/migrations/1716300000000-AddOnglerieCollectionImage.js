"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOnglerieCollectionImage1716300000000 = void 0;
class AddOnglerieCollectionImage1716300000000 {
    constructor() {
        this.name = 'AddOnglerieCollectionImage1716300000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "onglerieCollectionImage" text`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "onglerieCollectionImage"`);
    }
}
exports.AddOnglerieCollectionImage1716300000000 = AddOnglerieCollectionImage1716300000000;
//# sourceMappingURL=1716300000000-AddOnglerieCollectionImage.js.map