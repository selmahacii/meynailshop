"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCategories = seedCategories;
const category_entity_1 = require("../entities/category.entity");
async function seedCategories(connection) {
    const categoryRepo = connection.getRepository(category_entity_1.Category);
    const categories = [
        { name: 'Vernis Gel', slug: 'vernis-gel', description: 'Vernis gel premium pour ongles' },
        { name: 'Gel UV', slug: 'gel-uv', description: 'Gels UV haute performance' },
        { name: 'Décoration', slug: 'decoration', description: 'Décorations et embellissements' },
        { name: 'Matériel', slug: 'materiel', description: 'Outils et matériel professionnel' },
        { name: 'Finition', slug: 'finition', description: 'Produits de finition' },
    ];
    for (let i = 0; i < categories.length; i++) {
        const category = categoryRepo.create({
            ...categories[i],
            displayOrder: i,
            imageUrl: `https://placehold.co/300x300?text=${encodeURIComponent(categories[i].name)}`,
            isActive: true,
        });
        await categoryRepo.save(category);
    }
}
//# sourceMappingURL=categories.seed.js.map