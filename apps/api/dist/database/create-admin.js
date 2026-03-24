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
require("reflect-metadata");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const bcrypt = __importStar(require("bcrypt"));
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });
const { AppDataSource } = require('./datasource');
const { User } = require('./entities/user.entity');
async function createAdmin() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const userRepo = AppDataSource.getRepository(User);
        const email = 'meeybouabdellah@gmail.com';
        const password = 'meey2026';
        const existingAdmin = await userRepo.findOne({ where: { email } });
        if (existingAdmin) {
            console.log('Admin already exists. Updating password...');
            existingAdmin.password = await bcrypt.hash(password, 12);
            existingAdmin.role = 'admin';
            await userRepo.save(existingAdmin);
            console.log('✅ Admin updated successfully!');
        }
        else {
            console.log('Creating new Admin...');
            const hashedPassword = await bcrypt.hash(password, 12);
            const admin = userRepo.create({
                email,
                password: hashedPassword,
                firstName: 'Mey',
                lastName: 'Bouabdellah',
                phone: '0775436562',
                role: 'admin',
                isActive: true,
            });
            await userRepo.save(admin);
            console.log('✅ Admin created successfully!');
        }
    }
    catch (error) {
        console.error('❌ Failed to create admin:', error);
    }
    finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
        process.exit(0);
    }
}
createAdmin();
//# sourceMappingURL=create-admin.js.map