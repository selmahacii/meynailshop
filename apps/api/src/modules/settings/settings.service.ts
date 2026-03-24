import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SiteSettings } from '../../database/entities/site-settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService implements OnModuleInit {
    constructor(
        @InjectRepository(SiteSettings)
        private settingsRepository: Repository<SiteSettings>,
        @InjectDataSource()
        private dataSource: DataSource,
    ) { }

    async onModuleInit() {
        await this.ensureSettingsExist();
    }

    private async ensureSettingsExist() {
        const settings = await this.settingsRepository.find();
        if (settings.length === 0) {
            const defaultSettings = this.settingsRepository.create({
                shopName: 'MEEY Nail Shop',
                shopEmail: 'contact@meey.dz',
                shopPhone: '0555555555',
                shopAddress: 'Alger, Algérie',
                shippingCostDefault: 600,
                freeShippingThreshold: 10000,
                stockAlertDefault: 5,
            });
            await this.settingsRepository.save(defaultSettings);
        }
    }

    async getSettings(): Promise<SiteSettings> {
        const settings = await this.settingsRepository.find();
        if (settings.length === 0) {
            throw new NotFoundException('Settings not found');
        }
        return settings[0];
    }

    async updateSettings(updateSettingsDto: UpdateSettingsDto): Promise<SiteSettings> {
        const settings = await this.getSettings();
        Object.assign(settings, updateSettingsDto);
        return this.settingsRepository.save(settings);
    }

    async resetShop() {
        // Sauvegarder les réglages actuels pour les restaurer après le truncate
        const currentSettings = await this.getSettings();

        // On vide toutes les tables principales
        // On utilise les noms exacts spécifiés dans les décorateurs @Entity()
        const tables = [
            'order_items', 
            'orders', 
            'addresses', 
            'products', 
            'categories', 
            'sub_categories', 
            'reviews', 
            'coupons', 
            'stock_movements', 
            'wishlist_items', 
            'users'
        ];

        try {
            // Désactiver les triggers de clés étrangères temporairement pour postgres si besoin, 
            // ou utiliser CASCADE qui est plus propre.
            await this.dataSource.query(`TRUNCATE TABLE ${tables.map(t => `"${t}"`).join(', ')} RESTART IDENTITY CASCADE`);

            // Restaurer le compte admin par défaut si possible ou au moins un admin vide ?
            // On restaure les réglages de la boutique
            await this.settingsRepository.save(currentSettings);
            
            return { message: 'Boutique réinitialisée avec succès' };
        } catch (error) {
            console.error('Erreur lors du reset de la boutique:', error);
            throw new Error('Échec de la réinitialisation de la boutique');
        }
    }
}
