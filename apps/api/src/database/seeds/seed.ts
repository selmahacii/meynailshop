import { AppDataSource } from '../datasource';
import { seedUsers } from './users.seed';
import { seedCategories } from './categories.seed';
import { seedProducts } from './products.seed';

async function seed() {
  const connection = AppDataSource;
  if (!connection.isInitialized) {
    await connection.initialize();
  }

  console.log('🌱 Seeding database...');
  
  try {
    await seedUsers(connection);
    console.log('✓ Users seeded');
    
    await seedCategories(connection);
    console.log('✓ Categories seeded');
    
    await seedProducts(connection);
    console.log('✓ Products seeded');
    
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await connection.destroy();
  }
}

seed();
