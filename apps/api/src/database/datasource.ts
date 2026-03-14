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

// Load .env from root
dotenv.config({ path: path.join(process.cwd(), '../../.env') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5433'),
  username: process.env.DB_USER || 'meey',
  password: process.env.DB_PASSWORD || 'meey',
  database: process.env.DB_NAME || 'meey_nail_shop',
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
});
