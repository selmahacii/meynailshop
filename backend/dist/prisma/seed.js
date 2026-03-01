"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
require("dotenv/config");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Start seeding...');
    await prisma.$transaction([
        prisma.review.deleteMany(),
        prisma.orderItem.deleteMany(),
        prisma.order.deleteMany(),
        prisma.productVariant.deleteMany(),
        prisma.product.deleteMany(),
        prisma.category.deleteMany(),
        prisma.adminUser.deleteMany(),
    ]);
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Gel UV',
                slug: 'gel-uv',
                image: '/images/cat-gel.jpg',
                description: 'Gels professionnels pour construction et couleur.',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Vernis',
                slug: 'vernis',
                image: '/images/cat-vernis.jpg',
                description: 'Vernis semi-permanents longue tenue.',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Outils',
                slug: 'outils',
                image: '/images/cat-outils.jpg',
                description: 'Limes, poussettes et accessoires.',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Strass & Déco',
                slug: 'strass-deco',
                image: '/images/cat-strass.jpg',
                description: 'Pour des nail art étincelants.',
            },
        }),
    ]);
    const [gelCat, vernisCat, outilsCat, strassCat] = categories;
    const products = [
        {
            name: 'Gel UV Rose Quartz',
            description: 'Gel UV finition brillante, couleur quartz naturel.',
            price: 24.9,
            compareAtPrice: 29.9,
            stock: 35,
            categoryId: gelCat.id,
            isTopSeller: true,
            isFeatured: true,
            sku: 'GEL-RQ-15',
            images: ['/images/prod-1.jpg'],
            rating: 4.8,
            reviewCount: 42,
        },
        {
            name: 'Vernis Semi-Permanent Bordeaux',
            description: 'Rouge bordeaux profond intense.',
            price: 12.9,
            stock: 45,
            categoryId: vernisCat.id,
            isTopSeller: true,
            sku: 'VRN-BD-10',
            images: ['/images/prod-2.jpg'],
            rating: 4.5,
            reviewCount: 28,
        },
        {
            name: 'Kit Strass Swarovski',
            description: 'Luxe absolu pour vos ongles.',
            price: 14.5,
            stock: 8,
            categoryId: strassCat.id,
            isTopSeller: true,
            sku: 'STR-SW-1440',
            images: ['/images/prod-3.jpg'],
            rating: 4.9,
            reviewCount: 67,
        },
        {
            name: 'Lime Pro 100/180',
            description: 'Lime robuste double face.',
            price: 6.9,
            stock: 120,
            categoryId: outilsCat.id,
            sku: 'OUT-LP-1',
            images: ['/images/prod-4.jpg'],
            rating: 4.7,
            reviewCount: 91,
        },
        {
            name: 'Gel Builder Clear',
            description: 'Construction transparente ultra-solide.',
            price: 29.9,
            stock: 15,
            categoryId: gelCat.id,
            isFeatured: true,
            sku: 'GEL-BC-15',
            images: ['/images/prod-5.jpg'],
            rating: 4.8,
            reviewCount: 53,
        },
    ];
    for (const p of products) {
        await prisma.product.create({
            data: {
                ...p,
                slug: p.name.toLowerCase().replace(/\s+/g, '-'),
            },
        });
    }
    await prisma.adminUser.create({
        data: {
            name: 'Meynail Admin',
            email: 'admin@meey.fr',
            password: 'strong-password',
        },
    });
    for (let i = 0; i < 10; i++) {
        await prisma.order.create({
            data: {
                orderNumber: `ORD-2026-${1000 + i}`,
                customerName: `Client ${i + 1}`,
                customerEmail: `client${i}@test.com`,
                total: 50 + i * 10,
                subtotal: 45 + i * 10,
                shipping: 5,
                status: i % 2 === 0 ? 'DELIVERED' : 'PROCESSING',
            },
        });
    }
    console.log('✅ Seeding complete.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map