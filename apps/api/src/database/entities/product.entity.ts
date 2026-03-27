import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Category } from './category.entity';
import { SubCategory } from './sub-category.entity';

@Entity('products')
@Index(['slug'])
@Index(['sku'])
@Index(['categoryId'])
@Index(['price'])
@Index(['isActive'])
@Index(['isFeatured'])
@Index(['createdAt'])
@Unique(['slug'])
@Unique(['sku'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 500 })
  shortDescription: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  comparePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costPrice: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int', default: 5 })
  stockAlert: number;

  @Column({ type: 'simple-array', default: '' })
  images: string[];

  @Column({ type: 'uuid' })
  categoryId: string;

  @Column({ type: 'uuid', nullable: true })
  subCategoryId: string;

  @Column({
    type: 'enum',
    enum: ['top', 'new', 'promo'],
    nullable: true,
    default: null,
  })
  badge: 'top' | 'new' | 'promo' | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  weight: number;

  @Column({ type: 'simple-array', default: '' })
  tags: string[];

  @Column({ type: 'boolean', default: false })
  hasVariants: boolean;

  @Column({ type: 'jsonb', nullable: true, default: null })
  variants: { sku: string; image: string; stock: number }[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: SubCategory;
}
