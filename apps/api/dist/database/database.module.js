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
const entities_1 = require("./entities");
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
                        entities_1.User,
                        entities_1.Address,
                        entities_1.Category,
                        entities_1.Product,
                        entities_1.Order,
                        entities_1.OrderItem,
                        entities_1.Review,
                        entities_1.Coupon,
                        entities_1.WishlistItem,
                        entities_1.StockMovement,
                        entities_1.SiteSettings,
                    ],
                    synchronize: configService.get('NODE_ENV') === 'development',
                    logging: configService.get('NODE_ENV') === 'development',
                    migrationsRun: false,
                    migrationsTableName: 'migrations',
                }),
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map