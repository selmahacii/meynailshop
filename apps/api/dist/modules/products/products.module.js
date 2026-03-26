"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../database/entities");
const products_service_1 = require("./products.service");
const categories_service_1 = require("./categories.service");
const products_controller_1 = require("./products.controller");
const categories_controller_1 = require("./categories.controller");
let StoreProductsModule = class StoreProductsModule {
};
exports.StoreProductsModule = StoreProductsModule;
exports.StoreProductsModule = StoreProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([entities_1.Product, entities_1.Category, entities_1.SubCategory])],
        providers: [products_service_1.ProductsService, categories_service_1.CategoriesService],
        controllers: [products_controller_1.StoreProductsController, categories_controller_1.CategoriesController],
        exports: [products_service_1.ProductsService, categories_service_1.CategoriesService],
    })
], StoreProductsModule);
//# sourceMappingURL=products.module.js.map