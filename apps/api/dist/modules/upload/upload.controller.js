"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const upload_service_1 = require("./upload.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const shared_1 = require("@meey/shared");
let UploadController = class UploadController {
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadProductImage(file) {
        const filename = await this.uploadService.uploadProductImage(file);
        return {
            statusCode: 201,
            message: 'Image uploadée avec succès',
            data: {
                filename,
                url: this.uploadService.getFileUrl(filename),
            },
        };
    }
    async uploadProductImages(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('Aucun fichier fourni');
        }
        const results = await Promise.all(files.map(async (file) => {
            const filename = await this.uploadService.uploadProductImage(file);
            return {
                filename,
                url: this.uploadService.getFileUrl(filename),
            };
        }));
        return {
            statusCode: 201,
            message: 'Images uploadées avec succès',
            data: results,
        };
    }
    async deleteFile(filename) {
        await this.uploadService.deleteFile(filename);
        return {
            statusCode: 200,
            message: 'Fichier supprimé avec succès',
        };
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('product-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadProductImage", null);
__decorate([
    (0, common_1.Post)('product-images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10)),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadProductImages", null);
__decorate([
    (0, common_1.Delete)(':filename'),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteFile", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map