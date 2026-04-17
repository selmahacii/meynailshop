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
                shippingFees: [
                    { "id": "01", "name": "Adrar", "delay": "2-5", "homeRate": 1500, "deskRate": 800, "returnRate": 300 },
                    { "id": "02", "name": "Chlef", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
                    { "id": "03", "name": "Laghouat", "delay": "1-3", "homeRate": 950, "deskRate": 550, "returnRate": 200 },
                    { "id": "04", "name": "Oum El Bouaghi", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
                    { "id": "05", "name": "Batna", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
                    { "id": "06", "name": "Bejaia", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
                    { "id": "07", "name": "Biskra", "delay": "1-3", "homeRate": 900, "deskRate": 550, "returnRate": 200 },
                    { "id": "08", "name": "Bechar", "delay": "2-5", "homeRate": 1200, "deskRate": 700, "returnRate": 300 },
                    { "id": "09", "name": "Blida", "delay": "1", "homeRate": 700, "deskRate": 400, "returnRate": 200 },
                    { "id": "10", "name": "Bouira", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
                    { "id": "11", "name": "Tamanrasset", "delay": "5-8", "homeRate": 1800, "deskRate": 950, "returnRate": 350 },
                    { "id": "12", "name": "Tebessa", "delay": "1-3", "homeRate": 900, "deskRate": 500, "returnRate": 200 },
                    { "id": "13", "name": "Tlemcen", "delay": "1-3", "homeRate": 900, "deskRate": 450, "returnRate": 200 },
                    { "id": "14", "name": "Tiaret", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
                    { "id": "15", "name": "Tizi Ouzou", "delay": "1-3", "homeRate": 800, "deskRate": 400, "returnRate": 200 },
                    { "id": "16", "name": "Alger", "delay": "0-1", "homeRate": 500, "deskRate": 300, "returnRate": 200 },
                    { "id": "17", "name": "Djelfa", "delay": "1-3", "homeRate": 950, "deskRate": 500, "returnRate": 200 },
                    { "id": "18", "name": "Jijel", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
                    { "id": "19", "name": "Setif", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
                    { "id": "20", "name": "Saïda", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
                    { "id": "21", "name": "Skikda", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
                    { "id": "22", "name": "Sidi Bel Abbes", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
                    { "id": "23", "name": "Annaba", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
                    { "id": "24", "name": "Guelma", "delay": "1-3", "homeRate": 900, "deskRate": 500, "returnRate": 200 },
                    { "id": "25", "name": "Constantine", "delay": "1-3", "homeRate": 800, "deskRate": 450, "returnRate": 200 },
                    { "id": "26", "name": "Médéa", "delay": "1-3", "homeRate": 800, "deskRate": 450, "returnRate": 200 },
                    { "id": "27", "name": "Mostaganem", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
                    { "id": "28", "name": "M’Sila", "delay": "1-3", "homeRate": 900, "deskRate": 500, "returnRate": 200 },
                    { "id": "29", "name": "Mascara", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
                    { "id": "30", "name": "Ouargla", "delay": "2-5", "homeRate": 1000, "deskRate": 650, "returnRate": 200 },
                    { "id": "31", "name": "Oran", "delay": "1-3", "homeRate": 850, "deskRate": 450, "returnRate": 200 },
                    { "id": "32", "name": "El Bayadh", "delay": "1-3", "homeRate": 1050, "deskRate": 700, "returnRate": 200 },
                    { "id": "33", "name": "Ilizi", "delay": "5-8", "homeRate": 2100, "deskRate": 1200, "returnRate": 300 },
                    { "id": "34", "name": "Bordj Bou Arreridj", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
                    { "id": "35", "name": "Boumerdès", "delay": "1", "homeRate": 700, "deskRate": 400, "returnRate": 200 },
                    { "id": "36", "name": "El-Tarf", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
                    { "id": "37", "name": "Tindouf", "delay": "5-8", "homeRate": 1700, "deskRate": 800, "returnRate": 300 },
                    { "id": "38", "name": "Tissemsilt", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
                    { "id": "39", "name": "El oued", "delay": "1-3", "homeRate": 1050, "deskRate": 700, "returnRate": 200 },
                    { "id": "40", "name": "Khenchela", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
                    { "id": "41", "name": "Souk Ahras", "delay": "1-3", "homeRate": 900, "deskRate": 500, "returnRate": 200 },
                    { "id": "42", "name": "Tipaza", "delay": "1", "homeRate": 700, "deskRate": null, "returnRate": 200 },
                    { "id": "43", "name": "Mila", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
                    { "id": "44", "name": "Ain Defla", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
                    { "id": "45", "name": "Naâma", "delay": "2-6", "homeRate": 1200, "deskRate": 700, "returnRate": 300 },
                    { "id": "46", "name": "Ain Temouchent", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
                    { "id": "47", "name": "Ghardaia", "delay": "2-5", "homeRate": 950, "deskRate": 550, "returnRate": 300 },
                    { "id": "48", "name": "Rélizane", "delay": "1-3", "homeRate": 850, "deskRate": 500, "returnRate": 200 },
                    { "id": "49", "name": "Timimoun", "delay": "2-6", "homeRate": 1600, "deskRate": 850, "returnRate": 300 },
                    { "id": "51", "name": "Ouled Djellal", "delay": "1-3", "homeRate": 950, "deskRate": 550, "returnRate": 300 },
                    { "id": "52", "name": "Beni Abbes", "delay": "2-6", "homeRate": 1300, "deskRate": null, "returnRate": 300 },
                    { "id": "53", "name": "In salah", "delay": "5-8", "homeRate": 1900, "deskRate": 1400, "returnRate": 300 },
                    { "id": "55", "name": "Touggourt", "delay": "2-5", "homeRate": 1000, "deskRate": null, "returnRate": 300 },
                    { "id": "57", "name": "El M'Ghair", "delay": "2-5", "homeRate": 1200, "deskRate": null, "returnRate": 300 },
                    { "id": "58", "name": "El Menia", "delay": "2-5", "homeRate": 1100, "deskRate": 700, "returnRate": 300 }
                ]
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
