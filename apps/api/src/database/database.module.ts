import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USER', 'meey'),
        password: configService.get('DB_PASSWORD', 'meey_password_2026'),
        database: configService.get('DB_NAME', 'meey_nail_shop'),
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
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        migrations: ['src/database/migrations/*.ts'],
        migrationsTableName: 'migrations',
      }),
    }),
  ],
})
export class DatabaseModule {}
