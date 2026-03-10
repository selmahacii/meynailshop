import { ConfigService } from '@nestjs/config';
export declare class NotificationsService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, html: string): Promise<void>;
    sendOrderConfirmation(email: string, orderNumber: string, total: number): Promise<void>;
    sendStockAlert(productName: string, currentStock: number): Promise<void>;
    getNotifications(userId: string): Promise<any[]>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<void>;
    deleteNotification(notificationId: string, userId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
}
