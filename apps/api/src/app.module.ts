import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { DatabaseModule } from './database/database.module';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CartModule } from './modules/cart/cart.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { StockModule } from './modules/stock/stock.module';
import { UploadModule } from './modules/upload/upload.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SettingsModule } from './modules/settings/settings.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

// API v1 modules
import { DashboardModule as DashboardV1 } from './api/v1/dashboard/dashboard.module';
import { ProductsModule as ProductsV1 } from './api/v1/products/products.module';
import { OrdersModule as OrdersV1 } from './api/v1/orders/orders.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CartModule,
    ReviewsModule,
    StockModule,
    UploadModule,
    WishlistModule,
    CouponsModule,
    AnalyticsModule,
    SettingsModule,
    NotificationsModule,
    DashboardV1,
    ProductsV1,
    OrdersV1,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

