import { DataSource } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';

export async function seedProducts(connection: DataSource) {
  const productRepo = connection.getRepository(Product);
  const categoryRepo = connection.getRepository(Category);

  // Get real category IDs
  const dbCategories = await categoryRepo.find();
  const catMap = dbCategories.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {} as Record<string, string>);

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
      images: ['https://via.placeholder.com/800x800?text=' + p.name],
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
