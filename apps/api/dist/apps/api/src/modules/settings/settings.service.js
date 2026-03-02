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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const site_settings_entity_1 = require("../../database/entities/site-settings.entity");
let SettingsService = class SettingsService {
    constructor(settingsRepository) {
        this.settingsRepository = settingsRepository;
    }
    async onModuleInit() {
        await this.ensureSettingsExist();
    }
    async ensureSettingsExist() {
        const settings = await this.settingsRepository.find();
        if (settings.length === 0) {
            const defaultSettings = this.settingsRepository.create({
                shopName: 'MEEY Nail Shop',
                shopEmail: 'contact@meey.dz',
                shopPhone: '0555555555',
                shopAddress: 'Alger, Algérie',
                shippingCostDefault: 600,
                freeShippingThreshold: 10000,
                stockAlertDefault: 5,
            });
            await this.settingsRepository.save(defaultSettings);
        }
    }
    async getSettings() {
        const settings = await this.settingsRepository.find();
        if (settings.length === 0) {
            throw new common_1.NotFoundException('Settings not found');
        }
        return settings[0];
    }
    async updateSettings(updateSettingsDto) {
        const settings = await this.getSettings();
        Object.assign(settings, updateSettingsDto);
        return this.settingsRepository.save(settings);
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(site_settings_entity_1.SiteSettings)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SettingsService);
//# sourceMappingURL=settings.service.js.map