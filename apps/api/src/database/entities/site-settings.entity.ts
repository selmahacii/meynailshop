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

  @UpdateDateColumn()
  updatedAt: Date;
}
