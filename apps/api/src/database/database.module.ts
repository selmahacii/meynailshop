import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
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
} from './entities';

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
        migrationsRun: false,
        migrationsTableName: 'migrations',
      }),
    }),
  ],
})
export class DatabaseModule {}
