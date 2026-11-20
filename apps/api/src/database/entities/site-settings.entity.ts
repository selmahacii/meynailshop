import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('site_settings')
export class SiteSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  shopName: string;

  @Column({ type: 'varchar', length: 255 })
  shopEmail: string;

  @Column({ type: 'varchar', length: 20 })
  shopPhone: string;

  @Column({ type: 'text' })
  shopAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  shippingCostDefault: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  freeShippingThreshold: number;

  @Column({ type: 'int', default: 5 })
  stockAlertDefault: number;

  @Column({ type: 'boolean', default: true })
  notifyStockAlert: boolean;

  @Column({ type: 'boolean', default: true })
  notifyNewOrder: boolean;

  @Column({ type: 'boolean', default: true })
  notifyNewReview: boolean;

  @Column({ type: 'jsonb', nullable: true })
  shippingFees: any;

  @Column({ type: 'text', nullable: true })
  onglerieCollectionImage?: string;

  @Column({ type: 'boolean', default: false })
  whatsappNotificationsEnabled: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  whatsappPhone?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  whatsappApiKey?: string;

  @Column({ type: 'boolean', default: false })
  telegramNotificationsEnabled: boolean;

  @Column({ type: 'varchar', length: 150, nullable: true })
  telegramBotToken?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  telegramChatId?: string;

  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  landingPages?: any;

  @UpdateDateColumn()
  updatedAt: Date;
}
