import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SiteSettings } from '../../database/entities/site-settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsService implements OnModuleInit {
    private settingsRepository;
    constructor(settingsRepository: Repository<SiteSettings>);
    onModuleInit(): Promise<void>;
    private ensureSettingsExist;
    getSettings(): Promise<SiteSettings>;
    updateSettings(updateSettingsDto: UpdateSettingsDto): Promise<SiteSettings>;
}
