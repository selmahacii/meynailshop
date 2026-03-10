import { User } from '../../database/entities/user.entity';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(user: User): Promise<{
        statusCode: number;
        message: string;
        data: any[];
    }>;
    getUnreadCount(user: User): Promise<{
        statusCode: number;
        message: string;
        data: {
            unreadCount: number;
        };
    }>;
    markAsRead(notificationId: string, user: User): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    deleteNotification(notificationId: string, user: User): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    markAllAsRead(user: User): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
