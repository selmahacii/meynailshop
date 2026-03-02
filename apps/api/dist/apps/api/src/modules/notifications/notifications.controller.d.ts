import { User } from '@/database/entities/user.entity';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(user: User): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getUnreadCount(user: User): Promise<{
        statusCode: number;
        message: string;
        data: {
            unreadCount: any;
        };
    }>;
    markAsRead(notificationId: string, user: User): Promise<{
        statusCode: number;
        message: string;
        data: null;
    }>;
    deleteNotification(notificationId: string, user: User): Promise<{
        statusCode: number;
        message: string;
        data: null;
    }>;
    markAllAsRead(user: User): Promise<{
        statusCode: number;
        message: string;
        data: null;
    }>;
}
