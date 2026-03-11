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
exports.seedUsers = seedUsers;
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../entities/user.entity");
const address_entity_1 = require("../entities/address.entity");
async function seedUsers(connection) {
    const userRepo = connection.getRepository(user_entity_1.User);
    const addressRepo = connection.getRepository(address_entity_1.Address);
    const hashedPassword = await bcrypt.hash('Admin@2026', 12);
    const admin = userRepo.create({
        email: 'admin@meey.dz',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'MEEY',
        phone: '+213501234567',
        role: 'admin',
        isActive: true,
    });
    await userRepo.save(admin);
    const clients = [];
    for (let i = 1; i <= 5; i++) {
        const hashedClientPassword = await bcrypt.hash('Client@2026', 12);
        const client = userRepo.create({
            email: `client${i}@meey.dz`,
            password: hashedClientPassword,
            firstName: `Client${i}`,
            lastName: 'MEEY',
            phone: `+21350123456${i}`,
            role: 'client',
            isActive: true,
        });
        clients.push(await userRepo.save(client));
    }
    for (const client of clients) {
        await addressRepo.save(addressRepo.create({
            userId: client.id,
            label: 'Domicile',
            fullName: client.firstName + ' ' + client.lastName,
            phone: client.phone,
            wilaya: '16',
            commune: 'Alger-Centre',
            address: '123 Rue Didouche Mourad',
            postalCode: '16000',
            isDefault: true,
        }));
    }
}
//# sourceMappingURL=users.seed.js.map