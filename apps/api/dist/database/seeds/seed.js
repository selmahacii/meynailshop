"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datasource_1 = require("../datasource");
const users_seed_1 = require("./users.seed");
const categories_seed_1 = require("./categories.seed");
const products_seed_1 = require("./products.seed");
async function seed() {
    const connection = datasource_1.AppDataSource;
    if (!connection.isInitialized) {
        await connection.initialize();
    }
    console.log('🌱 Seeding database...');
    try {
        await (0, users_seed_1.seedUsers)(connection);
        console.log('✓ Users seeded');
        await (0, categories_seed_1.seedCategories)(connection);
        console.log('✓ Categories seeded');
        await (0, products_seed_1.seedProducts)(connection);
        console.log('✓ Products seeded');
        console.log('✅ Database seeded successfully!');
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
    }
    finally {
        await connection.destroy();
    }
}
seed();
//# sourceMappingURL=seed.js.map