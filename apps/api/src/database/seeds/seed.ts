import * as dotenv from 'dotenv';
import * as path from 'path';

// 1. Load environment variables BEFORE anything else
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

console.log('🌱 Environment loaded from:', envPath);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PORT:', process.env.DB_PORT);

// 2. Dynamically import DataSource after env variables are set
// We use require to avoid ESM import hoisting
const { AppDataSource } = require('../datasource');

// 3. Import seeds (these can stay as ESM imports)
import { seedUsers } from './users.seed';
import { seedCategories } from './categories.seed';
import { seedProducts } from './products.seed';
import { seedOrders } from './orders.seed';

async function seed() {
  const connection = AppDataSource;
  
  try {
    if (!connection.isInitialized) {
      await connection.initialize();
    }

    console.log('🚀 Successfully connected to database');
    console.log('🌱 Seeding database...');
    
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
    if (connection.isInitialized) {
      await connection.destroy();
    }
  }
}

seed();
