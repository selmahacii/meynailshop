"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("./entities/user.entity");
const address_entity_1 = require("./entities/address.entity");
const category_entity_1 = require("./entities/category.entity");
const product_entity_1 = require("./entities/product.entity");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const review_entity_1 = require("./entities/review.entity");
const coupon_entity_1 = require("./entities/coupon.entity");
const wishlist_item_entity_1 = require("./entities/wishlist-item.entity");
const stock_movement_entity_1 = require("./entities/stock-movement.entity");
const site_settings_entity_1 = require("./entities/site-settings.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USER', 'meey'),
                    password: configService.get('DB_PASSWORD', 'meey_password_2026'),
                    database: configService.get('DB_NAME', 'meey_nail_shop'),
                    entities: [
                        user_entity_1.User,
                        address_entity_1.Address,
                        category_entity_1.Category,
                        product_entity_1.Product,
                        order_entity_1.Order,
                        order_item_entity_1.OrderItem,
                        review_entity_1.Review,
                        coupon_entity_1.Coupon,
                        wishlist_item_entity_1.WishlistItem,
                        stock_movement_entity_1.StockMovement,
                        site_settings_entity_1.SiteSettings,
                    ],
                    synchronize: configService.get('NODE_ENV') === 'development',
                    logging: configService.get('NODE_ENV') === 'development',
                    migrations: ['src/database/migrations/*.ts'],
                    migrationsTableName: 'migrations',
                }),
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map