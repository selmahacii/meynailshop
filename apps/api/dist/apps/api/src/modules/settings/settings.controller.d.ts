import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<import("../../database/entities/site-settings.entity").SiteSettings>;
    updateSettings(updateSettingsDto: UpdateSettingsDto): Promise<import("../../database/entities/site-settings.entity").SiteSettings>;
}
