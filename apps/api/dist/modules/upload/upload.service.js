"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uploaded_file_entity_1 = require("../../database/entities/uploaded-file.entity");
let UploadService = UploadService_1 = class UploadService {
    constructor(configService, fileRepo) {
        this.configService = configService;
        this.fileRepo = fileRepo;
        this.logger = new common_1.Logger(UploadService_1.name);
        this.uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    async uploadProductImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('Fichier manquant');
        }
        const filename = `${(0, uuid_1.v4)()}.webp`;
        const filePath = path.join(this.uploadDir, filename);
        this.logger.log(`📥 Début upload image: ${filename}`);
        try {
            const processedBuffer = await (0, sharp_1.default)(file.buffer)
                .resize(800, 800, {
                fit: 'cover',
                withoutEnlargement: true,
            })
                .webp({ quality: 80 })
                .toBuffer();
            await fs.promises.writeFile(filePath, processedBuffer);
            try {
                const fileRecord = this.fileRepo.create({
                    filename,
                    data: processedBuffer,
                    mimetype: 'image/webp',
                });
                await this.fileRepo.save(fileRecord);
                this.logger.log(`💾 Image persistée en base de données : ${filename}`);
            }
            catch (dbError) {
                this.logger.error(`⚠️ Erreur sauvegarde DB pour ${filename}: ${dbError instanceof Error ? dbError.message : dbError}`);
            }
            this.logger.log(`✅ Image uploadée avec succès : ${filename}`);
            return filename;
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`❌ Erreur lors du traitement de l'image : ${errMsg}`);
            throw new common_1.BadRequestException("Erreur lors de l'upload de l'image");
        }
    }
    async deleteFile(filename) {
        this.logger.log(`🗑️ Demande de suppression : ${filename}`);
        try {
            const filePath = path.join(this.uploadDir, filename);
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
                this.logger.log(`✅ Fichier supprimé du disque : ${filename}`);
            }
            await this.fileRepo.delete({ filename });
            this.logger.log(`✅ Fichier supprimé de la base de données : ${filename}`);
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Error deleting file ${filename}: ${errMsg}`);
        }
    }
    getFileUrl(filename) {
        const isProd = process.env.NODE_ENV === 'production';
        const baseUrl = process.env.API_URL || (isProd ? 'https://meeynailshop-api.onrender.com' : 'http://127.0.0.1:3001');
        return `${baseUrl.replace(/\/$/, '')}/uploads/${filename}`;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(uploaded_file_entity_1.UploadedFileEntity)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository])
], UploadService);
//# sourceMappingURL=upload.service.js.map