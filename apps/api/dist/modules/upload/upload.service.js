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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
let UploadService = UploadService_1 = class UploadService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(UploadService_1.name);
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_KEY');
        this.bucket = this.configService.get('SUPABASE_BUCKET', 'products');
        if (!supabaseUrl || !supabaseKey) {
            this.logger.error('❌ Supabase configuration missing (URL or KEY)');
            throw new Error('Supabase configuration missing');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    async uploadProductImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('Fichier manquant');
        }
        const filename = `${(0, uuid_1.v4)()}.webp`;
        this.logger.log(`📥 Début upload image vers Supabase Storage: ${filename}`);
        try {
            const processedImageBuffer = await (0, sharp_1.default)(file.buffer)
                .resize(800, 800, {
                fit: 'cover',
                withoutEnlargement: true,
            })
                .webp({ quality: 80 })
                .toBuffer();
            const { data, error } = await this.supabase.storage
                .from(this.bucket)
                .upload(filename, processedImageBuffer, {
                contentType: 'image/webp',
                upsert: true,
            });
            if (error) {
                throw error;
            }
            this.logger.log(`✅ Image uploadée avec succès sur Supabase : ${filename}`);
            return filename;
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`❌ Erreur fatale lors de l'upload Supabase : ${errMsg}`);
            throw new common_1.BadRequestException("Erreur lors de l'upload vers Supabase Storage");
        }
    }
    async deleteFile(filename) {
        this.logger.log(`🗑️ Demande de suppression sur Supabase : ${filename}`);
        try {
            const { error } = await this.supabase.storage
                .from(this.bucket)
                .remove([filename]);
            if (error) {
                throw error;
            }
            this.logger.log(`✅ Fichier supprimé de Supabase : ${filename}`);
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Error deleting file ${filename} from Supabase: ${errMsg}`);
        }
    }
    getFileUrl(filename) {
        const { data } = this.supabase.storage
            .from(this.bucket)
            .getPublicUrl(filename);
        if (!data || !data.publicUrl) {
            this.logger.warn(`⚠️ Impossible de générer l'URL publique pour : ${filename}`);
            return filename;
        }
        this.logger.log(`🖼️ URL publique Supabase générée : ${data.publicUrl}`);
        return data.publicUrl;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map