"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedProducts = seedProducts;
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
async function seedProducts(connection) {
    const productRepo = connection.getRepository(product_entity_1.Product);
    const categoryRepo = connection.getRepository(category_entity_1.Category);
    const dbCategories = await categoryRepo.find();
    const catMap = dbCategories.reduce((acc, cat) => {
        acc[cat.slug] = cat.id;
        return acc;
    }, {});
    const products = [
        { name: 'Vernis OPI Red', sku: 'MEY-001', price: 1200, category: 'vernis-gel' },
        { name: 'Gel UV Clear', sku: 'MEY-002', price: 1500, category: 'gel-uv' },
        { name: 'Cristaux Swarovski', sku: 'MEY-003', price: 800, category: 'decoration' },
        { name: 'Pince à ongles', sku: 'MEY-004', price: 500, category: 'materiel' },
        { name: 'Top Coat Brillant', sku: 'MEY-005', price: 900, category: 'finition' },
    ];
    for (const p of products) {
        const product = productRepo.create({
            name: p.name,
            slug: p.name.toLowerCase().replace(/\s+/g, '-'),
            sku: p.sku,
            price: p.price,
            costPrice: p.price * 0.4,
            description: `Description détaillée pour ${p.name}`,
            shortDescription: `${p.name} de qualité premium`,
            stock: 50,
            stockAlert: 10,
            images: ['https://placehold.co/800x800?text=' + encodeURIComponent(p.name)],
            categoryId: catMap[p.category] || dbCategories[0]?.id,
            isActive: true,
            isFeatured: Math.random() > 0.5,
            weight: 100,
            tags: ['premium', 'algerie'],
            badge: Math.random() > 0.7 ? 'top' : null,
        });
        await productRepo.save(product);
    }
}
//# sourceMappingURL=products.seed.js.map