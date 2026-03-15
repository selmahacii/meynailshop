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
        host: configService.get('DB_HOST', '127.0.0.1'),
        port: configService.get('DB_PORT', 5433),
        username: configService.get('DB_USER', 'meey'),
        password: configService.get('DB_PASSWORD', 'meey'),
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
        synchronize: false, // On désactive pour éviter les verrous (deadlocks) en dev
        logging: configService.get('NODE_ENV') === 'development',
        migrationsRun: false,
        migrationsTableName: 'migrations',
      }),
    }),
  ],
})
export class DatabaseModule {}
