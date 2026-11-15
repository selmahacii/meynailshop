import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
export declare class NotificationsService {
    private configService;
    private dataSource;
    private readonly logger;
    constructor(configService: ConfigService, dataSource: DataSource);
    sendEmail(to: string, subject: string, html: string): Promise<void>;
    sendOrderConfirmation(email: string, orderNumber: string, total: number): Promise<void>;
    sendStockAlert(productName: string, currentStock: number): Promise<void>;
    sendWhatsAppCallMeBot(phone: string, apiKey: string, text: string): Promise<{
        success: boolean;
        message?: string;
    }>;
    sendTelegram(botToken: string, chatId: string, htmlText: string): Promise<{
        success: boolean;
        message?: string;
    }>;
    sendAdminOrderNotification(order: Order, items?: OrderItem[]): Promise<void>;
    testNotification(params?: {
        channel?: 'whatsapp' | 'telegram' | 'all';
        whatsappPhone?: string;
        whatsappApiKey?: string;
        telegramBotToken?: string;
        telegramChatId?: string;
    }): Promise<{
        whatsapp?: {
            success: boolean;
            message?: string;
        };
        telegram?: {
            success: boolean;
            message?: string;
        };
    }>;
    getNotifications(userId: string): Promise<any[]>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<void>;
    deleteNotification(notificationId: string, userId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
}
