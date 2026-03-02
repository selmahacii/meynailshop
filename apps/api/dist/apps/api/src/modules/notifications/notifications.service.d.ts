import { ConfigService } from '@nestjs/config';
export declare class NotificationsService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, html: string): Promise<void>;
    sendOrderConfirmation(email: string, orderNumber: string, total: number): Promise<void>;
    sendStockAlert(productName: string, currentStock: number): Promise<void>;
}
