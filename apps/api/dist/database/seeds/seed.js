"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });
console.log('🌱 Environment loaded from:', envPath);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PORT:', process.env.DB_PORT);
const { AppDataSource } = require('../datasource');
const users_seed_1 = require("./users.seed");
const categories_seed_1 = require("./categories.seed");
const products_seed_1 = require("./products.seed");
const orders_seed_1 = require("./orders.seed");
async function seed() {
    const connection = AppDataSource;
    try {
        if (!connection.isInitialized) {
            await connection.initialize();
        }
        console.log('🚀 Successfully connected to database');
        console.log('🌱 Seeding database...');
        await (0, users_seed_1.seedUsers)(connection);
        console.log('✓ Users seeded');
        await (0, categories_seed_1.seedCategories)(connection);
        console.log('✓ Categories seeded');
        await (0, products_seed_1.seedProducts)(connection);
        console.log('✓ Products seeded');
        await (0, orders_seed_1.seedOrders)(connection);
        console.log('✓ Orders seeded');
        console.log('✅ Database seeded successfully!');
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
    }
    finally {
        if (connection.isInitialized) {
            await connection.destroy();
        }
    }
}
seed();
//# sourceMappingURL=seed.js.map