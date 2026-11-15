"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const site_settings_entity_1 = require("../../database/entities/site-settings.entity");
function escapeTelegramHtml(text) {
    if (!text)
        return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
function formatAlgerianPhoneForWhatsApp(phone) {
    if (!phone)
        return '';
    const digits = phone.replace(/[^0-9]/g, '');
    if (digits.startsWith('0') && digits.length === 10) {
        return '213' + digits.slice(1);
    }
    if (digits.length === 9) {
        return '213' + digits;
    }
    return digits;
}
function formatPhoneForCallMeBot(phone) {
    if (!phone)
        return '';
    let clean = phone.trim().replace(/\s+/g, '');
    if (clean.startsWith('00')) {
        clean = '+' + clean.slice(2);
    }
    else if (!clean.startsWith('+')) {
        if (clean.startsWith('0') && clean.length === 10) {
            clean = '+213' + clean.slice(1);
        }
        else if (!clean.startsWith('213')) {
            clean = '+213' + clean;
        }
        else {
            clean = '+' + clean;
        }
    }
    return clean;
}
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(configService, dataSource) {
        this.configService = configService;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async sendEmail(to, subject, html) {
        this.logger.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
    }
    async sendOrderConfirmation(email, orderNumber, total) {
        const subject = `Confirmation de votre commande ${orderNumber}`;
        const html = `
      <h1>Merci pour votre commande !</h1>
      <p>Votre commande <strong>${orderNumber}</strong> d'un montant de <strong>${total} DA</strong> a été reçue.</p>
      <p>Nous vous contacterons dès qu'elle sera expédiée.</p>
    `;
        await this.sendEmail(email, subject, html);
    }
    async sendStockAlert(productName, currentStock) {
        const adminEmail = this.configService.get('ADMIN_EMAIL') ?? 'admin@meey.dz';
        const subject = `Alerte Stock : ${productName}`;
        const html = `
      <h1>Alerte Stock faible</h1>
      <p>Le produit <strong>${productName}</strong> est bientôt en rupture de stock.</p>
      <p>Stock actuel : <strong>${currentStock}</strong></p>
    `;
        await this.sendEmail(adminEmail, subject, html);
    }
    async sendWhatsAppCallMeBot(phone, apiKey, text) {
        try {
            const formattedPhone = formatPhoneForCallMeBot(phone);
            const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(formattedPhone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`;
            const response = await fetch(url, { method: 'GET' });
            const responseText = await response.text();
            if (response.ok && (responseText.toLowerCase().includes('message queued') || responseText.toLowerCase().includes('success') || responseText.toLowerCase().includes('ok'))) {
                this.logger.log(`[WhatsApp CallMeBot] Message sent to ${formattedPhone}`);
                return { success: true, message: 'Message envoyé sur WhatsApp avec succès' };
            }
            else {
                this.logger.warn(`[WhatsApp CallMeBot] Response from CallMeBot: ${responseText}`);
                if (responseText.toLowerCase().includes('success') || responseText.toLowerCase().includes('queued')) {
                    return { success: true, message: 'Message envoyé sur WhatsApp' };
                }
                return { success: false, message: responseText.slice(0, 200) || 'Échec de l\'envoi WhatsApp' };
            }
        }
        catch (error) {
            this.logger.error(`[WhatsApp CallMeBot] Network error: ${error.message}`);
            return { success: false, message: error.message };
        }
    }
    async sendTelegram(botToken, chatId, htmlText) {
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
            const data = await response.json();
            if (data.ok) {
                this.logger.log(`[Telegram] Message sent to chat ${chatId}`);
                return { success: true, message: 'Message envoyé sur Telegram avec succès' };
            }
            else {
                this.logger.error(`[Telegram] Error: ${data.description}`);
                return { success: false, message: data.description || 'Erreur Telegram' };
            }
        }
        catch (error) {
            this.logger.error(`[Telegram] Network error: ${error.message}`);
            return { success: false, message: error.message };
        }
    }
    async sendAdminOrderNotification(order, items = []) {
        try {
            const settingsRepo = this.dataSource.getRepository(site_settings_entity_1.SiteSettings);
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
            const addr = order.shippingAddressSnapshot || {};
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
            if (canSendWhatsApp) {
                const waLines = [
                    `🛍️ *NOUVELLE COMMANDE #${order.orderNumber}*`,
                    `━━━━━━━━━━━━━━━━━━`,
                    `👤 *Client :* ${customerName}`,
                    `📞 *Téléphone :* ${rawPhone}`,
                    `📍 *Wilaya :* ${wilaya} (${deliveryLabel})`,
                    `🏠 *Adresse :* ${fullAddress}`,
                    ``,
                    `📦 *Articles commandés :*`,
                    itemsSummaryPlain,
                    ``,
                    `🚚 *Livraison :* ${shippingFormatted} DA`,
                    `💰 *TOTAL :* ${totalFormatted} DA`,
                    `💳 *Paiement :* ${paymentLabel}`,
                    `━━━━━━━━━━━━━━━━━━`,
                    waPhone ? `💬 *WhatsApp Client :* https://wa.me/${waPhone}` : '',
                    rawPhone ? `📞 *Appeler :* tel:${rawPhone}` : '',
                ].filter(Boolean);
                this.sendWhatsAppCallMeBot(whatsappPhone, whatsappApiKey, waLines.join('\n')).catch(e => {
                    this.logger.error(`[Admin WhatsApp Notification Error] ${e.message}`);
                });
            }
            if (canSendTelegram) {
                const tgLines = [
                    `🛍️ <b>NOUVELLE COMMANDE #${escapeTelegramHtml(order.orderNumber)}</b>`,
                    `━━━━━━━━━━━━━━━━━━`,
                    `👤 <b>Client :</b> ${escapeTelegramHtml(customerName)}`,
                    `📞 <b>Téléphone :</b> <code>${escapeTelegramHtml(rawPhone)}</code>`,
                    `📍 <b>Wilaya :</b> ${escapeTelegramHtml(wilaya)} (<i>${escapeTelegramHtml(deliveryLabel)}</i>)`,
                    `🏠 <b>Adresse :</b> ${escapeTelegramHtml(fullAddress)}`,
                    ``,
                    `📦 <b>Articles commandés :</b>`,
                    itemsSummaryHtml,
                    ``,
                    `🚚 <b>Livraison :</b> ${shippingFormatted} DA`,
                    `💰 <b>TOTAL :</b> <b>${totalFormatted} DA</b>`,
                    `💳 <b>Paiement :</b> ${escapeTelegramHtml(paymentLabel)}`,
                    `━━━━━━━━━━━━━━━━━━`,
                    waPhone ? `💬 <a href="https://wa.me/${waPhone}">Discuter sur WhatsApp</a>` : '',
                    rawPhone ? `📞 <a href="tel:${rawPhone}">Appeler le client</a>` : '',
                ].filter(Boolean);
                this.sendTelegram(telegramBotToken, telegramChatId, tgLines.join('\n')).catch(e => {
                    this.logger.error(`[Admin Telegram Notification Error] ${e.message}`);
                });
            }
        }
        catch (err) {
            this.logger.error(`[sendAdminOrderNotification] Error: ${err.message}`);
        }
    }
    async testNotification(params) {
        const settings = await this.dataSource.getRepository(site_settings_entity_1.SiteSettings).findOne({ where: {} });
        const phone = params?.whatsappPhone || settings?.whatsappPhone || this.configService.get('WHATSAPP_PHONE');
        const apiKey = params?.whatsappApiKey || settings?.whatsappApiKey || this.configService.get('CALLMEBOT_API_KEY');
        const tgToken = params?.telegramBotToken || settings?.telegramBotToken || this.configService.get('TELEGRAM_BOT_TOKEN');
        const tgChat = params?.telegramChatId || settings?.telegramChatId || this.configService.get('TELEGRAM_CHAT_ID');
        const result = {};
        if (params?.channel === 'whatsapp' || !params?.channel || params?.channel === 'all') {
            if (!phone || !apiKey) {
                result.whatsapp = { success: false, message: 'Numéro WhatsApp ou clé API CallMeBot manquante' };
            }
            else {
                const waMsg = `🎉 *Test de notification réussi !*\n\nVotre boutique *MEEY Nail Shop* est correctement reliée à WhatsApp.\nVous recevrez désormais vos alertes de commandes ici dès qu'une cliente commande !`;
                result.whatsapp = await this.sendWhatsAppCallMeBot(phone, apiKey, waMsg);
            }
        }
        if (params?.channel === 'telegram' || !params?.channel || params?.channel === 'all') {
            if (!tgToken || !tgChat) {
                result.telegram = { success: false, message: 'Bot Token ou Chat ID Telegram manquant' };
            }
            else {
                const tgMsg = `🎉 <b>Test de notification réussi !</b>\n\nVotre boutique <b>MEEY Nail Shop</b> est correctement reliée à Telegram.\nVous recevrez désormais vos alertes de commandes instantanées ici !`;
                result.telegram = await this.sendTelegram(tgToken, tgChat, tgMsg);
            }
        }
        return result;
    }
    async getNotifications(userId) {
        this.logger.log(`Fetching notifications for user ${userId}`);
        return [];
    }
    async getUnreadCount(userId) {
        this.logger.log(`Fetching unread count for user ${userId}`);
        return 0;
    }
    async markAsRead(notificationId, userId) {
        this.logger.log(`Marking notification ${notificationId} as read for user ${userId}`);
    }
    async deleteNotification(notificationId, userId) {
        this.logger.log(`Deleting notification ${notificationId} for user ${userId}`);
    }
    async markAllAsRead(userId) {
        this.logger.log(`Marking all notifications as read for user ${userId}`);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.DataSource])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map