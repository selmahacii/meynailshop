import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSettings } from '../../database/entities/site-settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService implements OnModuleInit {
    constructor(
        @InjectRepository(SiteSettings)
        private settingsRepository: Repository<SiteSettings>,
    ) { }

    async onModuleInit() {
        await this.ensureSettingsExist();
    }

    private async ensureSettingsExist() {
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

    async getSettings(): Promise<SiteSettings> {
        const settings = await this.settingsRepository.find();
        if (settings.length === 0) {
            throw new NotFoundException('Settings not found');
        }
        return settings[0];
    }

    async updateSettings(updateSettingsDto: UpdateSettingsDto): Promise<SiteSettings> {
        const settings = await this.getSettings();
        Object.assign(settings, updateSettingsDto);
        return this.settingsRepository.save(settings);
    }
}
