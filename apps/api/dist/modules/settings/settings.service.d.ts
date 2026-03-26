import { OnModuleInit } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { SiteSettings } from '../../database/entities/site-settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsService implements OnModuleInit {
    private settingsRepository;
    private dataSource;
    constructor(settingsRepository: Repository<SiteSettings>, dataSource: DataSource);
    onModuleInit(): Promise<void>;
    private ensureSettingsExist;
    getSettings(): Promise<SiteSettings>;
    updateSettings(updateSettingsDto: UpdateSettingsDto): Promise<SiteSettings>;
    resetShop(): Promise<{
        message: string;
    }>;
}
