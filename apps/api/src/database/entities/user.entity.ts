import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Address } from './address.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { WishlistItem } from './wishlist-item.entity';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({
    type: 'enum',
    enum: ['client', 'admin'],
    default: 'client',
  })
  role: 'client' | 'admin';

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Address, (address) => address.user, {
    cascade: true,
    eager: false,
  })
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.user, {
    cascade: false,
    eager: false,
  })
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user, {
    cascade: false,
    eager: false,
  })
  reviews: Review[];

  @OneToMany(() => WishlistItem, (wishlistItem) => wishlistItem.user, {
    cascade: true,
    eager: false,
  })
  wishlistItems: WishlistItem[];
}
