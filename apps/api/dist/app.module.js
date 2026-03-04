"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cache_manager_1 = require("@nestjs/cache-manager");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const products_module_1 = require("./modules/products/products.module");
const orders_module_1 = require("./modules/orders/orders.module");
const cart_module_1 = require("./modules/cart/cart.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const stock_module_1 = require("./modules/stock/stock.module");
const upload_module_1 = require("./modules/upload/upload.module");
const wishlist_module_1 = require("./modules/wishlist/wishlist.module");
const coupons_module_1 = require("./modules/coupons/coupons.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const settings_module_1 = require("./modules/settings/settings.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            cache_manager_1.CacheModule.register({ isGlobal: true }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            cart_module_1.CartModule,
            reviews_module_1.ReviewsModule,
            stock_module_1.StockModule,
            upload_module_1.UploadModule,
            wishlist_module_1.WishlistModule,
            coupons_module_1.CouponsModule,
            analytics_module_1.AnalyticsModule,
            settings_module_1.SettingsModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map