import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SiteSettings } from '../../database/entities/site-settings.entity';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';

function escapeTelegramHtml(text: string): string {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function formatAlgerianPhoneForWhatsApp(phone: string): string {
    if (!phone) return '';
    const digits = phone.replace(/[^0-9]/g, '');
    if (digits.startsWith('0') && digits.length === 10) {
        return '213' + digits.slice(1);
    }
    if (digits.length === 9) {
        return '213' + digits;
    }
    return digits;
}

function formatPhoneForCallMeBot(phone: string): string {
    if (!phone) return '';
    let digits = phone.trim().replace(/[^0-9]/g, '');
    if (digits.startsWith('00')) {
        digits = digits.slice(2);
    }
    if (digits.startsWith('0') && digits.length === 10) {
        digits = '213' + digits.slice(1);
    } else if (!digits.startsWith('213') && digits.length === 9) {
        digits = '213' + digits;
    }
    return digits;
}

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        private configService: ConfigService,
        @InjectDataSource() private dataSource: DataSource,
    ) { }

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

    // CallMeBot WhatsApp Sender
    async sendWhatsAppCallMeBot(phone: string, apiKey: string, text: string): Promise<{ success: boolean; message?: string }> {
        try {
            const formattedPhone = formatPhoneForCallMeBot(phone);
            const cleanApiKey = (apiKey || '').trim();
            const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(formattedPhone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(cleanApiKey)}`;

            const response = await fetch(url, { method: 'GET' });
            const responseText = await response.text();

            if (response.ok && (responseText.toLowerCase().includes('message queued') || responseText.toLowerCase().includes('success') || responseText.toLowerCase().includes('ok'))) {
                this.logger.log(`[WhatsApp CallMeBot] Message sent to ${formattedPhone}`);
                return { success: true, message: 'Message envoyé sur WhatsApp avec succès' };
            } else {
                this.logger.warn(`[WhatsApp CallMeBot] Response from CallMeBot: ${responseText}`);
                if (responseText.toLowerCase().includes('success') || responseText.toLowerCase().includes('queued')) {
                    return { success: true, message: 'Message envoyé sur WhatsApp' };
                }
                return { success: false, message: responseText.slice(0, 200) || 'Échec de l\'envoi WhatsApp' };
            }
        } catch (error: any) {
            this.logger.error(`[WhatsApp CallMeBot] Network error: ${error.message}`);
            return { success: false, message: error.message };
        }
    }

    // Telegram Bot Sender
    async sendTelegram(botToken: string, chatId: string, htmlText: string): Promise<{ success: boolean; message?: string }> {
        try {
            const url = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId.trim(),
                    text: htmlText,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                }),
            });

            const data: any = await response.json();
            if (data.ok) {
                this.logger.log(`[Telegram] Message sent to chat ${chatId}`);
                return { success: true, message: 'Message envoyé sur Telegram avec succès' };
            } else {
                this.logger.error(`[Telegram] Error: ${data.description}`);
                return { success: false, message: data.description || 'Erreur Telegram' };
            }
        } catch (error: any) {
            this.logger.error(`[Telegram] Network error: ${error.message}`);
            return { success: false, message: error.message };
        }
    }

    // Unified Admin Order Notification Dispatcher
    async sendAdminOrderNotification(order: Order, items: OrderItem[] = []): Promise<void> {
        try {
            const settingsRepo = this.dataSource.getRepository(SiteSettings);
            const settings = await settingsRepo.findOne({ where: {} });

            if (settings && settings.notifyNewOrder === false) {
                return;
            }

            const whatsappEnabled = settings?.whatsappNotificationsEnabled ?? (this.configService.get('WHATSAPP_NOTIFICATIONS_ENABLED') === 'true');
            const whatsappPhone = settings?.whatsappPhone || this.configService.get('WHATSAPP_PHONE');
            const whatsappApiKey = settings?.whatsappApiKey || this.configService.get('CALLMEBOT_API_KEY');

            const telegramEnabled = settings?.telegramNotificationsEnabled ?? (this.configService.get('TELEGRAM_NOTIFICATIONS_ENABLED') === 'true');
            const telegramBotToken = settings?.telegramBotToken || this.configService.get('TELEGRAM_BOT_TOKEN');
            const telegramChatId = settings?.telegramChatId || this.configService.get('TELEGRAM_CHAT_ID');

            const canSendWhatsApp = whatsappEnabled && !!whatsappPhone && !!whatsappApiKey;
            const canSendTelegram = telegramEnabled && !!telegramBotToken && !!telegramChatId;

            if (!canSendWhatsApp && !canSendTelegram) {
                return;
            }

            const addr: any = order.shippingAddressSnapshot || {};
            const customerName = [addr.firstName, addr.lastName].filter(Boolean).join(' ') || addr.fullName || 'Client';
            const rawPhone = addr.phone || '';
            const wilaya = addr.wilaya || 'Non spécifiée';
            const commune = addr.commune || '';
            const street = addr.address || '';
            const fullAddress = [commune, street].filter(Boolean).join(', ') || 'Non renseignée';
            const deliveryLabel = order.deliveryType === 'desk' ? 'Point Relais (Stop Desk)' : 'Livraison à Domicile';
            const paymentLabel = order.paymentMethod === 'cib' ? 'Carte CIB / Edahabia' : 'Paiement à la livraison';
            const waPhone = formatAlgerianPhoneForWhatsApp(rawPhone);

            const itemsSummaryPlain = (items && items.length > 0)
                ? items.map(i => `• ${i.productName}${i.variantSku ? ' (' + i.variantSku + ')' : ''} x${i.quantity} — ${(Number(i.unitPrice) * i.quantity).toLocaleString('fr-DZ')} DA`).join('\n')
                : '• Voir détail commande';

            const itemsSummaryHtml = (items && items.length > 0)
                ? items.map(i => `• <b>${escapeTelegramHtml(i.productName)}</b>${i.variantSku ? ' (<code>' + escapeTelegramHtml(i.variantSku) + '</code>)' : ''} x${i.quantity} — <b>${(Number(i.unitPrice) * i.quantity).toLocaleString('fr-DZ')} DA</b>`).join('\n')
                : '• Voir détail commande';

            const shippingFormatted = Number(order.shippingCost || 0).toLocaleString('fr-DZ');
            const totalFormatted = Number(order.total || 0).toLocaleString('fr-DZ');
            const isLandingPage = Boolean(order.notes && order.notes.includes('Landing Page'));

            // 1. WhatsApp Dispatch (CallMeBot)
            if (canSendWhatsApp) {
                const waHeader = isLandingPage 
                    ? `⚡🔥 *NOUVELLE COMMANDE DIRECTE (LANDING PAGE) #${order.orderNumber}*`
                    : `🛍️ *NOUVELLE COMMANDE #${order.orderNumber}*`;

                const waLines = [
                    waHeader,
                    `━━━━━━━━━━━━━━━━━━`,
                    isLandingPage ? `🎯 *Offre :* ${order.notes}` : '',
                    `👤 *Client :* ${customerName}`,
                    `📞 *Téléphone :* ${rawPhone}`,
                    `📍 *Wilaya :* ${wilaya} (${deliveryLabel})`,
                    `🏠 *Adresse :* ${fullAddress}`,
                    ``,
                    `📦 *Articles commandés :*`,
                    itemsSummaryPlain,
                    ``,
                    `🚚 *Livraison :* ${shippingFormatted} DA`,
                    `💰 *TOTAL À ENCAISSER :* ${totalFormatted} DA`,
                    `💳 *Paiement :* ${paymentLabel}`,
                    `━━━━━━━━━━━━━━━━━━`,
                    waPhone ? `💬 *WhatsApp Client :* https://wa.me/${waPhone}` : '',
                    rawPhone ? `📞 *Appeler :* tel:${rawPhone}` : '',
                ].filter(Boolean);

                this.sendWhatsAppCallMeBot(whatsappPhone, whatsappApiKey, waLines.join('\n')).catch(e => {
                    this.logger.error(`[Admin WhatsApp Notification Error] ${e.message}`);
                });
            }

            // 2. Telegram Dispatch
            if (canSendTelegram) {
                const tgHeader = isLandingPage
                    ? `⚡🔥 <b>NOUVELLE COMMANDE DIRECTE (LANDING PAGE) #${escapeTelegramHtml(order.orderNumber)}</b>`
                    : `🛍️ <b>NOUVELLE COMMANDE #${escapeTelegramHtml(order.orderNumber)}</b>`;

                const tgLines = [
                    tgHeader,
                    `━━━━━━━━━━━━━━━━━━`,
                    isLandingPage ? `🎯 <b>Offre :</b> ${escapeTelegramHtml(order.notes || '')}` : '',
                    `👤 <b>Client :</b> ${escapeTelegramHtml(customerName)}`,
                    `📞 <b>Téléphone :</b> <code>${escapeTelegramHtml(rawPhone)}</code>`,
                    `📍 <b>Wilaya :</b> ${escapeTelegramHtml(wilaya)} (<i>${escapeTelegramHtml(deliveryLabel)}</i>)`,
                    `🏠 <b>Adresse :</b> ${escapeTelegramHtml(fullAddress)}`,
                    ``,
                    `📦 <b>Articles commandés :</b>`,
                    itemsSummaryHtml,
                    ``,
                    `🚚 <b>Livraison :</b> ${shippingFormatted} DA`,
                    `💰 <b>TOTAL À ENCAISSER :</b> <b>${totalFormatted} DA</b>`,
                    `💳 <b>Paiement :</b> ${escapeTelegramHtml(paymentLabel)}`,
                    `━━━━━━━━━━━━━━━━━━`,
                    waPhone ? `💬 <a href="https://wa.me/${waPhone}">Discuter sur WhatsApp</a>` : '',
                    rawPhone ? `📞 <a href="tel:${rawPhone}">Appeler le client</a>` : '',
                ].filter(Boolean);

                this.sendTelegram(telegramBotToken, telegramChatId, tgLines.join('\n')).catch(e => {
                    this.logger.error(`[Admin Telegram Notification Error] ${e.message}`);
                });
            }
        } catch (err: any) {
            this.logger.error(`[sendAdminOrderNotification] Error: ${err.message}`);
        }
    }

    // Test Notification Dispatcher
    async testNotification(params?: {
        channel?: 'whatsapp' | 'telegram' | 'all';
        whatsappPhone?: string;
        whatsappApiKey?: string;
        telegramBotToken?: string;
        telegramChatId?: string;
    }): Promise<{
        whatsapp?: { success: boolean; message?: string };
        telegram?: { success: boolean; message?: string };
    }> {
        const settings = await this.dataSource.getRepository(SiteSettings).findOne({ where: {} });

        const phone = params?.whatsappPhone || settings?.whatsappPhone || this.configService.get('WHATSAPP_PHONE');
        const apiKey = params?.whatsappApiKey || settings?.whatsappApiKey || this.configService.get('CALLMEBOT_API_KEY');
        const tgToken = params?.telegramBotToken || settings?.telegramBotToken || this.configService.get('TELEGRAM_BOT_TOKEN');
        const tgChat = params?.telegramChatId || settings?.telegramChatId || this.configService.get('TELEGRAM_CHAT_ID');

        const result: any = {};

        if (params?.channel === 'whatsapp' || !params?.channel || params?.channel === 'all') {
            if (!phone || !apiKey) {
                result.whatsapp = { success: false, message: 'Numéro WhatsApp ou clé API CallMeBot manquante' };
            } else {
                const waMsg = `🎉 *Test de notification réussi !*\n\nVotre boutique *MEEY Nail Shop* est correctement reliée à WhatsApp.\nVous recevrez désormais vos alertes de commandes ici dès qu'une cliente commande !`;
                result.whatsapp = await this.sendWhatsAppCallMeBot(phone, apiKey, waMsg);
            }
        }

        if (params?.channel === 'telegram' || !params?.channel || params?.channel === 'all') {
            if (!tgToken || !tgChat) {
                result.telegram = { success: false, message: 'Bot Token ou Chat ID Telegram manquant' };
            } else {
                const tgMsg = `🎉 <b>Test de notification réussi !</b>\n\nVotre boutique <b>MEEY Nail Shop</b> est correctement reliée à Telegram.\nVous recevrez désormais vos alertes de commandes instantanées ici !`;
                result.telegram = await this.sendTelegram(tgToken, tgChat, tgMsg);
            }
        }

        return result;
    }

    // User notification methods (database-backed notifications)
    async getNotifications(userId: string) {
        this.logger.log(`Fetching notifications for user ${userId}`);
        return [];
    }

    async getUnreadCount(userId: string): Promise<number> {
        this.logger.log(`Fetching unread count for user ${userId}`);
        return 0;
    }

    async markAsRead(notificationId: string, userId: string): Promise<void> {
        this.logger.log(`Marking notification ${notificationId} as read for user ${userId}`);
    }

    async deleteNotification(notificationId: string, userId: string): Promise<void> {
        this.logger.log(`Deleting notification ${notificationId} for user ${userId}`);
    }

    async markAllAsRead(userId: string): Promise<void> {
        this.logger.log(`Marking all notifications as read for user ${userId}`);
    }
}
