"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
require("dotenv/config");
const url = process.env.DATABASE_URL;
console.log('URL length:', url?.length);
console.log('URL starts with:', url?.substring(0, 10));
const prisma = new client_1.PrismaClient({
    datasourceUrl: url
});
async function main() {
    try {
        const res = await prisma.$queryRaw `SELECT 1 as result`;
        console.log('Connection successful:', res);
    }
    catch (err) {
        console.error('Connection failed:', err);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=test-db.js.map