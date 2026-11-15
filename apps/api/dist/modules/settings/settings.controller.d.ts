import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class SettingsController {
    private readonly settingsService;
    private readonly notificationsService;
    constructor(settingsService: SettingsService, notificationsService: NotificationsService);
    getSettings(): Promise<import("../../database/entities").SiteSettings>;
    updateSettings(updateSettingsDto: UpdateSettingsDto): Promise<import("../../database/entities").SiteSettings>;
    resetShop(): Promise<{
        message: string;
    }>;
    testNotification(body: any): Promise<{
        whatsapp?: {
            success: boolean;
            message?: string;
        };
        telegram?: {
            success: boolean;
            message?: string;
        };
    }>;
}
