import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { DatabaseModule } from './database/database.module';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CartModule } from './modules/cart/cart.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { StockModule } from './modules/stock/stock.module';
import { UploadModule } from './modules/upload/upload.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SettingsModule } from './modules/settings/settings.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

// API v1 modules (new)
import { DashboardModule as DashboardV1 } from './api/v1/dashboard/dashboard.module';
import { ProductsModule as ProductsV1 } from './api/v1/products/products.module';
import { OrdersModule as OrdersV1 } from './api/v1/orders/orders.module';
import { StoreProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps/api/.env'),
        join(process.cwd(), '../../.env'),
      ],
    }),
    CacheModule.register({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
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
    StoreProductsModule,
    OrdersV1,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

