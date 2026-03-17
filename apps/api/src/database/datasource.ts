import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Review } from './entities/review.entity';
import { Coupon } from './entities/coupon.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { SiteSettings } from './entities/site-settings.entity';

// Load .env only if not in production
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.join(process.cwd(), '../../.env');
  dotenv.config({ path: envPath });
}

const url = process.env.DATABASE_URL;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: url,
  host: !url ? process.env.DB_HOST || '127.0.0.1' : undefined,
  port: !url ? parseInt(process.env.DB_PORT || '5433') : undefined,
  username: !url ? process.env.DB_USER || 'meey' : undefined,
  password: !url ? process.env.DB_PASSWORD || 'meey' : undefined,
  database: !url ? process.env.DB_NAME || 'meey_nail_shop' : undefined,
  entities: [
    User,
    Address,
    Category,
    Product,
    Order,
    OrderItem,
    Review,
    Coupon,
    WishlistItem,
    StockMovement,
    SiteSettings,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
  ssl: url ? { rejectUnauthorized: false } : false,
});
