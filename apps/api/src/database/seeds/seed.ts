import * as dotenv from 'dotenv';
import { AppDataSource } from '../datasource';
import { seedUsers } from './users.seed';
import { seedCategories } from './categories.seed';
import { seedProducts } from './products.seed';
import { seedOrders } from './orders.seed';

// Load environment variables
const envPath = require('path').resolve(__dirname, '../../../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);

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

    await seedOrders(connection);
    console.log('✓ Orders seeded');
    
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await connection.destroy();
  }
}

seed();
