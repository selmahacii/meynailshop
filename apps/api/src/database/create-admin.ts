import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

// 1. Load environment variables
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

const { AppDataSource } = require('../datasource');
const { User } = require('../entities/user.entity');

async function createAdmin() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepo = AppDataSource.getRepository(User);
    const email = 'meeybouabdellah@gmail.com';
    const password = 'meey2026';

    const existingAdmin = await userRepo.findOne({ where: { email } });

    if (existingAdmin) {
      console.log('Admin already exists. Updating password...');
      existingAdmin.password = await bcrypt.hash(password, 12);
      existingAdmin.role = 'admin';
      await userRepo.save(existingAdmin);
      console.log('✅ Admin updated successfully!');
    } else {
      console.log('Creating new Admin...');
      const hashedPassword = await bcrypt.hash(password, 12);
      const admin = userRepo.create({
        email,
        password: hashedPassword,
        firstName: 'Mey',
        lastName: 'Bouabdellah',
        phone: '0775436562',
        role: 'admin',
        isActive: true,
      });
      await userRepo.save(admin);
      console.log('✅ Admin created successfully!');
    }
  } catch (error) {
    console.error('❌ Failed to create admin:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(0);
  }
}

createAdmin();
