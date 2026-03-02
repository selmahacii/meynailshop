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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(configService) {
        this.configService = configService;
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
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map