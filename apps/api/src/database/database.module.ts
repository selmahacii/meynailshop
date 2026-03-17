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
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          url: url,
          host: !url ? configService.get('DB_HOST', '127.0.0.1') : undefined,
          port: !url ? configService.get('DB_PORT', 5433) : undefined,
          username: !url ? configService.get('DB_USER', 'meey') : undefined,
          password: !url ? configService.get('DB_PASSWORD', 'meey') : undefined,
          database: !url ? configService.get('DB_NAME', 'meey_nail_shop') : undefined,
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
          synchronize: configService.get('NODE_ENV') !== 'production',
          logging: configService.get('NODE_ENV') === 'development',
          migrationsRun: configService.get('NODE_ENV') === 'production',
          migrationsTableName: 'migrations',
          ssl: url ? { rejectUnauthorized: false } : false,
          extra: url ? {
            ssl: {
              rejectUnauthorized: false,
            },
          } : undefined,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
