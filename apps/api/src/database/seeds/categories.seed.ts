import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';

export async function seedCategories(connection: DataSource) {
  const categoryRepo = connection.getRepository(Category);

  const categories = [
    { name: 'Vernis Gel', slug: 'vernis-gel', description: 'Vernis gel premium pour ongles' },
    { name: 'Gel UV', slug: 'gel-uv', description: 'Gels UV haute performance' },
    { name: 'Décoration', slug: 'decoration', description: 'Décorations et embellissements' },
    { name: 'Matériel', slug: 'materiel', description: 'Outils et matériel professionnel' },
    { name: 'Finition', slug: 'finition', description: 'Produits de finition' },
  ];

  for (let i = 0; i < categories.length; i++) {
    categoryRepo.create({
      ...categories[i],
      displayOrder: i,
      imageUrl: `https://via.placeholder.com/300x300?text=${categories[i].name}`,
      isActive: true,
    });
  }
}
