import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(private configService: ConfigService) { }

    async sendEmail(to: string, subject: string, html: string): Promise<void> {
        // Email via nodemailer (add nodemailer install when SMTP is configured)
        this.logger.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
    }

    async sendOrderConfirmation(email: string, orderNumber: string, total: number): Promise<void> {
        const subject = `Confirmation de votre commande ${orderNumber}`;
        const html = `
      <h1>Merci pour votre commande !</h1>
      <p>Votre commande <strong>${orderNumber}</strong> d'un montant de <strong>${total} DA</strong> a été reçue.</p>
      <p>Nous vous contacterons dès qu'elle sera expédiée.</p>
    `;
        await this.sendEmail(email, subject, html);
    }

    async sendStockAlert(productName: string, currentStock: number): Promise<void> {
        const adminEmail = this.configService.get<string>('ADMIN_EMAIL') ?? 'admin@meey.dz';
        const subject = `Alerte Stock : ${productName}`;
        const html = `
      <h1>Alerte Stock faible</h1>
      <p>Le produit <strong>${productName}</strong> est bientôt en rupture de stock.</p>
      <p>Stock actuel : <strong>${currentStock}</strong></p>
    `;
        await this.sendEmail(adminEmail, subject, html);
    }

    // User notification methods (database-backed notifications)
    async getNotifications(userId: string) {
        // TODO: Implement database-backed notifications
        this.logger.log(`Fetching notifications for user ${userId}`);
        return [];
    }

    async getUnreadCount(userId: string): Promise<number> {
        // TODO: Implement database-backed unread count
        this.logger.log(`Fetching unread count for user ${userId}`);
        return 0;
    }

    async markAsRead(notificationId: string, userId: string): Promise<void> {
        // TODO: Implement mark as read in database
        this.logger.log(`Marking notification ${notificationId} as read for user ${userId}`);
    }

    async deleteNotification(notificationId: string, userId: string): Promise<void> {
        // TODO: Implement delete notification from database
        this.logger.log(`Deleting notification ${notificationId} for user ${userId}`);
    }

    async markAllAsRead(userId: string): Promise<void> {
        // TODO: Implement mark all as read in database
        this.logger.log(`Marking all notifications as read for user ${userId}`);
    }
}

