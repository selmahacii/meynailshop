import { OnModuleInit } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { SiteSettings } from '../../database/entities/site-settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';
export declare const DEFAULT_SHIPPING_FEES: {
    id: string;
    name: string;
    delay: string;
    homeRate: number;
    deskRate: number;
    returnRate: number;
}[];
export declare const DEFAULT_LANDING_PAGES: {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    brandName: string;
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    price: number;
    compareAtPrice: number;
    currency: string;
    photos: string[];
    items: {
        id: string;
        nameFr: string;
        descDz: string;
        quantity: number;
    }[];
    isAccordion: boolean;
    accordionTitle: string;
    variants: any[];
    hasVariants: boolean;
    deliveryText: string;
    guaranteeText: string;
    instagramUrl: string;
    instagramMessage: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}[];
export declare class SettingsService implements OnModuleInit {
    private settingsRepository;
    private dataSource;
    constructor(settingsRepository: Repository<SiteSettings>, dataSource: DataSource);
    onModuleInit(): Promise<void>;
    private ensureSettingsExist;
    getSettings(): Promise<SiteSettings>;
    updateSettings(updateSettingsDto: UpdateSettingsDto): Promise<SiteSettings>;
    resetShop(): Promise<{
        message: string;
    }>;
}
