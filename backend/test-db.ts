import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const url = process.env.DATABASE_URL;
console.log('URL length:', url?.length);
console.log('URL starts with:', url?.substring(0, 10));

// @ts-ignore
const prisma = new PrismaClient({
    datasourceUrl: url
});

async function main() {
    try {
        const res = await prisma.$queryRaw`SELECT 1 as result`;
        console.log('Connection successful:', res);
    } catch (err) {
        console.error('Connection failed:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
